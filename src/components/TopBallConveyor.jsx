import React from 'react';
import { getBingoLetter, BINGO_COLORS } from '../utils/numberWords';
import { Volume2, Play, Pause, ArrowLeft } from 'lucide-react';

export function TopBallConveyor({
  currentBall,
  drawnBalls,
  onRepeatVoice,
  isSpeaking,
  isPlaying,
  onTogglePlay,
  onBackToHome,
  progressPercent = 0,
  familySlot = null
}) {
  const currentLetter = currentBall ? getBingoLetter(currentBall) : null;
  const currentStyle = currentLetter ? BINGO_COLORS[currentLetter] : null;

  // Bolas anteriores (últimas 4)
  const previousBalls = drawnBalls.slice(0, -1).slice(-4).reverse();

  // Cálculo do anel circular de contagem da próxima bola
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b-2 border-slate-700/60 py-2.5 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-lg select-none z-20">
      {/* Lado Esquerdo: Botão Voltar (50% Maior) + Pausa + Contador */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
        {/* Botão VOLTAR (50% Maior e mais fácil de tocar) */}
        <button
          onClick={onBackToHome}
          type="button"
          className="py-3 px-4 sm:py-3.5 sm:px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-amber-400/80 text-amber-300 hover:text-white font-black text-base sm:text-xl flex items-center gap-2 transition-all active:scale-95 shadow-md"
          title="Voltar para a Tela Inicial"
        >
          <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
          <span>Voltar</span>
        </button>

        {/* Botão Pausar / Continuar Sorteio */}
        <button
          onClick={onTogglePlay}
          type="button"
          className={`
            py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-2xl font-black text-xs sm:text-base flex items-center gap-1.5 shadow-md transition-all active:scale-95 border
            ${isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
            }
          `}
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" />
              <span className="hidden sm:inline">Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline">Continuar</span>
            </>
          )}
        </button>

        <span className="text-xs sm:text-sm font-black text-slate-400 hidden md:inline-block ml-1">
          {drawnBalls.length}/75 Bolas
        </span>
      </div>

      {/* Centro: Espaço de Familiares Conectados e Voz */}
      {familySlot && (
        <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-2 overflow-hidden">
          {familySlot}
        </div>
      )}

      {/* Direita: Esteira de Bolas Estilo Play Store */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        {/* Trilho das Bolas Anteriores Deslizando */}
        <div className="hidden sm:flex items-center gap-2 pr-2 border-r-2 border-slate-700/60">
          {previousBalls.length > 0 ? (
            previousBalls.map((num) => {
              const lettr = getBingoLetter(num);
              const col = BINGO_COLORS[lettr];
              return (
                <div
                  key={num}
                  className={`
                    w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center font-black text-white text-xs shadow-md border border-white/30 transform scale-95
                    ${col.bg}
                  `}
                >
                  <span className="text-[9px] leading-none opacity-85">{lettr}</span>
                  <span className="leading-none text-xs sm:text-sm">{num}</span>
                </div>
              );
            })
          ) : (
            <span className="text-xs text-slate-500 italic pr-2">Aguardando...</span>
          )}
        </div>

        {/* BOLA ATUAL COM ANEL DE TEMPO (CALLER DA PLAY STORE) */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            {/* SVG do anel de progresso da próxima pedra */}
            {isPlaying && (
              <svg className="absolute w-22 h-22 sm:w-26 sm:h-26 -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
            )}

            {/* Bola Atual */}
            {currentBall ? (
              <div
                className={`
                  w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center shadow-2xl relative border-3 border-white
                  ${currentStyle.bg} animate-pop-in
                `}
                style={{
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
                }}
              >
                <span className="text-white font-black text-xs sm:text-sm drop-shadow leading-none">
                  {currentLetter}
                </span>
                <div className="bg-white rounded-full w-10 h-10 sm:w-13 sm:h-13 flex items-center justify-center shadow-inner mt-0.5">
                  <span className="text-slate-950 font-black text-xl sm:text-2xl">
                    {currentBall}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-500 font-black text-xl">
                ?
              </div>
            )}
          </div>

          {/* Botão de Repetir Voz da Bola Atual */}
          {currentBall && (
            <button
              onClick={onRepeatVoice}
              type="button"
              className={`
                px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg border active:scale-95 transition-all
                ${isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400'
                }
              `}
              title="Ouvir novamente a narração da pedra"
            >
              <Volume2 className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline">
                {isSpeaking ? 'Falando...' : 'Repetir'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
