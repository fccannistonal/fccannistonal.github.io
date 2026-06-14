import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const templatePath = resolve(rootDir, '404.html');
const rootCnamePath = resolve(rootDir, 'CNAME');
const publicCnamePath = resolve(rootDir, 'public', 'CNAME');
const distCnamePath = resolve(rootDir, 'dist', 'CNAME');
const outputPath = resolve(rootDir, 'dist', '404.html');
const distIndexPath = resolve(rootDir, 'dist', 'index.html');

const normalizeBasePath = (value) => {
  if (!value || value === '/') {
    return '/';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const readOptionalTrimmedFile = async (path) => {
  try {
    return (await readFile(path, 'utf8')).trim();
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
};

const basePath = normalizeBasePath(process.env.BASE_PATH);
const template = await readFile(templatePath, 'utf8');
const output = template.replaceAll('%BASE_URL%', basePath);
const rootCname = await readOptionalTrimmedFile(rootCnamePath);
const publicCname = await readOptionalTrimmedFile(publicCnamePath);

if (rootCname && publicCname && rootCname !== publicCname) {
  throw new Error(
    `CNAME mismatch: ${rootCnamePath} is "${rootCname}" but ${publicCnamePath} is "${publicCname}".`
  );
}

const distIndex = await readFile(distIndexPath, 'utf8');

if (distIndex.includes('/src/main.tsx') || distIndex.includes('/src/favicon.svg')) {
  throw new Error('dist/index.html still references Vite source files instead of built assets.');
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, 'utf8');

const canonicalCname = rootCname ?? publicCname;

if (canonicalCname) {
  await writeFile(distCnamePath, `${canonicalCname}\n`, 'utf8');
}
