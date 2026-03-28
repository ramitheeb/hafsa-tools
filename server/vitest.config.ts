import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    fileParallelism: false,
    env: {
      DATABASE_PATH: path.join(__dirname, 'test.db'),
    },
  },
});
