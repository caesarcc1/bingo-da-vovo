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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center">
        {/* Foto da Vovó em Destaque */}
        <div className="relative mb-3">
          <VirtualPlayerAvatar
            playerId="vovo"
            isVovo={true}
            size={96}
            className="border-4 border-amber-400 shadow-xl"
          />
          <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-md">
            <Heart className="w-5 h-5 fill-white" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          Que Partida Bonita, Vovó!
        </h2>

        <p className="text-sm sm:text-base text-slate-600 font-medium mb-5 max-w-md">
          Os 3 lugares do pódio foram preenchidos hoje pelos outros competidores, mas você jogou com muito capricho!
        </p>

        {/* Pódio dos 3 Ganhadores */}
        <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 mb-6">
          <p className="text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">
            Ganhadores Desta Rodada:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {podiumWinners.slice(0, 3).map((winner) => (
              <div
                key={winner.id}
                className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="text-xl mb-1">
                  {winner.winPlace === 1 ? '🥇' : winner.winPlace === 2 ? '🥈' : '🥉'}
                </div>
                <VirtualPlayerAvatar
                  playerId={winner.id}
                  size={44}
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

        {/* Botão Jogar Mais Uma */}
        <button
          onClick={onNewGame}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all"
        >
          <Sparkles className="w-7 h-7" />
          <span>Jogar Mais Uma Partida!</span>
        </button>
      </div>
    </div>
  );
}
