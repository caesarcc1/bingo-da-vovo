import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

export function BingoClaimButton({
  isBingoReady,
  onClaimBingo,
  markedCount = 0
}) {
  const [showEncourageToast, setShowEncourageToast] = useState(false);

  // Se ela completar o Bingo e não apertar em 4 segundos, dispara automaticamente
  useEffect(() => {
    if (!isBingoReady) return;

    const autoTimer = setTimeout(() => {
      onClaimBingo();
    }, 4200);

    return () => clearTimeout(autoTimer);
  }, [isBingoReady, onClaimBingo]);

  const handleClick = () => {
    if (isBingoReady) {
      onClaimBingo();
    } else {
      setShowEncourageToast(true);
      setTimeout(() => setShowEncourageToast(false), 2500);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Toast Carinhoso se apertar antes da hora */}
      {showEncourageToast && (
        <div className="absolute -top-12 bg-amber-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg animate-bounce whitespace-nowrap z-20">
          Ainda faltam pedrinhas, vovó! 🍀
        </div>
      )}

      {/* Botão de BINGO */}
      <button
        onClick={handleClick}
        type="button"
        className={`
          w-full flex items-center justify-center gap-1.5 px-2 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-black shadow-xl transition-all transform active:scale-95 border-b-2 sm:border-b-3
          ${isBingoReady
            ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 border-amber-600 ring-2 sm:ring-4 ring-amber-300/50 animate-bounce text-sm sm:text-base'
            : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-950 text-xs sm:text-sm'
          }
        `}
        style={
          isBingoReady
            ? {
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.7)'
              }
            : {}
        }
      >
        {isBingoReady ? (
          <>
            <Sparkles className="w-5 h-5 text-amber-900 animate-spin flex-shrink-0" />
            <span className="tracking-wider uppercase font-black">BINGO!</span>
            <Trophy className="w-5 h-5 text-amber-900 animate-bounce flex-shrink-0" />
          </>
        ) : (
          <span className="tracking-wide uppercase font-bold text-xs sm:text-sm text-slate-200">
            Bingo ({markedCount}/25)
          </span>
        )}
      </button>
    </div>
  );
}
