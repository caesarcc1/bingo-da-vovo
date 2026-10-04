import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw } from 'lucide-react';

export function VictoryModal({ isOpen, onClose, onNewGame, vovoName }) {
  useEffect(() => {
    if (!isOpen) return;

    // Disparar chuva de confetes festiva
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55
    });
    fire(0.2, {
      spread: 60
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center">
        {/* Troféu Dourado */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg mb-4 animate-bounce">
          <Trophy className="w-14 h-14 sm:w-16 sm:h-16 text-amber-900" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
          BINGO!
        </h2>

        <p className="text-xl sm:text-2xl font-bold text-amber-700 mb-4">
          Parabéns! Você completou a cartela inteira! 🌟
        </p>

        <p className="text-base text-slate-600 mb-6">
          Que partida maravilhosa! Todos os números foram preenchidos com muito carinho.
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
