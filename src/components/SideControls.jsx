import React, { useState, useRef } from 'react';
import { RotateCcw, Settings, ShieldAlert, Maximize, Minimize } from 'lucide-react';
import { BingoClaimButton } from './BingoClaimButton';

export function SideControls({
  isBingoReady,
  onClaimBingo,
  markedCount,
  onResetGame,
  onOpenSettings,
  onOpenFamilyGuide
}) {
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <aside className="w-full md:w-56 lg:w-64 flex flex-col justify-center gap-3 sm:gap-4 select-none flex-shrink-0 z-10">
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
        className="relative overflow-hidden w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base text-slate-800 bg-slate-200 hover:bg-slate-300 active:scale-95 shadow-md border-b-4 border-slate-400 select-none transition-all"
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

      {/* 3. Painel de Ações Secundárias na Lateral */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2 w-full">
        {/* Opções e Sons */}
        <button
          onClick={onOpenSettings}
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs sm:text-sm shadow active:scale-95 transition-all"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>Opções & Som</span>
        </button>

        {/* Dicas da Família / Blindagem */}
        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs sm:text-sm shadow active:scale-95 transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Blindar Tablet</span>
        </button>

        {/* Tela Cheia */}
        <button
          onClick={toggleFullscreen}
          type="button"
          className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs sm:text-sm shadow active:scale-95 transition-all"
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-blue-400" /> : <Maximize className="w-4 h-4 text-blue-400" />}
          <span>{isFullscreen ? 'Sair Tela Cheia' : 'Tela Cheia'}</span>
        </button>
      </div>
    </aside>
  );
}
