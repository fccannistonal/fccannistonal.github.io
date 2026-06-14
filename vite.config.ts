import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.mjs',
    include: [
      'src/Router.test.tsx',
      'src/pages/**/*.test.tsx',
      'src/components/church/**/*.test.tsx',
      'src/components/HeaderSimple/HeaderSimple.test.tsx',
      'src/components/FooterSimple/FooterSimple.test.tsx',
    ],
  },
});
