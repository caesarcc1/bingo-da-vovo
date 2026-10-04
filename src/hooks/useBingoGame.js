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
  const [winState, setWinState] = useState({
    isBingo: false,
    completedRows: [],
    completedCols: [],
    completedDiagonals: [],
    hasAnyWin: false
  });
  const [showBingoCelebration, setShowBingoCelebration] = useState(false);

  const prevWinBingoRef = useRef(false);
  const currentBall = drawnBalls.length > 0 ? drawnBalls[drawnBalls.length - 1] : null;

  /**
   * Sortear a próxima bola do globo
   */
  const drawNextBall = useCallback(() => {
    setDeck(prevDeck => {
      if (prevDeck.length === 0) {
        setIsPlaying(false);
        return prevDeck;
      }

      const nextBall = prevDeck[0];
      const remaining = prevDeck.slice(1);

      setDrawnBalls(prevDrawn => {
        const nextDrawn = [...prevDrawn, nextBall];
        return nextDrawn;
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
   * Timer para sorteio automático em ritmo pausado
   */
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (deck.length > 0) {
        drawNextBall();
      } else {
        setIsPlaying(false);
      }
    }, autoSpeed * 1000);

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
   * Recalcular vitórias e disparar comemoração
   */
  useEffect(() => {
    const wins = checkBingoWins(card, markedCellIds);
    setWinState(wins);

    // Se bateu BINGO completo e ainda não celebrou
    if (wins.isBingo && !prevWinBingoRef.current) {
      prevWinBingoRef.current = true;
      setIsPlaying(false);
      setShowBingoCelebration(true);
      soundFX.playBingoFanfare();
      if (onWin) onWin();
    }
  }, [card, markedCellIds, onWin]);

  /**
   * Reiniciar jogo com nova cartela e novo globo
   */
  const resetGame = useCallback(() => {
    setIsPlaying(false);
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
    winState,
    showBingoCelebration,
    setShowBingoCelebration,
    drawNextBall,
    toggleCell,
    resetGame
  };
}
