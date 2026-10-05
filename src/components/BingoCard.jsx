import React from 'react';
import { BINGO_COLORS } from '../utils/numberWords';
import { Heart, Sparkles } from 'lucide-react';

export function BingoCard({
  card,
  markedCellIds,
  currentBall,
  onCellClick,
  winState,
  vovoName = 'Bingo da Vovó'
}) {
  const letters = ['B', 'I', 'N', 'G', 'O'];
  const winningCellIds = winState?.winningCellIds || new Set();

  return (
    <div className="flex flex-col h-full max-h-full w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-3 sm:border-4 border-amber-400 overflow-hidden select-none ring-4 ring-amber-400/20">
      {/* Cabeçalho da Cartela com Nome Carinhoso */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 py-1 px-3 text-center text-white shadow-sm flex items-center justify-center gap-2 flex-shrink-0">
        <span className="text-xs sm:text-sm md:text-base font-black tracking-wider uppercase drop-shadow">
          {vovoName}
        </span>
        {winState?.isBingo && (
          <span className="bg-yellow-300 text-slate-950 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase animate-bounce shadow">
            {winState.patternDescription}!
          </span>
        )}
      </div>

      {/* Letras B - I - N - G - O */}
      <div className="grid grid-cols-5 border-b-2 sm:border-b-3 border-slate-200 bg-slate-100 flex-shrink-0">
        {letters.map((letter) => {
          const style = BINGO_COLORS[letter];
          return (
            <div
              key={letter}
              className={`${style.bg} py-1 sm:py-1.5 text-center text-white font-black text-xl sm:text-2xl md:text-3xl tracking-widest shadow-inner border-r last:border-r-0 border-white/20`}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Grade 5x5 de Números Grandes: Garante que as 5 linhas cabem 100% na tela */}
      <div className="flex-1 grid grid-cols-5 grid-rows-5 p-1 sm:p-1.5 md:p-2 gap-1 sm:gap-1.5 md:gap-2 bg-slate-50 min-h-0">
        {card.map((row) =>
          row.map((cell) => {
            const isMarked = cell.isFree || markedCellIds.has(cell.id);
            const isCurrentMatch = !isMarked && cell.number === currentBall;
            const isWinnerCell = winningCellIds.has(cell.id);

            // Casa Central (LIVRE)
            if (cell.isFree) {
              return (
                <div
                  key={cell.id}
                  className={`
                    w-full h-full flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-0.5 min-h-0
                    ${isWinnerCell
                      ? 'bg-yellow-200 border-2 sm:border-3 border-yellow-500 ring-4 ring-yellow-400/80 shadow-md animate-pulse'
                      : 'bg-amber-100 border-2 sm:border-3 border-amber-400 text-amber-800 shadow-sm'
                    }
                  `}
                >
                  <Heart className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider text-rose-700 leading-none mt-0.5">
                    Livre
                  </span>
                </div>
              );
            }

            return (
              <button
                key={cell.id}
                onClick={() => onCellClick(cell)}
                type="button"
                className={`
                  relative w-full h-full flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-150 active:scale-95
                  border-2 sm:border-3 shadow-sm min-h-0
                  ${isWinnerCell
                    ? 'bg-yellow-100 border-yellow-500 ring-4 ring-yellow-400/80 shadow-md animate-pulse'
                    : isMarked
                    ? 'bg-amber-50 border-amber-600/70 shadow-inner'
                    : isCurrentMatch
                    ? 'bg-amber-200 border-amber-500 ring-4 ring-amber-400 animate-pulse-gently'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                  }
                `}
                aria-label={`Número ${cell.number}, coluna ${cell.letter}${isMarked ? ', marcado' : ''}`}
              >
                {/* Número da Célula */}
                <span
                  className={`
                    font-black tracking-tight select-none text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none
                    ${isMarked ? 'text-slate-400' : 'text-slate-900'}
                  `}
                >
                  {cell.number}
                </span>

                {/* Marcador de Feijãozinho Clássico 3D */}
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pop-in">
                    <div
                      className={`
                        w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-13 lg:h-13 rounded-full flex items-center justify-center shadow-lg transform rotate-[-8deg] border-2 border-amber-900/40
                        ${isWinnerCell ? 'ring-2 ring-yellow-300 scale-105' : ''}
                      `}
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, #b45309 0%, #78350f 70%, #451a03 100%)',
                        boxShadow: '0 4px 8px rgba(69, 26, 3, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <div className="w-2 h-0.5 bg-white/40 rounded-full absolute top-1 left-1.5 transform -rotate-12" />
                      <span className="text-white font-black text-[10px] sm:text-xs md:text-sm lg:text-base drop-shadow leading-none">
                        {cell.number}
                      </span>
                    </div>
                  </div>
                )}

                {/* Destaque se for a pedra da vez */}
                {isCurrentMatch && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black shadow-md uppercase tracking-wider animate-bounce">
                    Aqui!
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
