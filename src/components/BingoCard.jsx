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
    <div className="flex flex-col w-full max-w-lg md:max-w-xl mx-auto bg-white rounded-3xl shadow-2xl border-4 border-amber-500/80 overflow-hidden select-none my-auto">
      {/* Cabeçalho da Cartela com Nome Carinhoso */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 py-2 px-4 text-center text-white shadow-sm flex items-center justify-center gap-2">
        <span className="text-base sm:text-xl font-black tracking-wider uppercase drop-shadow">
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
              className={`${style.bg} py-2 text-center text-white font-black text-2xl sm:text-4xl tracking-widest shadow-inner border-r-2 last:border-r-0 border-white/20`}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* Grade 5x5 de Números Grandes com Margem Confortável */}
      <div className="grid grid-cols-5 grid-rows-5 p-2 sm:p-3.5 gap-2 sm:gap-2.5 bg-slate-50">
        {card.map((row) =>
          row.map((cell) => {
            const isMarked = cell.isFree || markedCellIds.has(cell.id);
            const isCurrentMatch = !isMarked && cell.number === currentBall;

            // Casa Central (LIVRE)
            if (cell.isFree) {
              return (
                <div
                  key={cell.id}
                  className="relative flex flex-col items-center justify-center rounded-2xl bg-amber-100 border-3 sm:border-4 border-amber-400 text-amber-800 shadow-md p-1 min-h-[50px] sm:min-h-[64px]"
                >
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500 fill-rose-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-700">
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
                  border-3 sm:border-4 shadow-sm min-h-[50px] sm:min-h-[64px]
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
                    font-black tracking-tight select-none text-2xl sm:text-4xl md:text-5xl
                    ${isMarked ? 'text-slate-400' : 'text-slate-900'}
                  `}
                >
                  {cell.number}
                </span>

                {/* Marcador de Feijãozinho Clássico */}
                {isMarked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pop-in">
                    <div
                      className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transform rotate-[-8deg] border-2 border-amber-900/40"
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, #b45309 0%, #78350f 70%, #451a03 100%)',
                        boxShadow: '0 4px 10px rgba(69, 26, 3, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <div className="w-2.5 h-1.5 bg-white/40 rounded-full absolute top-1.5 left-2 transform -rotate-12" />
                      <span className="text-white font-black text-xs sm:text-base md:text-lg drop-shadow">
                        {cell.number}
                      </span>
                    </div>
                  </div>
                )}

                {/* Destaque visual caso seja a bola atual */}
                {isCurrentMatch && (
                  <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-black shadow-md uppercase tracking-wider animate-bounce">
                    Aqui!
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Rodapé da Cartela */}
      <div className="bg-slate-100 py-1.5 px-4 border-t-2 border-slate-200 text-center text-[11px] sm:text-xs text-slate-600 font-medium flex items-center justify-between">
        <span>Toque no número sorteado para marcar</span>
        <span className="font-bold text-slate-800">
          {markedCellIds.size + 1} de 25 Marcados
        </span>
      </div>
    </div>
  );
}
