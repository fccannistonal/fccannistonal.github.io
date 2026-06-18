#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = resolve(import.meta.dirname, '..');
const outDir = process.env.BUILD_OUT_DIR ?? 'dist';
const outputDir = resolve(rootDir, outDir);
const indexPath = resolve(outputDir, 'index.html');
const manifestPath = resolve(rootDir, 'src', 'content', 'routeManifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const baseHtml = await readFile(indexPath, 'utf8');
const viteManifest = JSON.parse(
  await readFile(resolve(outputDir, '.vite', 'manifest.json'), 'utf8')
);
const serverEntryPath = resolve(rootDir, '.ssr', 'entry-server.js');
const { render } = await import(pathToFileURL(serverEntryPath).toString());
const routeModuleById = {
  home: 'src/pages/Home.page.tsx',
  visit: 'src/pages/Visit.page.tsx',
  about: 'src/pages/About.page.tsx',
  membership: 'src/pages/Membership.page.tsx',
  recommendedReading: 'src/pages/RecommendedReading.page.tsx',
  staff: 'src/pages/Staff.page.tsx',
  community: 'src/pages/Community.page.tsx',
  worshipAndMusic: 'src/pages/MinistryDetail.page.tsx',
  wonderAndWorship: 'src/pages/MinistryDetail.page.tsx',
  hispanicMinistry: 'src/pages/MinistryDetail.page.tsx',
  serviceAndOutreach: 'src/pages/MinistryDetail.page.tsx',
  diversityTheater: 'src/pages/DiversityTheater.page.tsx',
  updates: 'src/pages/Updates.page.tsx',
  contact: 'src/pages/Contact.page.tsx',
  privacy: 'src/pages/Privacy.page.tsx',
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const absoluteUrl = (path) => new URL(path, manifest.siteUrl).toString();

function collectRouteCss(manifestKey, visited = new Set()) {
  if (manifestKey === 'index.html') {
    return [];
  }

  if (visited.has(manifestKey)) {
    return [];
  }

  visited.add(manifestKey);
  const entry = viteManifest[manifestKey];

  if (!entry) {
    throw new Error(`Vite manifest entry not found: ${manifestKey}`);
  }

  return [
    ...(entry.css ?? []),
    ...(entry.imports ?? []).flatMap((importKey) => collectRouteCss(importKey, visited)),
  ];
}

async function createRouteStyles(routeId) {
  const manifestKey = routeModuleById[routeId];

  if (!manifestKey) {
    throw new Error(`Route module not configured for: ${routeId}`);
  }

  const cssFiles = [...new Set(collectRouteCss(manifestKey))];

  if (cssFiles.length === 0) {
    return `<style data-route-style="${routeId}"></style>`;
  }

  const css = (
    await Promise.all(cssFiles.map((file) => readFile(resolve(outputDir, file), 'utf8')))
  ).join('\n');
  const loadedStyleLinks = cssFiles
    .map((file) => `<link rel="stylesheet" media="print" crossorigin href="/${file}" />`)
    .join('\n');

  return `<style data-route-style="${routeId}">${css}</style>\n${loadedStyleLinks}`;
}

const churchStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'First Christian Church Anniston',
  alternateName: 'FCC Anniston',
  url: manifest.siteUrl,
  image: absoluteUrl(manifest.socialImage),
  telephone: '+1-256-236-1316',
  email: 'fccannistonal@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1327 Leighton Ave.',
    addressLocality: 'Anniston',
    addressRegion: 'AL',
    postalCode: '36207',
    addressCountry: 'US',
  },
  sameAs: ['https://www.facebook.com/FCCAnniston', 'https://linktr.ee/fccanniston'],
  event: [
    {
      '@type': 'Event',
      name: 'Sunday School',
      location: { '@type': 'Place', name: 'First Christian Church Anniston' },
      eventSchedule: {
        '@type': 'Schedule',
        repeatFrequency: 'P1W',
        byDay: 'https://schema.org/Sunday',
        startTime: '10:30',
        scheduleTimezone: 'America/Chicago',
      },
    },
    {
      '@type': 'Event',
      name: 'Worship Service',
      location: { '@type': 'Place', name: 'First Christian Church Anniston' },
      eventSchedule: {
        '@type': 'Schedule',
        repeatFrequency: 'P1W',
        byDay: 'https://schema.org/Sunday',
        startTime: '11:30',
        scheduleTimezone: 'America/Chicago',
      },
    },
  ],
};

const getRouteSocialImage = (route) => absoluteUrl(route.socialImage ?? manifest.socialImage);

function createStructuredData(route) {
  const blocks = [churchStructuredData];

  if (route.faq) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return blocks
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n    ');
}

function createMeta(route) {
  const canonicalUrl = absoluteUrl(route.path);
  const englishPath = route.locale === 'en' ? route.path : route.alternatePath;
  const spanishPath = route.locale === 'es' ? route.path : route.alternatePath;
  const socialImage = getRouteSocialImage(route);

  return `<!-- ROUTE_META_START -->
    <meta name="description" content="${escapeHtml(route.description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${absoluteUrl(englishPath)}" />
    <link rel="alternate" hreflang="es" href="${absoluteUrl(spanishPath)}" />
    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(englishPath)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:locale" content="${route.locale === 'es' ? 'es_US' : 'en_US'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    ${createStructuredData(route)}
    <!-- ROUTE_META_END -->`;
}

for (const route of manifest.routes) {
  const appHtml = await render(route.path);
  const routeStyles = await createRouteStyles(route.id);
  const routeHtml = baseHtml
    .replace(/<html lang="[^"]*"/, `<html lang="${route.locale}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('</head>', `${routeStyles}\n${createMeta(route)}\n  </head>`);
  const routeOutputPath =
    route.path === '/'
      ? indexPath
      : resolve(outputDir, route.path.replace(/^\/|\/$/g, ''), 'index.html');

  await mkdir(dirname(routeOutputPath), { recursive: true });
  await writeFile(routeOutputPath, routeHtml, 'utf8');
}

const sitemapEntries = manifest.routes
  .map((route) => {
    const englishPath = route.locale === 'en' ? route.path : route.alternatePath;
    const spanishPath = route.locale === 'es' ? route.path : route.alternatePath;
    return `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${absoluteUrl(englishPath)}" />
    <xhtml:link rel="alternate" hreflang="es" href="${absoluteUrl(spanishPath)}" />
  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>
`;

await writeFile(resolve(outputDir, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(
  resolve(outputDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`,
  'utf8'
);
await rm(resolve(rootDir, '.ssr'), { recursive: true, force: true });

console.log(`Generated static HTML for ${manifest.routes.length} localized routes.`);
