import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const branchPagesFallbackPattern =
  /<!-- BRANCH_PAGES_FALLBACK_START -->[\s\S]*?<!-- BRANCH_PAGES_FALLBACK_END -->/;

const stripBranchPagesFallback = () => ({
  name: 'strip-branch-pages-fallback',
  apply: 'build',
  transformIndexHtml(html) {
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
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
