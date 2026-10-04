import React from 'react';
import { BINGO_COLORS } from '../utils/numberWords';
import { Heart } from 'lucide-react';

export function BingoCard({
  card,
  markedCellIds,
  currentBall,
  onCellClick,
  winState,
  vovoName = 'Bingo da Vovó'
}) {
  const letters = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden select-none">
      {/* Cabeçalho da Cartela com Nome Carinhoso */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 py-2.5 px-4 text-center text-white shadow-sm flex items-center justify-center gap-2">
        <span className="text-xl md:text-2xl font-black tracking-wider uppercase drop-shadow">
          {vovoName}
        </span>
      </div>

      {/* Letras B - I - N - G - O */}
      <div className="grid grid-cols-5 border-b-4 border-slate-200 bg-slate-100">
        {letters.map((letter) => {
          const style = BINGO_COLORS[letter];
          return (
            <div
              key={letter}
              className={`${style.bg} py-2.5 text-center text-white font-black text-3xl sm:text-4xl md:text-5xl tracking-widest shadow-inner border-r-2 last:border-r-0 border-white/20`}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Grade 5x5 de Números Grandes */}
      <div className="grid grid-cols-5 grid-rows-5 flex-1 p-2 sm:p-3 gap-2 sm:gap-3 bg-slate-50">
        {card.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isMarked = cell.isFree || markedCellIds.has(cell.id);
            const isCurrentMatch = !isMarked && cell.number === currentBall;
            const letterStyle = BINGO_COLORS[cell.letter];

            // Casa Central (LIVRE)
            if (cell.isFree) {
              return (
                <div
                  key={cell.id}
                  className="relative flex flex-col items-center justify-center rounded-2xl bg-amber-100 border-4 border-amber-400 text-amber-800 shadow-md p-1"
                >
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-rose-700 mt-0.5">
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
                  relative flex items-center justify-center rounded-2xl transition-all duration-150 active:scale-95
                  border-3 sm:border-4 shadow-sm min-h-[58px] sm:min-h-[75px] md:min-h-[90px]
                  ${isMarked
                    ? 'bg-amber-50 border-amber-600/70 shadow-inner'
                    : isCurrentMatch
                    ? 'bg-amber-200 border-amber-500 ring-4 ring-amber-400 animate-pulse-gently'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                  }
                `}
                aria-label={`Número ${cell.number}, coluna ${cell.letter}${isMarked ? ', marcado' : ''}`}
              >
                {/* Número Gigante da Célula */}
                <span
                  className={`
                    font-black tracking-tight select-none
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                    ${isMarked ? 'text-slate-400' : 'text-slate-900'}
                  `}
                >
                  {cell.number}
                </span>

                {/* Marcador de Feijãozinho Clássico */}
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pop-in">
                    <div
                      className="w-10 h-10 sm:w-13 sm:h-13 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transform rotate-[-8deg] border-2 border-amber-900/40"
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, #b45309 0%, #78350f 70%, #451a03 100%)',
                        boxShadow: '0 6px 12px rgba(69, 26, 3, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {/* Brilho suave no feijãozinho */}
                      <div className="w-3 h-1.5 bg-white/40 rounded-full absolute top-2 left-2.5 transform -rotate-12" />
                      {/* Número em branco gravado com relevo no feijão */}
                      <span className="text-white font-black text-sm sm:text-base md:text-xl drop-shadow">
                        {cell.number}
                      </span>
                    </div>
                  </div>
                )}

                {/* Indicador de "É este!" se for a bola sorteada e ela ainda não marcou */}
                {isCurrentMatch && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-black shadow-md uppercase tracking-wider animate-bounce">
                    Aqui!
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Rodapé da Cartela */}
      <div className="bg-slate-100 py-2 px-4 border-t-2 border-slate-200 text-center text-xs sm:text-sm text-slate-600 font-medium flex items-center justify-between">
        <span>Toque no número sorteado para colocar o feijãozinho</span>
        <span className="font-bold text-slate-800">
          Marcados: {markedCellIds.size + 1} / 25
        </span>
      </div>
    </div>
  );
}
