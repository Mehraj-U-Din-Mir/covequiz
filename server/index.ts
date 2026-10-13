import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { apiRouter } from './routes';
import { sessionStore } from './sessionStore';

// Automatically load .env if present
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
} catch {
  // Gracefully continue
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// WebSocket Setup for Real-time Classroom Sessions
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // Join Room
  socket.on('join-room', (payload: { code: string; nickname: string; avatar: string; id: string }) => {
    const result = sessionStore.joinParticipant(payload.code, {
      id: payload.id || socket.id,
      nickname: payload.nickname,
      avatar: payload.avatar,
      socketId: socket.id,
    });

    if (result) {
      socket.join(result.session.code);
      io.to(result.session.code).emit('session-update', result.session);
    } else {
      socket.emit('error-message', 'Invalid or expired room code');
    }
  });

  // Submit Answer
  socket.on('submit-answer', (payload: {
    code: string;
    playerId: string;
    nickname: string;
    points: number;
    isCorrect: boolean;
    skillName?: string;
  }) => {
    const updated = sessionStore.recordScore(
      payload.code,
      payload.playerId,
      payload.points,
      payload.isCorrect,
      payload.skillName || 'General'
    );

    if (updated) {
      io.to(updated.code).emit('session-update', updated);
      io.to(updated.code).emit('score-popup', {
        nickname: payload.nickname,
        points: payload.points,
        isCorrect: payload.isCorrect,
      });
    }
  });

  // Teacher Action
  socket.on('teacher-action', (payload: { code: string; action: 'start' | 'pause' | 'resume' | 'end' }) => {
    let nextStatus: 'lobby' | 'active' | 'paused' | 'completed' = 'active';
    if (payload.action === 'pause') nextStatus = 'paused';
    if (payload.action === 'resume') nextStatus = 'active';
    if (payload.action === 'end') nextStatus = 'completed';

    const updated = sessionStore.updateStatus(payload.code, nextStatus);
    if (updated) {
      io.to(updated.code).emit('session-update', updated);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 CoveQuiz Classroom Engine running on http://localhost:${PORT}`);
});

export { app, server };
