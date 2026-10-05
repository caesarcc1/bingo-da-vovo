import { useEffect, useRef } from 'react';

export function useBackgroundKeepalive({ onBackgroundTick } = {}) {
  const workerRef = useRef(null);
  const tickRef = useRef(onBackgroundTick);
  tickRef.current = onBackgroundTick;

  useEffect(() => {
    // Inicializar Web Worker para timers contínuos em segundo plano
    if (typeof window !== 'undefined' && window.Worker) {
      try {
        const worker = new Worker('/timerWorker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
          if (e.data?.type === 'tick' && tickRef.current) {
            tickRef.current();
          }
        };

        worker.postMessage({ command: 'start', interval: 1000 });
      } catch (err) {
        console.warn('Worker keepalive não pôde ser iniciado:', err);
      }
    }

    return () => {
      if (workerRef.current) {
        try {
          workerRef.current.postMessage({ command: 'stop' });
          workerRef.current.terminate();
        } catch (e) {}
        workerRef.current = null;
      }
    };
  }, []); // Executa apenas UMA VEZ ao montar

  return {};
}
