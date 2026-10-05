import { useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundEffects';

export function useBackgroundKeepalive({ isAutoMark, isAutoBingo, onBackgroundTick }) {
  const workerRef = useRef(null);
  const audioKeepaliveRef = useRef(null);

  useEffect(() => {
    // 1. Inicializar Web Worker para timers contínuos
    if (window.Worker) {
      try {
        const worker = new Worker('/timerWorker.js');
        workerRef.current = worker;

        worker.onmessage = (e) => {
          if (e.data.type === 'tick') {
            if (onBackgroundTick) onBackgroundTick();
          }
        };

        worker.postMessage({ command: 'start', interval: 1000 });
      } catch (err) {
        console.warn('Web Worker não pôde ser iniciado:', err);
      }
    }

    // 2. Audio Keepalive silencioso para manter a sessão de mídia do navegador acordada no Android
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime); // volume praticamente inaudível para manter viva a thread
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        audioKeepaliveRef.current = { ctx, osc };
      }
    } catch (e) {}

    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ command: 'stop' });
        workerRef.current.terminate();
      }
      if (audioKeepaliveRef.current) {
        audioKeepaliveRef.current.osc?.stop();
        audioKeepaliveRef.current.ctx?.close().catch(() => {});
      }
    };
  }, [onBackgroundTick]);

  return {};
}
