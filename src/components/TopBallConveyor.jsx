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
  isOnline = true
}) {
  const currentLetter = currentBall ? getBingoLetter(currentBall) : null;
  const currentStyle = currentLetter ? BINGO_COLORS[currentLetter] : null;

  // Bolas anteriores (últimas 4)
  const previousBalls = drawnBalls.slice(0, -1).slice(-4).reverse();

  // Cálculo do anel circular de contagem da próxima bola (ampliado para destaque visual)
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-amber-500/20 py-1 px-2.5 sm:px-4 flex items-center justify-between gap-2 shadow-lg select-none z-20 flex-shrink-0">
      {/* Lado Esquerdo: Botão Voltar + Pausa + Contador */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Botão VOLTAR (Fácil de tocar e compacto) */}
        <button
          onClick={onBackToHome}
          type="button"
          className="py-1.5 px-2.5 sm:py-2 sm:px-4 rounded-xl sm:rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-amber-400/80 text-amber-300 hover:text-white font-black text-xs sm:text-sm md:text-base flex items-center gap-1.5 transition-all active:scale-95 shadow-md"
          title="Voltar para a Tela Inicial"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
          <span>Voltar</span>
        </button>

        {/* Botão Pausar / Continuar Sorteio */}
        <button
          onClick={onTogglePlay}
          type="button"
          className={`
            py-1.5 px-2.5 sm:py-2 sm:px-3.5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 border
            ${isPlaying
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
            }
          `}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
              <span className="hidden sm:inline">Continuar</span>
            </>
          )}
        </button>

        <span className="text-xs sm:text-sm font-black text-slate-400 hidden lg:inline-block ml-1">
          {drawnBalls.length}/75 Bolas
        </span>

        {!isOnline && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] sm:text-xs font-black animate-pulse flex items-center gap-1 shadow-sm">
            <span>🍀</span>
            <span className="hidden sm:inline">Offline</span>
          </span>
        )}
      </div>

      {/* Direita: Esteira de Bolas Estilo Play Store */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
        {/* Trilho das Bolas Anteriores Deslizando */}
        <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-slate-700/60">
          {previousBalls.length > 0 ? (
            previousBalls.map((num) => {
              const lettr = getBingoLetter(num);
              const col = BINGO_COLORS[lettr];
              return (
                <div
                  key={num}
                  className={`
                    w-7 h-7 sm:w-8 sm:h-8 rounded-full flex flex-col items-center justify-center font-black text-white text-xs shadow-md border border-white/30 transform scale-95
                    ${col.bg}
                  `}
                >
                  <span className="text-[7px] leading-none opacity-85">{lettr}</span>
                  <span className="leading-none text-[10px] sm:text-[11px]">{num}</span>
                </div>
              );
            })
          ) : (
            <span className="text-[11px] text-slate-500 italic pr-1">Aguardando...</span>
          )}
        </div>

        {/* BOLA ATUAL COM ANEL DE TEMPO (CALLER DA PLAY STORE) */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            {/* SVG do anel de progresso da próxima pedra */}
            {isPlaying && (
              <svg className="absolute w-16 h-16 sm:w-20 sm:h-20 -rotate-90 pointer-events-none">
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#334155"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
            )}

            {/* Bola Atual Ampliada */}
            {currentBall ? (
              <div
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full flex flex-col items-center justify-center shadow-xl relative border-2 border-white
                  ${currentStyle.bg} animate-pop-in
                `}
                style={{
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.45)'
                }}
              >
                <span className="text-white font-black text-[10px] sm:text-xs md:text-sm drop-shadow leading-none">
                  {currentLetter}
                </span>
                <div className="bg-white rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center shadow-inner mt-0.5">
                  <span className="text-slate-950 font-black text-sm sm:text-base md:text-lg">
                    {currentBall}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-500 font-black text-lg sm:text-xl">
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
                px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg border active:scale-95 transition-all
                ${isSpeaking
                  ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-400'
                }
              `}
              title="Ouvir novamente a narração da pedra"
            >
              <Volume2 className="w-4 h-4 flex-shrink-0" />
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
