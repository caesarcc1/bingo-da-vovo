import { useState, useEffect, useRef } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const wakeLockRef = useRef(null);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsLocked(true);

        wakeLockRef.current.addEventListener('release', () => {
          setIsLocked(false);
        });
      } catch (err) {
        // WakeLock pode falhar se a bateria estiver em economia extrema
        setIsLocked(false);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setIsLocked(false);
      } catch (err) {}
    }
  };

  useEffect(() => {
    requestWakeLock();

    // Reativar se a usuária alternar de janela e voltar para o jogo
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, []);

  return { isLocked, requestWakeLock, releaseWakeLock };
}
