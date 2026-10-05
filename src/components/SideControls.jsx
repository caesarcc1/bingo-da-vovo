import React, { useState, useRef } from 'react';
import { RotateCcw, LogOut, Music, Settings, ShieldAlert, Maximize } from 'lucide-react';
import { BingoClaimButton } from './BingoClaimButton';

export function SideControls({
  isBingoReady,
  onClaimBingo,
  markedCount,
  onResetGame,
  onRequestExit,
  musicPlaying,
  onToggleMusic,
  onOpenSettings,
  onOpenFamilyGuide
}) {
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const holdIntervalRef = useRef(null);
  const holdStartTimeRef = useRef(null);

  // Manipulador da Trava da Vovó (segurar 2.5s para reiniciar)
  const handleHoldStart = () => {
    holdStartTimeRef.current = Date.now();
    const duration = 2500;

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      setResetHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
        setResetHoldProgress(0);
        onResetGame();
      }
    }, 50);
  };

  const handleHoldEnd = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
      if (resetHoldProgress < 95 && resetHoldProgress > 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setResetHoldProgress(0);
    }
  };

  return (
    <aside className="w-full md:w-56 lg:w-64 flex flex-col justify-center gap-2.5 sm:gap-3 select-none flex-shrink-0 z-10">
      {/* Toast de Aviso da Trava */}
      {showToast && (
        <div className="bg-amber-600 text-white px-3 py-2 rounded-2xl shadow-xl text-center text-xs font-black animate-bounce">
          🔒 Segure por 3 segundos para reiniciar!
        </div>
      )}

      {/* 1. Botão de BINGO Brilhante da Play Store */}
      <div className="w-full flex justify-center">
        <BingoClaimButton
          isBingoReady={isBingoReady}
          onClaimBingo={onClaimBingo}
          markedCount={markedCount}
        />
      </div>

      {/* 2. Botão de Nova Cartela com Trava da Vovó */}
      <button
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        type="button"
        className="relative overflow-hidden w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-sm sm:text-base text-slate-800 bg-slate-200 hover:bg-slate-300 active:scale-95 shadow-md border-b-4 border-slate-400 select-none transition-all"
        title="Segure por 3 segundos para começar uma nova cartela"
      >
        {resetHoldProgress > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-rose-500/40 transition-all duration-75"
            style={{ width: `${resetHoldProgress}%` }}
          />
        )}
        <RotateCcw className="w-5 h-5 text-slate-700 relative z-10" />
        <span className="relative z-10">
          {resetHoldProgress > 0
            ? `Segure... ${Math.round(resetHoldProgress)}%`
            : 'Nova Cartela'}
        </span>
      </button>

      {/* 3. Botão Rápido de Música */}
      <button
        onClick={onToggleMusic}
        type="button"
        className={`
          w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs sm:text-sm font-bold shadow active:scale-95 transition-all
          ${musicPlaying
            ? 'bg-rose-950/70 border-rose-500/80 text-rose-200 hover:bg-rose-900/80'
            : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
          }
        `}
        title="Ligar ou pausar a música de fundo"
      >
        <Music className={`w-4 h-4 ${musicPlaying ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
        <span>{musicPlaying ? 'Música: Tocando' : 'Música: Pausada'}</span>
      </button>

      {/* 4. GRANDE BOTÃO SAIR (Pausa o jogo e pede confirmação) */}
      <button
        onClick={onRequestExit}
        type="button"
        className="w-full flex items-center justify-center gap-2.5 py-3.5 sm:py-4 px-4 rounded-2xl font-black text-base sm:text-lg text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-lg border-b-4 border-rose-800 select-none transition-all"
        title="Sair da partida"
      >
        <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>Sair do Jogo</span>
      </button>

      {/* Em telas estreitas/verticais onde o dock da esquerda fica oculto */}
      <div className="flex md:hidden items-center justify-center gap-2 w-full pt-1">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 py-2 px-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold"
        >
          Opções
        </button>
        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 py-2 px-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold"
        >
          Blindar
        </button>
      </div>
    </aside>
  );
}
