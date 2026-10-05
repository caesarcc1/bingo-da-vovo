import React from 'react';
import { Play, Settings, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';

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
      <header className="relative z-10 pt-2 sm:pt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-2 shadow-sm">
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>Feito com todo amor para você</span>
          <Heart className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-lg tracking-tight">
          {vovoName}
        </h1>

        <p className="text-slate-300 font-bold text-sm sm:text-lg mt-1 max-w-lg">
          Linhas, colunas, diagonais e quatro pontas valem BINGO no pódio!
        </p>
      </header>

      {/* Centro: Foto da Vovó + Botão Gigante de JOGAR */}
      <main className="relative z-10 my-auto flex flex-col items-center max-w-md w-full">
        {/* Foto Carinhosa da Vovó em Destaque */}
        <div className="relative mb-5 flex items-center justify-center">
          <VirtualPlayerAvatar
            playerId="vovo"
            isVovo={true}
            size={110}
            className="border-4 border-amber-400 shadow-2xl ring-6 ring-amber-300/40"
          />
          {/* Estrelas Brilhantes */}
          <Sparkles className="w-7 h-7 text-yellow-300 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[11px] px-3 py-0.5 rounded-full shadow uppercase tracking-wider">
            Nossa Campeã
          </div>
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
      <footer className="relative z-10 w-full max-w-lg flex items-center justify-center gap-3 sm:gap-4 pb-2 sm:pb-4">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs sm:text-sm shadow backdrop-blur-sm transition-all"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Opções & Som</span>
        </button>

        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs sm:text-sm shadow backdrop-blur-sm transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Blindar Tablet</span>
        </button>
      </footer>
    </div>
  );
}
