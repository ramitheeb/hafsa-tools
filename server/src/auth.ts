import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { settings } from './schema';
import { Request, Response, NextFunction } from 'express';

const SALT_ROUNDS = 12;

function getPasswordHash(): string | null {
  const row = db.select().from(settings).where(eq(settings.key, 'password_hash')).get();
  return row ? row.value : null;
}

export function setPassword(plainPassword: string): string {
  const hash = bcrypt.hashSync(plainPassword, SALT_ROUNDS);
  db.insert(settings)
    .values({ key: 'password_hash', value: hash })
    .onConflictDoUpdate({ target: settings.key, set: { value: hash } })
    .run();
  return hash;
}

export function verifyPassword(plainPassword: string): boolean {
  const hash = getPasswordHash();
  if (!hash) return false;
  return bcrypt.compareSync(plainPassword, hash);
}

export function isSetup(): boolean {
  return getPasswordHash() !== null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session?.authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated' });
}

declare module 'express-session' {
  interface SessionData {
    authenticated?: boolean;
  }
}
