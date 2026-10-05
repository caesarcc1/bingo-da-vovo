import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const HETZNER_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'https://bingo.178-156-222-232.sslip.io';

export function useFamilySocket({
  profile,
  onRemoteBallDrawn,
  onRemoteBingoClaimed,
  onGameStateSync,
  onGameStarted,
  onGameReset,
  onUserSpeaking
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomGameState, setRoomGameState] = useState({
    status: 'waiting', // 'waiting' | 'in_game' | 'finished'
    gameId: null,
    drawnBalls: [],
    currentBall: null,
    podiumWinners: [],
    startedAt: null
  });

  const socketRef = useRef(null);

  const profileRef = useRef(profile);
  profileRef.current = profile;
  const onRemoteBallDrawnRef = useRef(onRemoteBallDrawn);
  onRemoteBallDrawnRef.current = onRemoteBallDrawn;
  const onRemoteBingoClaimedRef = useRef(onRemoteBingoClaimed);
  onRemoteBingoClaimedRef.current = onRemoteBingoClaimed;
  const onGameStateSyncRef = useRef(onGameStateSync);
  onGameStateSyncRef.current = onGameStateSync;
  const onGameStartedRef = useRef(onGameStarted);
  onGameStartedRef.current = onGameStarted;
  const onGameResetRef = useRef(onGameReset);
  onGameResetRef.current = onGameReset;
  const onUserSpeakingRef = useRef(onUserSpeaking);
  onUserSpeakingRef.current = onUserSpeaking;

  useEffect(() => {
    // Inicia conexão resiliente com o servidor Hetzner
    const socket = io(HETZNER_SERVER_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
      timeout: 5000,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { roomId: 'familia', profile: profileRef.current });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('room-users', (users) => {
      setRoomUsers(users);
    });

    socket.on('game-state-sync', (gameState) => {
      if (gameState) setRoomGameState(gameState);
      if (onGameStateSyncRef.current) onGameStateSyncRef.current(gameState);
    });

    socket.on('game-started', (gameState) => {
      if (gameState) setRoomGameState(gameState);
      if (onGameStartedRef.current) onGameStartedRef.current(gameState);
    });

    socket.on('game-reset', (gameState) => {
      if (gameState) setRoomGameState(gameState);
      if (onGameResetRef.current) onGameResetRef.current(gameState);
    });

    socket.on('ball-drawn', ({ ball, gameState }) => {
      if (gameState) setRoomGameState(gameState);
      if (onRemoteBallDrawnRef.current) onRemoteBallDrawnRef.current(ball, gameState);
    });

    socket.on('bingo-claimed', ({ winner, podiumWinners }) => {
      if (podiumWinners) {
        setRoomGameState(prev => ({ ...prev, podiumWinners }));
      }
      if (onRemoteBingoClaimedRef.current) onRemoteBingoClaimedRef.current(winner, podiumWinners);
    });

    socket.on('user-speaking', ({ userId, isSpeaking }) => {
      setRoomUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isSpeaking } : u))
      );
      if (onUserSpeakingRef.current) onUserSpeakingRef.current(userId, isSpeaking);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Conecta uma única vez ao montar

  // Iniciar partida (Host / Vovó)
  const emitStartGame = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('start-game', { roomId: 'familia' });
    }
  }, []);

  // Reiniciar partida (Host / Vovó)
  const emitResetGame = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('reset-game', { roomId: 'familia' });
    }
  }, []);

  // Transmitir pedra sorteada
  const emitBallDrawn = useCallback((ball) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('ball-drawn', { roomId: 'familia', ball });
    }
  }, []);

  // Transmitir BINGO batido
  const emitClaimBingo = useCallback((winner) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('claim-bingo', { roomId: 'familia', winner });
    }
  }, []);

  // Transmitir quem está falando
  const emitSpeakingState = useCallback((isSpeaking) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('speaking-state', { roomId: 'familia', isSpeaking });
    }
  }, []);

  return {
    isConnected,
    roomUsers,
    roomGameState,
    socket: socketRef.current,
    emitStartGame,
    emitResetGame,
    emitBallDrawn,
    emitClaimBingo,
    emitSpeakingState
  };
}
