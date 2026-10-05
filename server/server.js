import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = fs.existsSync(path.resolve(__dirname, './dist'))
  ? path.resolve(__dirname, './dist')
  : path.resolve(__dirname, '../dist');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Estado em memória das salas
const rooms = new Map();

function getRoom(roomId = 'familia') {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      users: new Map(), // userId -> profile
      socketToUser: new Map(), // socketId -> userId
      gameState: {
        status: 'waiting', // 'waiting' | 'in_game' | 'finished'
        gameId: 'game_' + Date.now(),
        drawnBalls: [],
        currentBall: null,
        podiumWinners: [],
        startedAt: null
      }
    });
  }
  return rooms.get(roomId);
}

// Endpoint de verificação de saúde e presença
app.get('/health', (req, res) => {
  const room = getRoom('familia');
  const userList = Array.from(room.users.values());
  const vovoOnline = userList.some(u => u.role === 'vovo');

  res.json({
    status: 'ok',
    server: 'Hetzner VPS (178.156.222.232)',
    totalOnline: userList.length,
    vovoOnline,
    gameState: room.gameState,
    users: userList.map(u => ({ id: u.id, name: u.name, role: u.role }))
  });
});

io.on('connection', (socket) => {
  let currentRoomId = null;
  let currentUserId = null;

  // 1. Entrar na Sala da Família (com deduplicação estrita de usuários)
  socket.on('join-room', ({ roomId = 'familia', profile }) => {
    currentRoomId = roomId;
    const room = getRoom(roomId);

    // Se o perfil é da vovó, unifica o ID para nunca ter mais de uma Vovó na sala
    const userId = profile.role === 'vovo' ? 'vovo_principal' : (profile.id || socket.id);
    currentUserId = userId;

    const userObj = {
      ...profile,
      id: userId,
      socketId: socket.id,
      isSpeaking: false
    };

    socket.join(roomId);

    // Registra mapeamentos
    room.users.set(userId, userObj);
    room.socketToUser.set(socket.id, userId);

    // Envia lista atualizada de usuários sem duplicados e o estado da mesa
    const cleanUserList = Array.from(room.users.values());
    io.to(roomId).emit('room-users', cleanUserList);
    socket.emit('game-state-sync', room.gameState);

    // Notifica outros participantes para WebRTC de voz
    socket.to(roomId).emit('user-joined-voice', {
      socketId: socket.id,
      user: userObj
    });
  });

  // 2. Vovó Inicia a Partida (Dona da Mesa)
  socket.on('start-game', ({ roomId = 'familia', gameId }) => {
    const room = getRoom(roomId);
    room.gameState = {
      status: 'in_game',
      gameId: gameId || ('game_' + Date.now()),
      drawnBalls: [],
      currentBall: null,
      podiumWinners: [],
      startedAt: Date.now()
    };
    io.to(roomId).emit('game-started', room.gameState);
    io.to(roomId).emit('game-state-sync', room.gameState);
  });

  // 3. Vovó Sorteia Pedra no Globo Principal
  socket.on('ball-drawn', ({ roomId = 'familia', ball }) => {
    const room = getRoom(roomId);
    if (!room.gameState.drawnBalls.includes(ball)) {
      room.gameState.drawnBalls.push(ball);
      room.gameState.currentBall = ball;
    }
    io.to(roomId).emit('ball-drawn', { ball, gameState: room.gameState });
  });

  // 4. Reivindicação de BINGO Compartilhado no Pódio
  socket.on('claim-bingo', ({ roomId = 'familia', winner }) => {
    const room = getRoom(roomId);

    // Evita reivindicação duplicada da mesma pessoa no mesmo jogo
    const alreadyWon = room.gameState.podiumWinners.some(
      w => w.id === winner.id || (w.role === 'vovo' && winner.role === 'vovo')
    );
    if (alreadyWon) return;

    const place = Math.min(3, room.gameState.podiumWinners.length + 1);
    const fullWinner = { ...winner, winPlace: place };

    room.gameState.podiumWinners.push(fullWinner);

    if (room.gameState.podiumWinners.length >= 3) {
      room.gameState.status = 'finished';
    }

    io.to(roomId).emit('bingo-claimed', {
      winner: fullWinner,
      podiumWinners: room.gameState.podiumWinners
    });
  });

  // 5. Vovó Reinicia a Mesa para uma Nova Partida
  socket.on('reset-game', ({ roomId = 'familia' }) => {
    const room = getRoom(roomId);
    room.gameState = {
      status: 'waiting',
      gameId: 'game_' + Date.now(),
      drawnBalls: [],
      currentBall: null,
      podiumWinners: [],
      startedAt: null
    };
    io.to(roomId).emit('game-reset', room.gameState);
    io.to(roomId).emit('game-state-sync', room.gameState);
  });

  // 6. Sincronizar Estado Geral da Mesa
  socket.on('sync-game-state', ({ roomId = 'familia', gameState }) => {
    const room = getRoom(roomId);
    room.gameState = { ...room.gameState, ...gameState };
    io.to(roomId).emit('game-state-sync', room.gameState);
  });

  // 7. Sinalização WebRTC para Áudio P2P (Offer, Answer, ICE Candidate)
  socket.on('webrtc-signal', ({ to, signal }) => {
    io.to(to).emit('webrtc-signal', {
      from: socket.id,
      signal
    });
  });

  // 8. Transmissão do Estado de Quem está Falando (Anel Verde)
  socket.on('speaking-state', ({ roomId = 'familia', isSpeaking }) => {
    if (currentUserId && currentRoomId) {
      const room = getRoom(currentRoomId);
      const user = room.users.get(currentUserId);
      if (user) {
        user.isSpeaking = isSpeaking;
        socket.to(currentRoomId).emit('user-speaking', {
          socketId: socket.id,
          userId: currentUserId,
          isSpeaking
        });
      }
    }
  });

  // 9. Desconexão Segura com Limpeza Sem Duplicatas
  socket.on('disconnect', () => {
    if (currentRoomId && currentUserId) {
      const room = getRoom(currentRoomId);
      room.socketToUser.delete(socket.id);

      // Só remove o usuário se não houver outra aba/conexão ativa dele
      const hasOtherSocket = Array.from(room.socketToUser.values()).includes(currentUserId);
      if (!hasOtherSocket) {
        room.users.delete(currentUserId);
      }

      io.to(currentRoomId).emit('room-users', Array.from(room.users.values()));
      socket.to(currentRoomId).emit('user-left-voice', { socketId: socket.id });
    }
  });
});

if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`👵 Servidor Bingo da Família rodando na porta ${PORT}`);
  console.log(`🔗 Hetzner VPS: http://178.156.222.232:${PORT}/health`);
});
