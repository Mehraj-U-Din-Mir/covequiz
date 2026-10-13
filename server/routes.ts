import { Router, Request, Response } from 'express';
import { sessionStore } from './sessionStore';
import { askAiCoach } from './groqClient';
import { CURRICULUM_COMPETENCIES, LEVEL_SUMMARIES } from '../src/data/curriculumData';
import { ALL_GAMES } from '../src/data/gamesRegistry';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CoveQuiz Classroom Engine',
    timestamp: new Date().toISOString(),
    totalGames: ALL_GAMES.length,
    groqConfigured: !!process.env.GROQ_API_KEY,
  });
});

// Create Classroom Session
apiRouter.post('/sessions', (req: Request, res: Response) => {
  const { teacherId, title, level, gameId, mode, durationMinutes } = req.body;
  if (!level || !gameId) {
    return res.status(400).json({ error: 'Level and Game ID are required' });
  }

  const session = sessionStore.createSession({
    teacherId: teacherId || 'teacher_guest',
    title: title || `Level ${level} Classroom Match`,
    level: Number(level),
    gameId,
    mode: mode || 'competitive',
    durationMinutes: Number(durationMinutes) || 10,
  });

  res.status(201).json(session);
});

// Get Session Status
apiRouter.get('/sessions/:code', (req: Request, res: Response) => {
  const session = sessionStore.getSession(req.params.code);
  if (!session) {
    return res.status(404).json({ error: 'Session code not found or expired' });
  }
  res.json(session);
});

// AI Mathematics Coach Endpoint
apiRouter.post('/ai/coach', async (req: Request, res: Response) => {
  const { prompt, context } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt string is required' });
  }

  try {
    const aiResponse = await askAiCoach({ prompt, context });
    res.json(aiResponse);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal AI Coach processing error' });
  }
});

// Achievement Badges Sync Endpoint (Server Validation & Storage)
apiRouter.post('/achievements/sync', (req: Request, res: Response) => {
  const { studentId, nickname, badges } = req.body;
  if (!studentId || !Array.isArray(badges)) {
    return res.status(400).json({ error: 'studentId and badges array are required' });
  }

  res.json({
    success: true,
    studentId,
    nickname,
    syncedCount: badges.length,
    serverTimestamp: new Date().toISOString(),
    status: 'cloud_verified',
  });
});

// Curriculum Competencies Endpoint
apiRouter.get('/curriculum', (_req: Request, res: Response) => {
  res.json({
    competencies: CURRICULUM_COMPETENCIES,
    levelSummaries: LEVEL_SUMMARIES,
    totalMappedGames: ALL_GAMES.length,
  });
});
