// Service Worker do Bingo da Vovó (PWA Offline & Alta Resiliência)
// Permite que o tablet da Vovó jogue 100% sem conexão à internet!

const CACHE_NAME = 'bingo-da-vovo-v6';

const BALL_AUDIO_URLS = Array.from({ length: 75 }, (_, i) => `/audio/balls/${i + 1}.mp3`);

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.svg',
  '/default-avatar.svg',
  '/vovo.jpg',
  '/timerWorker.js',
  '/audio/bossa.mp3',
  ...BALL_AUDIO_URLS
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Pré-carrega arquivos essenciais para o jogo funcionar offline imediatamente
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Aviso ao pré-carregar alguns assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Não interceptar tráfego dinâmico de WebSocket / Socket.io
  if (url.pathname.startsWith('/socket.io/') || url.pathname.startsWith('/health')) {
    return;
  }

  // 1. Requisição de Navegação de Página (abrir app / recarregar)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // TOTALMENTE OFFLINE: devolve index.html salvo no cache do tablet
          const cachedNavigate = await caches.match(request);
          if (cachedNavigate) return cachedNavigate;
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          return caches.match('/');
        })
    );
    return;
  }

  // 2. Arquivos Estáticos (JS compilado, CSS, Imagens, Áudios)
  // Estratégia Stale-While-Revalidate: Responde imediatamente do cache e atualiza via rede
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          // Sem internet: não quebra nada pois o cache já foi ou será servido
        });

      return cachedResponse || fetchPromise;
    })
  );
});
