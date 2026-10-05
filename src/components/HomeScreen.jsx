import React from 'react';
import { Play, Settings, ShieldCheck, Heart, Sparkles, Volume2, Music } from 'lucide-react';

export function HomeScreen({
  vovoName,
  onStartGame,
  onOpenSettings,
  onOpenFamilyGuide
}) {
  return (
    <div
      className="h-[100dvh] w-screen flex flex-col items-center justify-between p-4 sm:p-8 select-none text-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)'
      }}
    >
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Topo: Logo & Título */}
      <header className="relative z-10 pt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-3 shadow-sm">
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>Feito com todo carinho</span>
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-lg tracking-tight">
          {vovoName}
        </h1>

        <p className="text-slate-300 font-bold text-base sm:text-xl mt-2 max-w-lg">
          Cartela única, números grandes e narração por voz para você se divertir!
        </p>
      </header>

      {/* Centro: Destaque da Partida & Botão Gigante de JOGAR */}
      <main className="relative z-10 my-auto flex flex-col items-center max-w-md w-full">
        {/* Ícone de Cartela com Bolinhas Coloridas */}
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl border-4 border-amber-300 transform -rotate-3 hover:rotate-0 transition-transform">
            <div className="grid grid-cols-2 gap-2 p-2">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow">
                B
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow">
                I
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow">
                N
              </div>
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow">
                O
              </div>
            </div>
          </div>
          {/* Brilho flutuante */}
          <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-3 -right-3 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Botão Gigante Pulsante: JOGAR BINGO */}
        <button
          onClick={onStartGame}
          type="button"
          className="w-full flex items-center justify-center gap-4 py-5 sm:py-6 px-8 rounded-3xl font-black text-2xl sm:text-3xl md:text-4xl text-white shadow-2xl transition-all transform active:scale-95 border-b-8 border-emerald-800 hover:brightness-105"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
            boxShadow: '0 16px 32px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4)'
          }}
        >
          <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-current" />
          <span>JOGAR BINGO!</span>
        </button>
      </main>

      {/* Rodapé: Acesso a Opções & Dicas */}
      <footer className="relative z-10 w-full max-w-lg flex items-center justify-center gap-3 sm:gap-4 pb-4">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-sm sm:text-base shadow backdrop-blur-sm transition-all"
        >
          <Settings className="w-5 h-5 text-amber-400" />
          <span>Opções & Som</span>
        </button>

        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-sm sm:text-base shadow backdrop-blur-sm transition-all"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Blindar Tablet</span>
        </button>
      </footer>
    </div>
  );
}
