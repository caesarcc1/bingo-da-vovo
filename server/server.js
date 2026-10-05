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
      users: new Map(), // socketId -> profile
      gameState: {
        drawnBalls: [],
        currentBall: null,
        podiumWinners: [],
        isPlaying: false
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
    users: userList.map(u => ({ id: u.id, name: u.name, role: u.role }))
  });
});

io.on('connection', (socket) => {
  let currentRoomId = null;
  let currentUser = null;

  // 1. Entrar na Sala da Família
  socket.on('join-room', ({ roomId = 'familia', profile }) => {
    currentRoomId = roomId;
    currentUser = {
      ...profile,
      socketId: socket.id,
      isSpeaking: false
    };

    socket.join(roomId);
    const room = getRoom(roomId);
    room.users.set(socket.id, currentUser);

    // Envia lista atualizada de usuários e o estado atual do jogo
    io.to(roomId).emit('room-users', Array.from(room.users.values()));
    socket.emit('game-state-sync', room.gameState);

    // Notifica outros participantes para iniciar sinalização WebRTC de voz
    socket.to(roomId).emit('user-joined-voice', {
      socketId: socket.id,
      user: currentUser
    });
  });

  // 2. Transmissão de Pedra Sorteada (pela Vovó ou Anfitrião)
  socket.on('ball-drawn', ({ roomId = 'familia', ball }) => {
    const room = getRoom(roomId);
    if (!room.gameState.drawnBalls.includes(ball)) {
      room.gameState.drawnBalls.push(ball);
      room.gameState.currentBall = ball;
    }
    io.to(roomId).emit('ball-drawn', { ball, gameState: room.gameState });
  });

  // 3. Sincronizar Estado Geral da Mesa (Pausar, Iniciar, Reset)
  socket.on('sync-game-state', ({ roomId = 'familia', gameState }) => {
    const room = getRoom(roomId);
    room.gameState = { ...room.gameState, ...gameState };
    io.to(roomId).emit('game-state-sync', room.gameState);
  });

  // 4. Reivindicação de BINGO Compartilhado no Pódio
  socket.on('claim-bingo', ({ roomId = 'familia', winner }) => {
    const room = getRoom(roomId);
    const place = Math.min(3, room.gameState.podiumWinners.length + 1);
    const fullWinner = { ...winner, winPlace: place };

    room.gameState.podiumWinners.push(fullWinner);
    io.to(roomId).emit('bingo-claimed', {
      winner: fullWinner,
      podiumWinners: room.gameState.podiumWinners
    });
  });

  // 5. Sinalização WebRTC para Áudio P2P (Offer, Answer, ICE Candidate)
  socket.on('webrtc-signal', ({ to, signal, from }) => {
    io.to(to).emit('webrtc-signal', {
      from: socket.id,
      signal
    });
  });

  // 6. Transmissão do Estado de Quem está Falando (Anel Verde)
  socket.on('speaking-state', ({ roomId = 'familia', isSpeaking }) => {
    if (currentUser) {
      currentUser.isSpeaking = isSpeaking;
      socket.to(roomId).emit('user-speaking', {
        socketId: socket.id,
        userId: currentUser.id,
        isSpeaking
      });
    }
  });

  // 7. Desconexão
  socket.on('disconnect', () => {
    if (currentRoomId) {
      const room = getRoom(currentRoomId);
      room.users.delete(socket.id);

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
