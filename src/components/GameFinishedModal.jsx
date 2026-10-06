import React from 'react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';
import { Sparkles, RotateCcw, Heart } from 'lucide-react';

export function GameFinishedModal({
  isOpen,
  podiumWinners = [],
  onNewGame,
  vovoName
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md select-none animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[94vh] overflow-y-auto shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center">
        {/* Botão Jogar Mais Uma: fixo no topo, sempre visível */}
        <div className="sticky top-0 z-10 w-full bg-white/95 px-4 pt-3 pb-2 border-b border-amber-200">
          <button
            onClick={onNewGame}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all"
          >
            <Sparkles className="w-7 h-7" />
            <span>Jogar Mais Uma Partida!</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 w-full flex flex-col items-center">
          {/* Foto da Vovó em Destaque */}
          <div className="relative mb-2">
            <VirtualPlayerAvatar
              playerId="vovo"
              isVovo={true}
              size={72}
              className="border-4 border-amber-400 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-md">
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            Que Partida Bonita, Vovó!
          </h2>

          <p className="text-sm text-slate-600 font-medium mb-3 max-w-md">
            Os 3 lugares do pódio foram preenchidos hoje pelos outros competidores, mas você jogou com muito capricho!
          </p>

          {/* Pódio dos 3 Ganhadores */}
          <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 sm:p-3">
            <p className="text-xs font-black uppercase text-slate-500 mb-2 tracking-wider">
              Ganhadores Desta Rodada:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {podiumWinners.slice(0, 3).map((winner) => (
                <div
                  key={winner.id}
                  className="flex flex-col items-center p-1.5 rounded-xl bg-white border border-slate-200 shadow-sm"
                >
                  <div className="text-xl mb-0.5">
                    {winner.winPlace === 1 ? '🥇' : winner.winPlace === 2 ? '🥈' : '🥉'}
                  </div>
                  <VirtualPlayerAvatar
                    playerId={winner.id}
                    size={40}
                  />
                  <span className="text-xs font-black text-slate-800 mt-1 line-clamp-1">
                    {winner.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {winner.winPattern}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
