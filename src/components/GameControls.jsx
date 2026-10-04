import React, { useState, useRef } from 'react';
import { Play, Pause, Dices, RotateCcw, Maximize, Minimize, Settings, ShieldAlert, Sparkles } from 'lucide-react';

export function GameControls({
  isPlaying,
  onTogglePlay,
  onDrawNext,
  onResetGame,
  onOpenSettings,
  onOpenFamilyGuide,
  deckRemaining
}) {
  const [resetHoldProgress, setResetHoldProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const holdIntervalRef = useRef(null);
  const holdStartTimeRef = useRef(null);

  // Manipulador da Trava da Vovó (Pressionar por 3 segundos para reiniciar)
  const handleHoldStart = (e) => {
    // Evitar menu de contexto em toque longo
    if (e.type === 'touchstart') {
      // touch start
    }
    holdStartTimeRef.current = Date.now();
    const duration = 2500; // 2.5 segundos para resposta segura e suave

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
        // Mostra toast avisando que precisa segurar
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
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
    <div className="w-full flex flex-col gap-3">
      {/* Toast de Aviso da Trava */}
      {showToast && (
        <div className="bg-amber-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-center text-sm sm:text-base font-extrabold animate-bounce">
          🔒 Para não perder seu jogo por engano, segure o botão por 3 segundos!
        </div>
      )}

      {/* Botões Principais de Controle do Jogo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
        {/* Botão de Sortear Próxima Pedra */}
        <button
          onClick={onDrawNext}
          type="button"
          disabled={deckRemaining === 0}
          className="flex items-center justify-center gap-2 py-3 sm:py-4 px-4 rounded-2xl font-black text-lg sm:text-xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-lg border-b-4 border-emerald-800 disabled:opacity-50 transition-all"
        >
          <Dices className="w-7 h-7 sm:w-8 sm:h-8" />
          <span>Sortear</span>
        </button>

        {/* Botão de Iniciar / Pausar Sorteio Automático */}
        <button
          onClick={onTogglePlay}
          type="button"
          disabled={deckRemaining === 0}
          className={`
            flex items-center justify-center gap-2 py-3 sm:py-4 px-4 rounded-2xl font-black text-lg sm:text-xl text-white shadow-lg border-b-4 active:scale-95 transition-all
            ${isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 border-amber-800'
              : 'bg-blue-600 hover:bg-blue-700 border-blue-800'
            }
          `}
        >
          {isPlaying ? (
            <>
              <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              <span>Automático</span>
            </>
          )}
        </button>

        {/* Botão com Trava da Vovó: Nova Cartela */}
        <button
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
          type="button"
          className="relative overflow-hidden col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 sm:py-4 px-4 rounded-2xl font-black text-base sm:text-lg text-slate-800 bg-slate-200 hover:bg-slate-300 active:scale-95 shadow-md border-b-4 border-slate-400 select-none transition-all"
          title="Segure por 3 segundos para recomeçar o jogo"
        >
          {/* Barra de progresso do toque longo */}
          {resetHoldProgress > 0 && (
            <div
              className="absolute left-0 top-0 bottom-0 bg-rose-500/40 transition-all duration-75"
              style={{ width: `${resetHoldProgress}%` }}
            />
          )}

          <RotateCcw className="w-6 h-6 text-slate-700" />
          <span className="relative z-10">
            {resetHoldProgress > 0
              ? `Segure... ${Math.round(resetHoldProgress)}%`
              : 'Nova Cartela'}
          </span>
        </button>
      </div>

      {/* Barra de Ferramentas Auxiliares (Tela Cheia, Dicas e Configurações) */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={onOpenFamilyGuide}
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Evitar Fechamento (Dicas)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            type="button"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            <span className="hidden sm:inline">Tela Cheia</span>
          </button>

          <button
            onClick={onOpenSettings}
            type="button"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
            title="Configurações e Música"
          >
            <Settings className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline">Opções</span>
          </button>
        </div>
      </div>
    </div>
  );
}
