import React from 'react';
import { LogOut, Music, Sparkles } from 'lucide-react';
import { BingoClaimButton } from './BingoClaimButton';
import { DrawnBallsList } from './DrawnBallsList';
import { MilestoneBar } from './MilestoneBar';

export function SideControls({
  isBingoReady,
  onClaimBingo,
  markedCount,
  drawnBalls = [],
  milestones,
  showNewGame = false,
  onNewGame,
  onRequestExit,
  musicPlaying,
  onToggleMusic,
  onOpenSettings,
  onOpenFamilyGuide,
  hasOtherFamilyInRoom = false
}) {
  return (
    <aside className="w-full md:w-36 lg:w-40 h-full max-h-full min-h-0 flex flex-col gap-1.5 select-none flex-shrink-0 z-10">
      {/* 1. Barra de prêmios (marcos de números marcados) */}
      {milestones && (
        <MilestoneBar
          markedCount={markedCount}
          next={milestones.next}
          lastReached={milestones.lastReached}
        />
      )}

      {/* 2. Todas as bolas já sorteadas (mais recente no topo) */}
      <DrawnBallsList drawnBalls={drawnBalls} />

      {/* 3. Botão NOVA PARTIDA (após fechar a janela de fim de jogo) ou BINGO (quando pronto) */}
      {showNewGame ? (
        <button
          onClick={onNewGame}
          type="button"
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl border-b-2 border-emerald-800 active:scale-95 transition-all flex-shrink-0 animate-pulse"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>Nova Partida</span>
        </button>
      ) : (
        isBingoReady && (
          <div className="w-full flex justify-center flex-shrink-0">
            <BingoClaimButton
              isBingoReady={isBingoReady}
              onClaimBingo={onClaimBingo}
              markedCount={markedCount}
            />
          </div>
        )
      )}

      {/* 4. Botão Rápido de Música */}
      <button
        onClick={onToggleMusic}
        type="button"
        className={`
          w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-bold shadow active:scale-95 transition-all flex-shrink-0
          ${hasOtherFamilyInRoom
            ? 'bg-slate-850 border-slate-700/60 text-slate-400'
            : (musicPlaying
                ? 'bg-amber-950/70 border-amber-500/80 text-amber-200 hover:bg-amber-900/80'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
              )
          }
        `}
        title={hasOtherFamilyInRoom ? 'Música desligada para você ouvir a voz da sua família com total clareza' : 'Ligar ou pausar a música de fundo'}
      >
        <Music className={`w-3.5 h-3.5 flex-shrink-0 ${musicPlaying && !hasOtherFamilyInRoom ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
        <span className="truncate">{hasOtherFamilyInRoom ? 'Música: Silenciosa' : (musicPlaying ? 'Música: On' : 'Música: Off')}</span>
      </button>

      {/* 5. GRANDE BOTÃO SAIR (Pausa o jogo e pede confirmação) */}
      <button
        onClick={onRequestExit}
        type="button"
        className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-black text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-lg border-b-2 border-rose-800 select-none transition-all flex-shrink-0"
        title="Sair da partida"
      >
        <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Sair</span>
      </button>

      {/* Em telas estreitas/verticais onde o dock da esquerda fica oculto */}
      <div className="flex md:hidden items-center justify-center gap-2 w-full pt-1 flex-shrink-0">
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
