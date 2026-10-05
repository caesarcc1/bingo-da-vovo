import { useState, useEffect, useCallback, useRef } from 'react';
import { generateBingoCard, generateDrawDeck, checkBingoWins } from '../utils/bingoRules';
import { initializeVirtualPlayers, processVirtualDraw } from '../utils/virtualPlayers';
import { soundFX } from '../utils/soundEffects';

export function useBingoGame({
  onBallDrawn,
  onWin,
  onVirtualWin,
  onGameOver,
  playerName = 'Vovó'
}) {
  const [card, setCard] = useState(() => generateBingoCard());
  const [deck, setDeck] = useState(() => generateDrawDeck());
  const [drawnBalls, setDrawnBalls] = useState([]);
  const [markedCellIds, setMarkedCellIds] = useState(() => new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState(10); // segundos por bola
  const [autoMark, setAutoMark] = useState(false); // assistência automática
  const [autoBingo, setAutoBingo] = useState(false); // auto-bingo instantâneo
  const [timerProgress, setTimerProgress] = useState(0); // 0 a 100% para o anel da bola
  const [isBingoReadyToClaim, setIsBingoReadyToClaim] = useState(false);

  // Jogadores Virtuais & Pódio (3 Ganhadores)
  const [virtualPlayers, setVirtualPlayers] = useState(() => initializeVirtualPlayers());
  const [podiumWinners, setPodiumWinners] = useState([]); // array de { id, name, winPlace, winPattern }
  const [latestVirtualWinner, setLatestVirtualWinner] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [vovoWinPlace, setVovoWinPlace] = useState(null);

  const [winState, setWinState] = useState({
    isBingo: false,
    patternDescription: '',
    winningCellIds: new Set(),
    completedRows: [],
    completedCols: [],
    completedDiagonals: [],
    completedFourCorners: [],
    fullCard: false
  });

  const prevWinBingoRef = useRef(false);
  const podiumCountRef = useRef(0);
  podiumCountRef.current = podiumWinners.length;

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

      // Se assistência automática estiver ligada para a vovó
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

      // Processar jogada para os jogadores virtuais
      setVirtualPlayers(currentVirtuals => {
        // Se a vovó já venceu ou o pódio já completou 3, não processa novos virtuais
        if (podiumCountRef.current >= 3 || prevWinBingoRef.current) {
          return currentVirtuals;
        }

        const { updatedPlayers, newWinners } = processVirtualDraw(
          currentVirtuals,
          nextBall,
          podiumCountRef.current
        );

        if (newWinners.length > 0) {
          setPodiumWinners(prevPodium => {
            const updatedPodium = [...prevPodium, ...newWinners];
            podiumCountRef.current = updatedPodium.length;

            // Se 3 jogadores virtuais venceram antes da vovó, encerra a partida
            if (updatedPodium.length >= 3 && !prevWinBingoRef.current) {
              setIsPlaying(false);
              setTimeout(() => {
                setIsGameOver(true);
                if (onGameOver) onGameOver(updatedPodium);
              }, 1200);
            }

            return updatedPodium;
          });

          // Mostra banner animado do vencedor virtual
          setLatestVirtualWinner(newWinners[0]);
          if (onVirtualWin) onVirtualWin(newWinners[0]);
        }

        return updatedPlayers;
      });

      return remaining;
    });
  }, [autoMark, onBallDrawn, onGameOver, onVirtualWin]);

  /**
   * Timer contínuo para o anel de progresso da bola e sorteio automático
   */
  useEffect(() => {
    if (!isPlaying || deck.length === 0 || isGameOver) {
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
  }, [isPlaying, autoSpeed, deck.length, drawNextBall, isGameOver]);

  /**
   * Alternar marcação de uma célula na cartela
   */
  const toggleCell = useCallback((cell) => {
    if (cell.isFree) return;
    const isDrawn = drawnBalls.includes(cell.number);

    setMarkedCellIds(prev => {
      const next = new Set(prev);
      if (next.has(cell.id)) {
        next.delete(cell.id);
        soundFX.playUnmark();
      } else {
        if (!isDrawn) return prev;
        next.add(cell.id);
        soundFX.playPop();
      }
      return next;
    });
  }, [drawnBalls]);

  /**
   * Reivindicar e celebrar o BINGO
   */
  const claimBingo = useCallback(() => {
    if (prevWinBingoRef.current) return;
    prevWinBingoRef.current = true;
    setIsBingoReadyToClaim(false);
    setIsPlaying(false);

    // Posição no Pódio conquistada pelo jogador
    const place = Math.min(3, podiumWinners.length + 1);
    setVovoWinPlace(place);

    const winnerObj = {
      id: 'local_player',
      name: playerName || 'Vovó',
      winPlace: place,
      winPattern: winState.patternDescription || 'Bingo'
    };

    setPodiumWinners(prev => [...prev, winnerObj]);
    soundFX.playBingoFanfare();

    if (onWin) onWin(place, winState.patternDescription, winnerObj);
  }, [onWin, podiumWinners.length, winState.patternDescription, playerName]);

  /**
   * Recalcular vitórias na cartela
   */
  useEffect(() => {
    const wins = checkBingoWins(card, markedCellIds);
    setWinState(wins);

    // Se completou qualquer padrão válido (linha, coluna, diagonal, 4 pontas)
    if (wins.isBingo && !prevWinBingoRef.current) {
      setIsBingoReadyToClaim(true);
      if (autoBingo) {
        const timer = setTimeout(() => {
          claimBingo();
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [card, markedCellIds, autoBingo, claimBingo]);

  /**
   * Processar pedra vinda de outro jogador pela sala (Multiplayer)
   */
  const applyRemoteBall = useCallback((ball) => {
    setDrawnBalls(prev => {
      if (prev.includes(ball)) return prev;
      return [...prev, ball];
    });

    setDeck(prevDeck => prevDeck.filter(b => b !== ball));
    soundFX.playBallDrawn();

    if (autoMark) {
      setCard(currentCard => {
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const cell = currentCard[r][c];
            if (cell.number === ball) {
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
  }, [autoMark]);

  /**
   * Reiniciar jogo com nova cartela, novo globo e novos bots
   */
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setTimerProgress(0);
    setIsBingoReadyToClaim(false);
    prevWinBingoRef.current = false;
    podiumCountRef.current = 0;
    setVovoWinPlace(null);
    setIsGameOver(false);
    setLatestVirtualWinner(null);
    setPodiumWinners([]);
    setVirtualPlayers(initializeVirtualPlayers());
    setCard(generateBingoCard());
    setDeck(generateDrawDeck());
    setDrawnBalls([]);
    setMarkedCellIds(new Set());
    setWinState({
      isBingo: false,
      patternDescription: '',
      winningCellIds: new Set(),
      completedRows: [],
      completedCols: [],
      completedDiagonals: [],
      completedFourCorners: [],
      fullCard: false
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
    autoBingo,
    setAutoBingo,
    timerProgress,
    winState,
    isBingoReadyToClaim,
    claimBingo,
    podiumWinners,
    latestVirtualWinner,
    setLatestVirtualWinner,
    isGameOver,
    vovoWinPlace,
    drawNextBall,
    applyRemoteBall,
    toggleCell,
    resetGame
  };
}
