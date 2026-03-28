import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('API routes', () => {
  describe('GET /api/auth/status', () => {
    it('returns setup: false and authenticated: false initially', async () => {
      const res = await request(app).get('/api/auth/status');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ setup: false, authenticated: false });
    });
  });

  describe('POST /api/auth/setup', () => {
    it('sets up a password and authenticates', async () => {
      const res = await request(app)
        .post('/api/auth/setup')
        .send({ password: 'testpass' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    it('rejects setup if password already set', async () => {
      await request(app).post('/api/auth/setup').send({ password: 'testpass' });
      const res = await request(app)
        .post('/api/auth/setup')
        .send({ password: 'another' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password already set');
    });

    it('rejects short passwords', async () => {
      const res = await request(app)
        .post('/api/auth/setup')
        .send({ password: 'ab' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password must be at least 4 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('rejects invalid password', async () => {
      await request(app).post('/api/auth/setup').send({ password: 'testpass' });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'wrong' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid password');
    });

    it('accepts valid password and sets session', async () => {
      await request(app).post('/api/auth/setup').send({ password: 'testpass' });
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'testpass' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });
  });

  describe('GET /api/me (protected)', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app).get('/api/me');
      expect(res.status).toBe(401);
    });

    it('returns 200 with valid session', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/setup').send({ password: 'testpass' });
      const res = await agent.get('/api/me');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Welcome, Dr. Hafsa!');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('destroys session', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/setup').send({ password: 'testpass' });
      await agent.post('/api/auth/logout');
      const res = await agent.get('/api/me');
      expect(res.status).toBe(401);
    });
  });
});
