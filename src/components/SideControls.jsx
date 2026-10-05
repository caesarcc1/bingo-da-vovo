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
    <aside className="w-full md:w-36 lg:w-44 flex flex-col justify-center gap-2 select-none flex-shrink-0 z-10">
      {/* Toast de Aviso da Trava */}
      {showToast && (
        <div className="bg-amber-600 text-white px-2.5 py-1.5 rounded-2xl shadow-xl text-center text-xs font-black animate-bounce">
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
        className="relative overflow-hidden w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl font-bold text-xs sm:text-sm text-slate-800 bg-amber-100 hover:bg-amber-200 active:scale-95 shadow-md border-b-4 border-amber-300 select-none transition-all"
        title="Segure por 3 segundos para começar uma nova cartela"
      >
        {resetHoldProgress > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 bg-rose-500/40 transition-all duration-75"
            style={{ width: `${resetHoldProgress}%` }}
          />
        )}
        <RotateCcw className="w-4 h-4 text-slate-700 relative z-10 flex-shrink-0" />
        <span className="relative z-10 truncate">
          {resetHoldProgress > 0
            ? `${Math.round(resetHoldProgress)}%`
            : 'Nova Cartela'}
        </span>
      </button>

      {/* 3. Botão Rápido de Música */}
      <button
        onClick={onToggleMusic}
        type="button"
        className={`
          w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-2xl border text-xs font-bold shadow active:scale-95 transition-all
          ${musicPlaying
            ? 'bg-amber-950/70 border-amber-500/80 text-amber-200 hover:bg-amber-900/80'
            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
          }
        `}
        title="Ligar ou pausar a música de fundo"
      >
        <Music className={`w-3.5 h-3.5 flex-shrink-0 ${musicPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
        <span className="truncate">{musicPlaying ? 'Música: On' : 'Música: Off'}</span>
      </button>

      {/* 4. GRANDE BOTÃO SAIR (Pausa o jogo e pede confirmação) */}
      <button
        onClick={onRequestExit}
        type="button"
        className="w-full flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-2 rounded-2xl font-black text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-lg border-b-4 border-rose-800 select-none transition-all"
        title="Sair da partida"
      >
        <LogOut className="w-4 h-4 flex-shrink-0" />
        <span>Sair</span>
      </button>

      {/* Em telas estreitas/verticais onde o dock da esquerda fica oculto */}
      <div className="flex md:hidden items-center justify-center gap-2 w-full pt-1">
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold"
        >
          Opções
        </button>
        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold"
        >
          Blindar
        </button>
      </div>
    </aside>
  );
}
