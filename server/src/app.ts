import express from 'express';
import session from 'express-session';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { setPassword, verifyPassword, isSetup, requireAuth } from './auth';

export function createApp() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  app.set('trust proxy', 1);
  app.use(express.json());

  if (!isProd) {
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // --- Auth routes ---

  app.get('/api/auth/status', (req, res) => {
    res.json({
      setup: isSetup(),
      authenticated: !!req.session?.authenticated,
    });
  });

  app.post('/api/auth/setup', (req, res) => {
    if (isSetup()) {
      return res.status(400).json({ error: 'Password already set' });
    }
    const { password } = req.body;
    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }
    setPassword(password);
    req.session.authenticated = true;
    res.json({ ok: true });
  });

  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (verifyPassword(password)) {
      req.session.authenticated = true;
      return res.json({ ok: true });
    }
    return res.status(401).json({ error: 'Invalid password' });
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  // --- Protected API placeholder ---

  app.get('/api/me', requireAuth, (req, res) => {
    res.json({ message: 'Welcome, Dr. Hafsa!' });
  });

  // --- Serve frontend in production ---
  const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });

  return app;
}
