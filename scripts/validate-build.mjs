#!/usr/bin/env node
import { access, readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, parse, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { isConflictCopyArtifactPath } from './build-validation-rules.mjs';
import { legacyRedirects } from './legacy-redirects.mjs';

const rootDir = resolve(import.meta.dirname, '..');
const outDir = process.env.BUILD_OUT_DIR ?? 'dist';
const outputDir = resolve(rootDir, outDir);
const sourceImageDir = resolve(rootDir, 'source-images', 'images');
const manifest = JSON.parse(
  await readFile(resolve(rootDir, 'src', 'content', 'routeManifest.json'), 'utf8')
);
const errors = [];
const initialJavascriptPaths = new Set();

const absoluteUrl = (path) => new URL(path, manifest.siteUrl).toString();

for (const route of manifest.routes) {
  const routePath =
    route.path === '/'
      ? resolve(outputDir, 'index.html')
      : resolve(outputDir, route.path.replace(/^\/|\/$/g, ''), 'index.html');

  try {
    const html = await readFile(routePath, 'utf8');
    const requiredFragments = [
      `<html lang="${route.locale}"`,
      `<title>${route.title}</title>`,
      `rel="canonical"`,
      `hreflang="en"`,
      `hreflang="es"`,
      `application/ld+json`,
      `data-route-style="${route.id}"`,
      `<main id="main-content"`,
      `<h1`,
    ];

    requiredFragments.forEach((fragment) => {
      if (!html.includes(fragment)) {
        errors.push(`${route.path}: missing ${fragment}`);
      }
    });

    const structuredDataMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    if (!structuredDataMatch) {
      errors.push(`${route.path}: structured data is not parseable`);
    } else {
      try {
        const structuredData = JSON.parse(structuredDataMatch[1]);
        if (
          structuredData['@type'] !== 'Church' ||
          !structuredData.telephone ||
          !structuredData.address?.streetAddress ||
          !Array.isArray(structuredData.event)
        ) {
          errors.push(`${route.path}: Church structured data is incomplete`);
        }
      } catch {
        errors.push(`${route.path}: structured data contains invalid JSON`);
      }
    }

    for (const match of html.matchAll(/<script[^>]+src="([^"]+\.js)"[^>]*>/g)) {
      initialJavascriptPaths.add(match[1].replace(/^\//, ''));
    }

    const routeSocialImage = absoluteUrl(route.socialImage ?? manifest.socialImage);
    if (!html.includes(`<meta property="og:image" content="${routeSocialImage}"`)) {
      errors.push(`${route.path}: missing route social image metadata`);
    }

    if (route.faq) {
      if (!html.includes('"@type":"FAQPage"')) {
        errors.push(`${route.path}: FAQ structured data is missing`);
      }
      if (route.faq.some((item) => !html.includes(item.question) || !html.includes(item.answer))) {
        errors.push(`${route.path}: FAQ structured data is incomplete`);
      }
    }
  } catch {
    errors.push(`${route.path}: static HTML was not generated`);
  }
}

for (const route of manifest.routes) {
  const reciprocalRoute = manifest.routes.find(
    (candidate) => candidate.path === route.alternatePath
  );
  if (
    !reciprocalRoute ||
    reciprocalRoute.alternatePath !== route.path ||
    reciprocalRoute.id !== route.id
  ) {
    errors.push(`${route.path}: localized alternate route is not reciprocal`);
  }
}

for (const requiredFile of [
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'images/social/fcc-anniston.jpg',
]) {
  try {
    await access(resolve(outputDir, requiredFile));
  } catch {
    errors.push(`Missing build artifact: ${requiredFile}`);
  }
}

const sitemap = await readFile(resolve(outputDir, 'sitemap.xml'), 'utf8');
for (const route of manifest.routes) {
  const routeUrl = new URL(route.path, manifest.siteUrl).toString();
  if (!sitemap.includes(`<loc>${routeUrl}</loc>`)) {
    errors.push(`${route.path}: missing from sitemap.xml`);
  }
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)));
    } else {
      files.push(path);
    }
  }

  return files;
}

async function listPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    paths.push(path);
    if (entry.isDirectory()) {
      paths.push(...(await listPaths(path)));
    }
  }

  return paths;
}

const outputPaths = await listPaths(outputDir);
const conflictCopyArtifacts = outputPaths
  .map((path) => relative(outputDir, path))
  .filter(isConflictCopyArtifactPath);

if (conflictCopyArtifacts.length > 0) {
  errors.push(
    `Unexpected duplicate build artifacts: ${conflictCopyArtifacts.slice(0, 12).join(', ')}`
  );
}

for (const redirect of legacyRedirects) {
  const redirectPath = resolve(
    outputDir,
    redirect.sourcePath.replace(/^\/|\/$/g, ''),
    'index.html'
  );

  try {
    const html = await readFile(redirectPath, 'utf8');
    const canonicalUrl = absoluteUrl(redirect.destinationPath);
    const requiredFragments = [
      `<html lang="${redirect.locale}"`,
      `<meta name="robots" content="noindex, follow"`,
      `<link rel="canonical" href="${canonicalUrl}"`,
      `window.location.replace(destination)`,
      `href="${redirect.destinationPath}"`,
    ];

    requiredFragments.forEach((fragment) => {
      if (!html.includes(fragment)) {
        errors.push(`${redirect.sourcePath}: legacy redirect is missing ${fragment}`);
      }
    });
  } catch {
    errors.push(`${redirect.sourcePath}: legacy redirect page was not generated`);
  }
}

const sourceImages = (await listFiles(sourceImageDir)).filter((path) =>
  ['.jpg', '.jpeg', '.png'].includes(extname(path).toLowerCase())
);

for (const sourceImage of sourceImages) {
  const sourceRelativePath = relative(sourceImageDir, sourceImage);
  const outputImagePath = resolve(outputDir, 'images', sourceRelativePath);
  const outputImage = parse(outputImagePath);

  try {
    await access(outputImagePath);
    const siblingFiles = await readdir(dirname(outputImagePath));
    const hasAvif = siblingFiles.some(
      (file) => file.startsWith(`${outputImage.name}-`) && file.endsWith('.avif')
    );
    const hasWebp = siblingFiles.some(
      (file) => file.startsWith(`${outputImage.name}-`) && file.endsWith('.webp')
    );

    if (!hasAvif || !hasWebp) {
      errors.push(`${sourceRelativePath}: responsive AVIF/WebP variants are missing`);
    }
  } catch {
    errors.push(`${sourceRelativePath}: optimized fallback image is missing`);
  }
}

for (const socialImagePath of new Set([
  manifest.socialImage,
  ...manifest.routes.flatMap((route) => (route.socialImage ? [route.socialImage] : [])),
])) {
  try {
    await access(resolve(outputDir, socialImagePath.replace(/^\//, '')));
  } catch {
    errors.push(`Missing social image: ${socialImagePath}`);
  }
}

const assetFiles = await listFiles(resolve(outputDir, 'assets'));
const javascriptBytes = (
  await Promise.all(
    assetFiles
      .filter((path) => extname(path) === '.js')
      .map(async (path) => (await stat(path)).size)
  )
).reduce((total, size) => total + size, 0);
const initialJavascriptGzipBytes = (
  await Promise.all(
    [...initialJavascriptPaths].map(
      async (path) => gzipSync(await readFile(resolve(outputDir, path))).byteLength
    )
  )
).reduce((total, size) => total + size, 0);

if (javascriptBytes === 0) {
  errors.push('No production JavaScript assets were generated.');
}

if (initialJavascriptGzipBytes === 0) {
  errors.push('No initial production JavaScript was referenced by generated HTML.');
}

if (initialJavascriptGzipBytes > 150 * 1024) {
  errors.push(
    `Initial JavaScript is ${Math.round(initialJavascriptGzipBytes / 1024)} KB gzip; budget is 150 KB.`
  );
}

if (errors.length > 0) {
  throw new Error(`Build validation failed:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Build validation passed. JavaScript assets: ${Math.round(
    javascriptBytes / 1024
  )} KB total, ${Math.round(initialJavascriptGzipBytes / 1024)} KB initial gzip.`
);
