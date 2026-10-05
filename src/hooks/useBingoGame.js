import { useState, useEffect, useCallback, useRef } from 'react';
import { generateBingoCard, generateDrawDeck, checkBingoWins } from '../utils/bingoRules';
import { soundFX } from '../utils/soundEffects';

export function useBingoGame({ onBallDrawn, onWin }) {
  const [card, setCard] = useState(() => generateBingoCard());
  const [deck, setDeck] = useState(() => generateDrawDeck());
  const [drawnBalls, setDrawnBalls] = useState([]);
  const [markedCellIds, setMarkedCellIds] = useState(() => new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(10); // segundos por bola
  const [autoMark, setAutoMark] = useState(false); // assistência automática
  const [timerProgress, setTimerProgress] = useState(0); // 0 a 100% para o anel da bola
  const [isBingoReadyToClaim, setIsBingoReadyToClaim] = useState(false);
  const [showBingoCelebration, setShowBingoCelebration] = useState(false);

  const [winState, setWinState] = useState({
    isBingo: false,
    completedRows: [],
    completedCols: [],
    completedDiagonals: [],
    hasAnyWin: false
  });

  const prevWinBingoRef = useRef(false);
  const currentBall = drawnBalls.length > 0 ? drawnBalls[drawnBalls.length - 1] : null;

  /**
   * Sortear a próxima bola do globo
   */
  const drawNextBall = useCallback(() => {
    setTimerProgress(0);

    setDeck(prevDeck => {
      if (prevDeck.length === 0) {
        setIsPlaying(false);
        return prevDeck;
      }

      const nextBall = prevDeck[0];
      const remaining = prevDeck.slice(1);

      setDrawnBalls(prevDrawn => {
        return [...prevDrawn, nextBall];
      });

      // Efeito sonoro do globo e notificação para voz
      soundFX.playBallDrawn();
      if (onBallDrawn) {
        onBallDrawn(nextBall);
      }

      // Se assistência automática estiver ligada, marca na cartela caso ela tenha o número
      if (autoMark) {
        setCard(currentCard => {
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
              const cell = currentCard[r][c];
              if (cell.number === nextBall) {
                setMarkedCellIds(prev => {
                  const updated = new Set(prev);
                  updated.add(cell.id);
                  return updated;
                });
                soundFX.playPop();
              }
            }
          }
          return currentCard;
        });
      }

      return remaining;
    });
  }, [autoMark, onBallDrawn]);

  /**
   * Timer contínuo para o anel de progresso da bola e sorteio no ritmo escolhido
   */
  useEffect(() => {
    if (!isPlaying || deck.length === 0) {
      setTimerProgress(0);
      return;
    }

    const intervalStepMs = 100;
    const totalMs = autoSpeed * 1000;

    const timer = setInterval(() => {
      setTimerProgress(prev => {
        const next = prev + (intervalStepMs / totalMs) * 100;
        if (next >= 100) {
          drawNextBall();
          return 0;
        }
        return next;
      });
    }, intervalStepMs);

    return () => clearInterval(timer);
  }, [isPlaying, autoSpeed, deck.length, drawNextBall]);

  /**
   * Alternar marcação de uma célula na cartela
   */
  const toggleCell = useCallback((cell) => {
    // Casa livre no centro sempre permanece marcada
    if (cell.isFree) return;

    // Verificar se o número já foi sorteado
    const isDrawn = drawnBalls.includes(cell.number);

    setMarkedCellIds(prev => {
      const next = new Set(prev);
      if (next.has(cell.id)) {
        next.delete(cell.id);
        soundFX.playUnmark();
      } else {
        // Se ainda não foi sorteado, não marca para não confundir a vovó
        if (!isDrawn) {
          return prev;
        }
        next.add(cell.id);
        soundFX.playPop();
      }
      return next;
    });
  }, [drawnBalls]);

  /**
   * Recalcular vitórias e preparar o botão de BINGO
   */
  useEffect(() => {
    const wins = checkBingoWins(card, markedCellIds);
    setWinState(wins);

    // Se completou a cartela e ainda não celebrou
    if (wins.isBingo && !prevWinBingoRef.current) {
      setIsBingoReadyToClaim(true);
      setIsPlaying(false);
    }
  }, [card, markedCellIds]);

  /**
   * Reivindicar e celebrar o BINGO
   */
  const claimBingo = useCallback(() => {
    if (prevWinBingoRef.current) return;
    prevWinBingoRef.current = true;
    setIsBingoReadyToClaim(false);
    setIsPlaying(false);
    setShowBingoCelebration(true);
    soundFX.playBingoFanfare();
    if (onWin) onWin();
  }, [onWin]);

  /**
   * Reiniciar jogo com nova cartela e novo globo
   */
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setTimerProgress(0);
    setIsBingoReadyToClaim(false);
    setShowBingoCelebration(false);
    prevWinBingoRef.current = false;
    setCard(generateBingoCard());
    setDeck(generateDrawDeck());
    setDrawnBalls([]);
    setMarkedCellIds(new Set());
    setWinState({
      isBingo: false,
      completedRows: [],
      completedCols: [],
      completedDiagonals: [],
      hasAnyWin: false
    });
  }, []);

  return {
    card,
    deck,
    drawnBalls,
    currentBall,
    markedCellIds,
    isPlaying,
    setIsPlaying,
    autoSpeed,
    setAutoSpeed,
    autoMark,
    setAutoMark,
    timerProgress,
    winState,
    isBingoReadyToClaim,
    claimBingo,
    showBingoCelebration,
    setShowBingoCelebration,
    drawNextBall,
    toggleCell,
    resetGame
  };
}
