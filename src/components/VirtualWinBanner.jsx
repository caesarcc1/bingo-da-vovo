import React, { useEffect, useState } from 'react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';
import { Sparkles } from 'lucide-react';

export function VirtualWinBanner({ winner, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!winner) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 350);
    }, 4500);

    return () => clearTimeout(timer);
  }, [winner, onDismiss]);

  if (!winner) return null;

  const medalEmojis = {
    1: '🥇 1º Lugar',
    2: '🥈 2º Lugar',
    3: '🥉 3º Lugar'
  };

  const remainingText = {
    1: 'Restam 2 lugares no pódio!',
    2: 'Resta 1 lugar no pódio!',
    3: 'Pódio completo!'
  };

  return (
    <div
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out
        ${visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-95'}
      `}
    >
      <div className="bg-slate-900/95 text-white border-3 border-amber-400 py-3 px-5 sm:px-6 rounded-3xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 max-w-lg mx-auto">
        {/* Avatar do Personagem */}
        <VirtualPlayerAvatar
          playerId={winner.id}
          size={52}
          className="border-2 border-amber-300"
        />

        {/* Textos */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-amber-300 uppercase tracking-wide">
              {medalEmojis[winner.winPlace] || 'Ganhador'}
            </span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>

          <p className="text-base sm:text-lg font-black text-white leading-tight">
            {winner.name} fez BINGO!
          </p>

          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
            ({winner.winPattern}) • {remainingText[winner.winPlace]}
          </p>
        </div>
      </div>
    </div>
  );
}
