#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { legacyRedirects } from './legacy-redirects.mjs';

const rootDir = resolve(import.meta.dirname, '..');
const outDir = process.env.BUILD_OUT_DIR ?? 'dist';
const outputDir = resolve(rootDir, outDir);
const manifest = JSON.parse(
  await readFile(resolve(rootDir, 'src', 'content', 'routeManifest.json'), 'utf8')
);

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const absoluteUrl = (path) => new URL(path, manifest.siteUrl).toString();

function createRedirectHtml(redirect) {
  const canonicalUrl = absoluteUrl(redirect.destinationPath);
  const sourceUrl = absoluteUrl(redirect.sourcePath);
  const title =
    redirect.locale === 'es'
      ? `Redirigiendo a ${redirect.title}`
      : `Redirecting to ${redirect.title}`;
  const message =
    redirect.locale === 'es'
      ? 'Esta página se trasladó. Le estamos enviando al nuevo destino.'
      : 'This page has moved. We are sending you to the new destination.';
  const linkLabel = redirect.locale === 'es' ? 'Continuar al nuevo destino' : 'Continue to the new destination';

  return `<!DOCTYPE html>
<html lang="${redirect.locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, follow" />
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${canonicalUrl}" />
    <meta http-equiv="refresh" content="0; url=${escapeHtml(redirect.destinationPath)}" />
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
        background: #fffaf3;
        color: #241a12;
      }

      main {
        max-width: 34rem;
        padding: 2rem;
        text-align: center;
      }

      a {
        color: #9f581f;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <p><a href="${escapeHtml(redirect.destinationPath)}">${escapeHtml(linkLabel)}</a></p>
    </main>
    <script>
      (function () {
        var destinationPath = ${JSON.stringify(redirect.destinationPath)};
        var destination = destinationPath + window.location.search + window.location.hash;
        window.location.replace(destination);
      })();
    </script>
    <!-- Legacy source: ${sourceUrl} -->
  </body>
</html>
`;
}

for (const redirect of legacyRedirects) {
  const outputPath = resolve(
    outputDir,
    redirect.sourcePath.replace(/^\/|\/$/g, ''),
    'index.html'
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, createRedirectHtml(redirect), 'utf8');
}

console.log(`Generated ${legacyRedirects.length} legacy redirect pages.`);
