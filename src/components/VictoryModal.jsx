import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';
import { VirtualPlayerAvatar } from './VirtualPlayerAvatar';

export function VictoryModal({ isOpen, onClose, onNewGame, vovoName, winPlace = 1, winPattern = 'Linha' }) {
  useEffect(() => {
    if (!isOpen) return;

    const count = 220;
    const defaults = { origin: { y: 0.65 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, [isOpen]);

  if (!isOpen) return null;

  const medalEmojis = {
    1: '🥇 1º LUGAR (OURO)',
    2: '🥈 2º LUGAR (PRATA)',
    3: '🥉 3º LUGAR (BRONZE)'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center relative overflow-hidden">
        {/* Faixa de Brilho Dourado */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* FOTO DA VOVÓ NO PÓDIO COM MEDALHA DOURADA */}
        <div className="relative mb-3">
          <VirtualPlayerAvatar
            playerId="vovo"
            isVovo={true}
            size={120}
            className="border-6 border-amber-400 shadow-2xl ring-8 ring-amber-300/60"
          />

          {/* Medalha / Troféu sobreposto */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-amber-500 to-yellow-300 text-amber-950 rounded-full p-2.5 shadow-xl border-2 border-white animate-bounce">
            <Trophy className="w-7 h-7" />
          </div>
        </div>

        {/* Badge da Colocação no Pódio */}
        <div className="inline-block bg-amber-100 border-2 border-amber-400 text-amber-900 font-black text-sm sm:text-base px-4 py-1 rounded-full uppercase tracking-wider mb-2">
          {medalEmojis[winPlace] || '🏆 CAMPEÃ'}
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-1 tracking-tight">
          BINGO!
        </h2>

        <p className="text-lg sm:text-xl font-bold text-amber-700 mb-3">
          Parabéns, {vovoName}! Você bateu {winPattern}! 🌟
        </p>

        <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-sm">
          Que partida sensacional! Você garantiu sua vaga no pódio com muito talento e atenção!
        </p>

        {/* Botão Gigante de Jogar Mais Uma */}
        <button
          onClick={() => {
            onClose();
            onNewGame();
          }}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-xl sm:text-2xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all"
        >
          <Sparkles className="w-8 h-8" />
          <span>Jogar Mais Uma!</span>
        </button>
      </div>
    </div>
  );
}
