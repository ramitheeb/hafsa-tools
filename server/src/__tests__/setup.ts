import { beforeAll, beforeEach } from 'vitest';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { db, sqlite } from '../db';

beforeAll(() => {
  migrate(db, { migrationsFolder: path.join(__dirname, '..', '..', 'drizzle') });
});

beforeEach(() => {
  sqlite.exec('DELETE FROM settings');
});
