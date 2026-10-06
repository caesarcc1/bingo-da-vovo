import React from 'react';
import { getBingoLetter, BINGO_COLORS } from '../utils/numberWords';

// Lista das bolas sorteadas (mais recente no topo), rolável com números ampliados
export function DrawnBallsList({ drawnBalls = [] }) {
  const reversed = [...drawnBalls].reverse();

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col bg-slate-900/80 border border-slate-700/70 rounded-xl overflow-hidden shadow-inner">
      <div className="px-2 py-1.5 text-[10px] sm:text-xs font-black uppercase text-slate-300 border-b border-slate-700/70 flex justify-between items-center flex-shrink-0 bg-slate-950/60">
        <span className="tracking-wide">Sorteadas</span>
        <span className="text-amber-300 font-extrabold bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-500/30">
          {drawnBalls.length}/75
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-1.5">
        {reversed.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic text-center mt-3">Aguardando...</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {reversed.map((num, idx) => {
              const letter = getBingoLetter(num);
              const col = BINGO_COLORS[letter];
              const isLatest = idx === 0;
              return (
                <div
                  key={num}
                  className={`
                    rounded-xl flex flex-col items-center justify-center py-1 font-black text-white border border-white/30 shadow-sm transition-transform
                    ${col.bg}
                    ${isLatest ? 'ring-3 ring-yellow-300 shadow-md scale-[1.02] bg-gradient-to-b from-amber-400 to-yellow-600' : ''}
                  `}
                >
                  <span className={`text-[9px] sm:text-[10px] leading-none opacity-85 font-black ${isLatest ? 'text-amber-950 font-black' : ''}`}>
                    {letter}
                  </span>
                  <span className={`text-base sm:text-lg md:text-xl font-black leading-tight ${isLatest ? 'text-slate-950 font-black drop-shadow-sm' : ''}`}>
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
