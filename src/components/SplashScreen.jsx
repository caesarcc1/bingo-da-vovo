import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Transição suave após 2.4 segundos
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 450); // tempo do fade out
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer transition-opacity duration-500
        ${fading ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)'
      }}
    >
      {/* Efeito de Brilho de Fundo */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Globo e Bolas Saltando */}
      <div className="relative mb-6">
        {/* Bola Principal Dourada (Centro) */}
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center shadow-2xl relative border-4 border-amber-300 animate-pop-in"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #fbbf24 0%, #d97706 70%, #78350f 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.6)'
          }}
        >
          <div className="w-14 h-7 bg-white/40 rounded-full absolute top-3 transform -rotate-12 blur-[1px]" />
          <span className="text-white font-black text-xs sm:text-sm tracking-widest uppercase opacity-90">
            BINGO
          </span>
          <div className="bg-white rounded-full w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center shadow-inner mt-0.5">
            <span className="text-slate-950 font-black text-2xl sm:text-3xl">75</span>
          </div>
        </div>

        {/* Bolinha Vermelha Saltitante (Esquerda) */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-700 to-rose-400 absolute -bottom-2 -left-8 sm:-left-12 flex items-center justify-center text-white font-black text-lg shadow-xl border-2 border-white/80 animate-bounce"
          style={{ animationDuration: '1.4s' }}
        >
          B
        </div>

        {/* Bolinha Azul Saltitante (Direita) */}
        <div
          className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-blue-700 to-blue-400 absolute -top-4 -right-8 sm:-right-12 flex items-center justify-center text-white font-black text-xl shadow-xl border-2 border-white/80 animate-bounce"
          style={{ animationDuration: '1.8s' }}
        >
          O
        </div>
      </div>

      {/* Título com Efeito Dourado Reluzente */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-amber-400 font-extrabold tracking-widest text-sm uppercase">
            Diversão & Carinho
          </span>
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-lg tracking-tight">
          Bingo da Vovó
        </h1>

        <p className="text-slate-300 font-medium text-base sm:text-xl mt-3 max-w-md">
          Números grandes, narração por voz e o clássico feijãozinho na cartela!
        </p>

        <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-xs text-slate-300 backdrop-blur-sm">
          <span>Toque na tela para entrar</span>
        </div>
      </div>
    </div>
  );
}
