import React from 'react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';
import { Trophy } from 'lucide-react';

export function PodiumDisplay({ podiumWinners = [] }) {
  const slots = [
    { place: 1, medal: '🥇', label: '1º' },
    { place: 2, medal: '🥈', label: '2º' },
    { place: 3, medal: '🥉', label: '3º' }
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-slate-700/60 select-none">
      <div className="flex items-center gap-1 text-amber-400 font-black text-xs uppercase pr-1 border-r border-slate-700">
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden sm:inline">Pódio:</span>
      </div>

      <div className="flex items-center gap-2">
        {slots.map(slot => {
          const winner = podiumWinners.find(w => w.winPlace === slot.place);

          if (winner) {
            return (
              <div
                key={slot.place}
                className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/50 py-0.5 px-1.5 rounded-xl animate-pop-in"
                title={`${slot.place}º Lugar: ${winner.name}`}
              >
                <VirtualPlayerAvatar
                  playerId={winner.id}
                  isVovo={winner.id === 'vovo'}
                  size={24}
                />
                <span className="text-[11px] font-black text-amber-300">
                  {winner.name.split(' ')[0]}
                </span>
              </div>
            );
          }

          return (
            <div
              key={slot.place}
              className="flex items-center gap-1 bg-slate-800/80 border border-dashed border-slate-600/80 py-0.5 px-2 rounded-xl text-slate-400 text-xs font-bold"
              title={`${slot.place}º Lugar em aberto`}
            >
              <span>{slot.medal}</span>
              <span className="text-[10px] text-slate-500 uppercase">{slot.label} Vago</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
