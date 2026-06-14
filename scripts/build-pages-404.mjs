import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const templatePath = resolve(rootDir, '404.html');
const outputPath = resolve(rootDir, 'dist', '404.html');

const normalizeBasePath = (value) => {
  if (!value || value === '/') {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const basePath = normalizeBasePath(process.env.BASE_PATH);
const template = await readFile(templatePath, 'utf8');
const output = template.replaceAll('%BASE_URL%', basePath);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, 'utf8');
