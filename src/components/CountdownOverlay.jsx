import React, { useState, useEffect } from 'react';
import { soundFX } from '../utils/soundEffects';

export function CountdownOverlay({ onComplete, vovoName }) {
  const [step, setStep] = useState(3);

  useEffect(() => {
    // Tocar som de preparação
    soundFX.playBallDrawn();

    // Locução rápida da contagem se disponível
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance("Preparar... Três... dois... um... Boa sorte!");
      utter.lang = 'pt-BR';
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    }

    const t3 = setTimeout(() => {
      setStep(2);
      soundFX.playPop();
    }, 900);

    const t2 = setTimeout(() => {
      setStep(1);
      soundFX.playPop();
    }, 1800);

    const t1 = setTimeout(() => {
      setStep('go');
      soundFX.playBallDrawn();
    }, 2700);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-pop-in">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-amber-400 font-black text-xl sm:text-2xl uppercase tracking-widest mb-4">
          Prepare sua cartela!
        </p>

        {/* Círculo com o Número da Contagem */}
        <div
          key={step}
          className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-2xl border-6 border-white animate-pop-in"
          style={{
            boxShadow: '0 0 50px rgba(245, 158, 11, 0.6)'
          }}
        >
          {step === 'go' ? (
            <span className="text-slate-950 font-black text-3xl sm:text-4xl px-2 text-center uppercase leading-tight">
              Boa Sorte!
            </span>
          ) : (
            <span className="text-slate-950 font-black text-7xl sm:text-9xl drop-shadow">
              {step}
            </span>
          )}
        </div>

        <p className="text-white font-extrabold text-lg sm:text-2xl mt-6 drop-shadow">
          O sorteio vai começar automaticamente!
        </p>
      </div>
    </div>
  );
}
