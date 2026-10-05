// timerWorker.js - Web Worker para garantir execução contínua em segundo plano
// Evita o congelamento de timers pelo navegador no celular quando o usuário troca de app

let timerId = null;

self.onmessage = function (e) {
  const { command, interval } = e.data;

  if (command === 'start') {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      self.postMessage({ type: 'tick', timestamp: Date.now() });
    }, interval || 1000);
  } else if (command === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
