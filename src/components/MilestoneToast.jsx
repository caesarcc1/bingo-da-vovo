import React from 'react';

// Aviso flutuante de prêmio: não bloqueia toques nem o sorteio
export function MilestoneToast({ milestone }) {
  if (!milestone) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-pop-in">
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 px-5 py-2.5 rounded-2xl shadow-2xl border-4 border-white">
        <span className="text-4xl leading-none">{milestone.emoji}</span>
        <div className="text-left">
          <p className="text-lg sm:text-xl font-black leading-tight">{milestone.title}</p>
          <p className="text-xs sm:text-sm font-bold leading-tight">{milestone.text}</p>
        </div>
      </div>
    </div>
  );
}
