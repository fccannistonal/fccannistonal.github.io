import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    manifest: true,
    outDir: process.env.BUILD_OUT_DIR ?? 'dist',
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      'dist/**',
      'src/lib/firestoreRules.emulator.test.ts',
    ],
  },
});
