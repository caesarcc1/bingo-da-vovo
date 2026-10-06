import React from 'react';
import { getBingoLetter, BINGO_COLORS } from '../utils/numberWords';

// Lista das bolas sorteadas (mais recente no topo), rolável
export function DrawnBallsList({ drawnBalls = [] }) {
  const reversed = [...drawnBalls].reverse();

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col bg-slate-900/70 border border-slate-700/60 rounded-xl overflow-hidden">
      <div className="px-2 py-1 text-[10px] sm:text-xs font-black uppercase text-slate-300 border-b border-slate-700/60 flex justify-between flex-shrink-0">
        <span>Sorteadas</span>
        <span className="text-amber-300">{drawnBalls.length}/75</span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-1.5">
        {reversed.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic text-center mt-2">Aguardando...</p>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {reversed.map((num, idx) => {
              const letter = getBingoLetter(num);
              const col = BINGO_COLORS[letter];
              return (
                <div
                  key={num}
                  className={`
                    rounded-lg flex flex-col items-center justify-center py-0.5 font-black text-white border border-white/30
                    ${col.bg} ${idx === 0 ? 'ring-2 ring-yellow-300 scale-105' : ''}
                  `}
                >
                  <span className="text-[8px] leading-none opacity-85">{letter}</span>
                  <span className="text-sm sm:text-base leading-none">{num}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
