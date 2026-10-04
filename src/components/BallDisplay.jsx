import React from 'react';
import { getBingoLetter, BINGO_COLORS, getNarrationPhrase } from '../utils/numberWords';
import { Volume2, RotateCcw } from 'lucide-react';

export function BallDisplay({
  currentBall,
  drawnBalls,
  onRepeatVoice,
  isSpeaking
}) {
  const currentLetter = currentBall ? getBingoLetter(currentBall) : null;
  const currentStyle = currentLetter ? BINGO_COLORS[currentLetter] : null;

  // Últimas 4 bolas anteriores à atual
  const previousBalls = drawnBalls.slice(0, -1).slice(-4).reverse();

  return (
    <div className="flex flex-col items-center justify-between w-full h-full bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-slate-200">
      <div className="text-center w-full">
        <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-slate-500">
          Pedra do Globo
        </h2>
      </div>

      {/* Exibição da Bola Gigante */}
      <div className="flex flex-col items-center justify-center my-auto">
        {currentBall ? (
          <div className="flex flex-col items-center">
            {/* Círculo da Bola Gigante com Efeito 3D */}
            <div
              className={`
                w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full flex flex-col items-center justify-center shadow-2xl relative border-4 border-white
                ${currentStyle.bg} animate-pop-in
              `}
              style={{
                boxShadow: '0 16px 32px rgba(0,0,0,0.22), inset 0 -8px 16px rgba(0,0,0,0.2), inset 0 8px 16px rgba(255,255,255,0.4)'
              }}
            >
              {/* Brilho da esfera */}
              <div className="w-16 h-8 bg-white/40 rounded-full absolute top-3 transform -rotate-12 blur-[1px]" />

              {/* Letra da Bola */}
              <span className="text-white/95 font-black text-2xl sm:text-3xl md:text-4xl drop-shadow tracking-widest">
                {currentLetter}
              </span>

              {/* Número Gigantesco */}
              <div className="bg-white rounded-full w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 flex items-center justify-center shadow-inner mt-1">
                <span className="text-slate-950 font-black text-4xl sm:text-5xl md:text-6xl tracking-tight">
                  {currentBall}
                </span>
              </div>
            </div>

            {/* Botão de Repetir Narração por Voz */}
            <button
              onClick={onRepeatVoice}
              type="button"
              className={`
                mt-4 flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-base sm:text-lg shadow-md transition-all active:scale-95 border-2
                ${isSpeaking
                  ? 'bg-amber-100 text-amber-900 border-amber-400 animate-pulse'
                  : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
                }
              `}
              title="Ouvir novamente a narração desta pedra"
            >
              <Volume2 className="w-6 h-6" />
              <span>{isSpeaking ? 'Falando...' : 'Repetir Voz'}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 w-full">
            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-4xl font-black mb-3">
              ?
            </div>
            <p className="text-slate-700 font-bold text-lg sm:text-xl">
              Globo Pronto!
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Toque em "Sortear" para iniciar
            </p>
          </div>
        )}
      </div>

      {/* Histórico das Últimas Pedras Chamadas */}
      <div className="w-full pt-3 border-t-2 border-slate-100">
        <p className="text-xs sm:text-sm font-bold text-slate-500 mb-2 text-center uppercase tracking-wider">
          Anteriores ({drawnBalls.length}/75)
        </p>
        <div className="flex items-center justify-center gap-2 min-h-[46px]">
          {previousBalls.length > 0 ? (
            previousBalls.map((num) => {
              const lettr = getBingoLetter(num);
              const color = BINGO_COLORS[lettr];
              return (
                <div
                  key={num}
                  className={`
                    w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center font-black text-white text-xs sm:text-sm shadow-sm
                    ${color.bg}
                  `}
                >
                  <span className="text-[9px] leading-none opacity-80">{lettr}</span>
                  <span className="leading-none">{num}</span>
                </div>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">Nenhuma ainda</span>
          )}
        </div>
      </div>
    </div>
  );
}
