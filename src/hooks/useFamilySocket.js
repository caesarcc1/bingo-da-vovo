import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const HETZNER_SERVER_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? window.location.origin : 'http://178.156.222.232:3001');

export function useFamilySocket({
  profile,
  onRemoteBallDrawn,
  onRemoteBingoClaimed,
  onGameStateSync,
  onUserSpeaking
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [roomUsers, setRoomUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Inicia conexão resiliente com o servidor Hetzner
    const socket = io(HETZNER_SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 4000,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', { roomId: 'familia', profile });
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

    socket.on('ball-drawn', ({ ball, gameState }) => {
      if (onRemoteBallDrawn) onRemoteBallDrawn(ball, gameState);
    });

    socket.on('bingo-claimed', ({ winner, podiumWinners }) => {
      if (onRemoteBingoClaimed) onRemoteBingoClaimed(winner, podiumWinners);
    });

    socket.on('game-state-sync', (gameState) => {
      if (onGameStateSync) onGameStateSync(gameState);
    });

    socket.on('user-speaking', ({ userId, isSpeaking }) => {
      setRoomUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isSpeaking } : u))
      );
      if (onUserSpeaking) onUserSpeaking(userId, isSpeaking);
    });

    return () => {
      socket.disconnect();
    };
  }, [profile.id]);

  // Transmitir pedra sorteada
  const emitBallDrawn = useCallback((ball) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('ball-drawn', { roomId: 'familia', ball });
    }
  }, [isConnected]);

  // Transmitir BINGO batido
  const emitClaimBingo = useCallback((winner) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('claim-bingo', { roomId: 'familia', winner });
    }
  }, [isConnected]);

  // Transmitir quem está falando
  const emitSpeakingState = useCallback((isSpeaking) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('speaking-state', { roomId: 'familia', isSpeaking });
    }
  }, [isConnected]);

  return {
    isConnected,
    roomUsers,
    socket: socketRef.current,
    emitBallDrawn,
    emitClaimBingo,
    emitSpeakingState
  };
}
