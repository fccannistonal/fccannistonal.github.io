#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const rootCname = resolve(rootDir, 'CNAME');
const publicCname = resolve(rootDir, 'public', 'CNAME');

const hasCname = existsSync(rootCname) || existsSync(publicCname);
const basePath = hasCname ? '/' : '/docs/';

console.log(`Building docs with BASE_PATH=${basePath} (CNAME present: ${hasCname})`);

const env = { ...process.env, BASE_PATH: basePath, BUILD_OUT_DIR: 'docs' };

try {
  execSync('vite build', { stdio: 'inherit', env });
  execSync('node ./scripts/build-pages-404.mjs', { stdio: 'inherit', env });
  console.log('Docs build complete.');
} catch (error) {
  console.error('Docs build failed.');
  process.exit(1);
}
