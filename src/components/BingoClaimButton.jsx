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
    <div className="relative flex flex-col items-center">
      {/* Toast Carinhoso se apertar antes da hora */}
      {showEncourageToast && (
        <div className="absolute -top-12 bg-amber-600 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg animate-bounce whitespace-nowrap">
          Ainda faltam pedrinhas, vovó! Vamos continuar torcendo! 🍀
        </div>
      )}

      {/* Botão de BINGO */}
      <button
        onClick={handleClick}
        type="button"
        className={`
          flex items-center justify-center gap-3 px-8 py-3.5 sm:px-12 sm:py-4 rounded-3xl font-black text-xl sm:text-2xl md:text-3xl shadow-2xl transition-all transform active:scale-95 border-b-6
          ${isBingoReady
            ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 border-amber-600 ring-8 ring-amber-300/50 animate-bounce'
            : 'bg-slate-800 text-slate-400 border-slate-900 opacity-90 hover:opacity-100'
          }
        `}
        style={
          isBingoReady
            ? {
                boxShadow: '0 0 35px rgba(245, 158, 11, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.7)'
              }
            : {}
        }
      >
        {isBingoReady ? (
          <>
            <Sparkles className="w-8 h-8 text-amber-900 animate-spin" />
            <span className="tracking-wider uppercase">APERTE BINGO!</span>
            <Trophy className="w-8 h-8 text-amber-900 animate-bounce" />
          </>
        ) : (
          <>
            <span className="text-base sm:text-lg tracking-wide uppercase text-slate-300">
              BINGO ({markedCount}/25)
            </span>
          </>
        )}
      </button>
    </div>
  );
}
