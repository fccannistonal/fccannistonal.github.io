import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const branchPagesFallbackPattern =
  /<!-- BRANCH_PAGES_FALLBACK_START -->[\s\S]*?<!-- BRANCH_PAGES_FALLBACK_END -->/;

const stripBranchPagesFallback = () => ({
  name: 'strip-branch-pages-fallback',
  apply: 'build' as const,
  transformIndexHtml(html: string) {
    return html.replace(branchPagesFallbackPattern, '');
  },
});

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  build: {
    outDir: process.env.BUILD_OUT_DIR ?? 'dist',
  },
  plugins: [react(), tsconfigPaths(), stripBranchPagesFallback()],
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
