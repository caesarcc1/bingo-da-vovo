import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/soundEffects';

// Marcos de números marcados (a casa LIVRE conta como marcada)
export const MILESTONES = [
  { count: 5, emoji: '🎁', title: 'Presente!', text: '5 números marcados' },
  { count: 10, emoji: '⭐', title: 'Estrela!', text: '10 números marcados' },
  { count: 15, emoji: '🏆', title: 'Troféu!', text: '15 números marcados' },
  { count: 20, emoji: '💎', title: 'Diamante!', text: '20 números marcados' },
  { count: 24, emoji: '👑', title: 'Coroa!', text: 'Falta só 1 número!' }
];

/**
 * Controla os prêmios por quantidade de números marcados.
 * markedCount já deve incluir a casa LIVRE.
 */
export function useMilestones(markedCount) {
  const [justUnlocked, setJustUnlocked] = useState(null);
  const highestRef = useRef(0);

  useEffect(() => {
    // Nova partida: zera os marcos já conquistados
    if (markedCount <= 1) {
      highestRef.current = 0;
      setJustUnlocked(null);
      return;
    }

    const newlyReached = MILESTONES.filter(
      (m) => markedCount >= m.count && m.count > highestRef.current
    );
    if (newlyReached.length === 0) return;

    const top = newlyReached[newlyReached.length - 1];
    highestRef.current = top.count;
    setJustUnlocked(top);
    soundFX.playMilestone();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });

    const timer = setTimeout(() => setJustUnlocked(null), 3200);
    return () => clearTimeout(timer);
  }, [markedCount]);

  const next = MILESTONES.find((m) => m.count > markedCount) || null;
  const lastReached = [...MILESTONES].reverse().find((m) => markedCount >= m.count) || null;

  return { next, lastReached, justUnlocked };
}
