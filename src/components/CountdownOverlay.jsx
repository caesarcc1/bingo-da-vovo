import React, { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundEffects';

export function CountdownOverlay({ onComplete, vovoName }) {
  const [step, setStep] = useState('prep');
  const audioRef = useRef(null);

  useEffect(() => {
    // Garante cancelamento de qualquer voz anterior presa no buffer do navegador
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Toca a narração natural em português com voz da Francisca Neural
    const audio = new Audio('/audio/countdown.mp3');
    audioRef.current = audio;
    audio.volume = 1.0;
    
    // Tenta tocar o áudio da contagem
    audio.play().catch(() => {
      // Fallback gracioso com SFX caso haja bloqueio de áudio
      soundFX.playBallDrawn();
    });

    const t3 = setTimeout(() => {
      setStep(3);
      soundFX.playPop();
    }, 1100);

    const t2 = setTimeout(() => {
      setStep(2);
      soundFX.playPop();
    }, 2000);

    const t1 = setTimeout(() => {
      setStep(1);
      soundFX.playPop();
    }, 2900);

    const tGo = setTimeout(() => {
      setStep('go');
      soundFX.playBallDrawn();
    }, 3800);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 4900);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tGo);
      clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-pop-in">
      <div className="flex flex-col items-center justify-center text-center max-w-sm">
        <p className="text-amber-400 font-black text-xl sm:text-2xl uppercase tracking-widest mb-4">
          Prepare sua cartela!
        </p>

        {/* Círculo com a Animação da Contagem */}
        <div
          key={step}
          className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl border-6 border-white animate-pop-in"
          style={{
            boxShadow: '0 0 55px rgba(245, 158, 11, 0.7)'
          }}
        >
          {step === 'prep' ? (
            <span className="text-slate-950 font-black text-2xl sm:text-3xl px-2 text-center uppercase tracking-tight">
              Preparar!
            </span>
          ) : step === 'go' ? (
            <span className="text-slate-950 font-black text-3xl sm:text-4xl px-2 text-center uppercase leading-tight">
              Valendo!
            </span>
          ) : (
            <span className="text-slate-950 font-black text-8xl sm:text-9xl drop-shadow">
              {step}
            </span>
          )}
        </div>

        <p className="text-white font-extrabold text-lg sm:text-xl mt-6 drop-shadow">
          {step === 'go' ? 'Boa sorte a todos!' : 'O sorteio vai começar!'}
        </p>
      </div>
    </div>
  );
}
