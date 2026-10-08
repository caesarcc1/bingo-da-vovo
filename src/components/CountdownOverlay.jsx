import React, { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundEffects';

export function CountdownOverlay({ onComplete, vovoName, narratorVoice = 'vovo' }) {
  const [step, setStep] = useState('prep');
  const audioRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    // Trava de execução única: impede repetição caso o componente pai re-renderize
    if (startedRef.current) return;
    startedRef.current = true;

    // Cancela qualquer fala residual de speechSynthesis no navegador
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Seleciona o áudio do narrador atual
    let audioUrl = '/audio/countdown.mp3';
    if (narratorVoice === 'silvio') {
      audioUrl = '/audio/silvio/countdown.mp3';
    } else if (narratorVoice === 'quermesse') {
      audioUrl = '/audio/quermesse/countdown.mp3';
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.volume = 1.0;

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch {
          // Ignora
        }
        audioRef.current = null;
      }
      onCompleteRef.current?.();
    };

    // Conclui naturalmente quando o áudio terminar de falar
    audio.onended = () => {
      setTimeout(finish, 350);
    };

    // Tenta reproduzir o áudio
    audio.play().catch(() => {
      soundFX.playBallDrawn();
    });

    // Animação visual sincronizada dos números (3, 2, 1, Valendo)
    const t3 = setTimeout(() => {
      setStep(3);
      soundFX.playPop();
    }, 1200);

    const t2 = setTimeout(() => {
      setStep(2);
      soundFX.playPop();
    }, 2200);

    const t1 = setTimeout(() => {
      setStep(1);
      soundFX.playPop();
    }, 3200);

    const tGo = setTimeout(() => {
      setStep('go');
      soundFX.playBallDrawn();
    }, 4200);

    // Timeout de segurança caso o navegador bloqueie o evento onended
    const maxDuration = narratorVoice === 'silvio' ? 6200 : 5500;
    const tFallback = setTimeout(finish, maxDuration);

    return () => {
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tGo);
      clearTimeout(tFallback);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.src = '';
        } catch {
          // Ignora
        }
        audioRef.current = null;
      }
    };
  }, [narratorVoice]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-pop-in">
      <div className="flex flex-col items-center justify-center text-center max-w-sm">
        <p className="text-amber-400 font-black text-xl sm:text-2xl uppercase tracking-widest mb-4">
          {narratorVoice === 'silvio'
            ? 'Atenção no Auditório!'
            : narratorVoice === 'quermesse'
            ? 'Atenção Festeiros!'
            : 'Prepare sua cartela!'}
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
              {narratorVoice === 'silvio' ? 'Má oee!' : narratorVoice === 'quermesse' ? 'Olha o Bingo!' : 'Preparar!'}
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
          {step === 'go'
            ? narratorVoice === 'silvio'
              ? 'Quem vai ganhar no auditório?!'
              : narratorVoice === 'quermesse'
              ? 'Roda a roleta do bingo!'
              : 'Boa sorte a todos!'
            : 'O sorteio vai começar!'}
        </p>
      </div>
    </div>
  );
}
