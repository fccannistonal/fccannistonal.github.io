#!/usr/bin/env node
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createPostRoutes, readPublishedPosts } from './post-content.mjs';

const rootDir = resolve(import.meta.dirname, '..');
const outDir = process.env.BUILD_OUT_DIR ?? 'dist';
const outputDir = resolve(rootDir, outDir);
const indexPath = resolve(outputDir, 'index.html');
const manifestPath = resolve(rootDir, 'src', 'content', 'routeManifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const publishedPosts = await readPublishedPosts(rootDir);
const generatedPostRoutes = createPostRoutes(publishedPosts, manifest);
const localizedRoutes = [...manifest.routes, ...generatedPostRoutes];
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
  post: 'src/pages/Post.page.tsx',
  members: 'src/pages/Members.page.tsx',
  memberProfile: 'src/pages/Members.page.tsx',
  memberDirectory: 'src/pages/Members.page.tsx',
  memberGroups: 'src/pages/Members.page.tsx',
  memberCalendar: 'src/pages/Members.page.tsx',
  memberUpdates: 'src/pages/Members.page.tsx',
  memberAdmin: 'src/pages/Members.page.tsx',
  memberGivingStatements: 'src/pages/Members.page.tsx',
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
const defaultRobots = 'index, follow, max-image-preview:large';
const churchId = absoluteUrl('/#church');
const websiteId = absoluteUrl('/#website');

const routeSchemaTypeById = {
  about: 'AboutPage',
  contact: 'ContactPage',
  community: 'CollectionPage',
  memberDirectory: 'CollectionPage',
  recommendedReading: 'CollectionPage',
  staff: 'CollectionPage',
  updates: 'CollectionPage',
};

const isIndexableRoute = (route) => !(route.robots ?? defaultRobots).includes('noindex');

const serializeStructuredData = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const getRouteSocialImage = (route) => absoluteUrl(route.socialImage ?? manifest.socialImage);
const getRouteSocialImageAlt = (route) => route.socialImageAlt ?? manifest.socialImageAlt;

const getRouteSchemaTypes = (route) => {
  const schemaType = routeSchemaTypeById[route.id];
  return schemaType ? ['WebPage', schemaType] : 'WebPage';
};

const getRouteById = (id, locale) =>
  localizedRoutes.find((route) => route.id === id && route.locale === locale);

const getBreadcrumbName = (route) => {
  if (route.id === 'home') {
    return route.locale === 'es' ? 'Inicio' : 'Home';
  }

  return route.title.replace(/\s+\|\s+.*$/, '');
};

const createBreadcrumbRoutes = (route) => {
  const homeRoute = getRouteById('home', route.locale);
  const routes = homeRoute ? [homeRoute] : [];

  if (route.id !== 'home') {
    if (route.id === 'membership' || route.id === 'recommendedReading') {
      const aboutRoute = getRouteById('about', route.locale);
      if (aboutRoute) {
        routes.push(aboutRoute);
      }
    }

    if (route.id === 'post') {
      const updatesRoute = getRouteById('updates', route.locale);
      if (updatesRoute) {
        routes.push(updatesRoute);
      }
    }

    if (['memberProfile', 'memberDirectory', 'memberGroups', 'memberCalendar', 'memberUpdates', 'memberAdmin', 'memberGivingStatements'].includes(route.id)) {
      const membersRoute = getRouteById('members', route.locale);
      if (membersRoute) {
        routes.push(membersRoute);
      }
    }

    if (
      [
        'worshipAndMusic',
        'wonderAndWorship',
        'hispanicMinistry',
        'serviceAndOutreach',
        'diversityTheater',
      ].includes(route.id)
    ) {
      const communityRoute = getRouteById('community', route.locale);
      if (communityRoute) {
        routes.push(communityRoute);
      }
    }

    routes.push(route);
  }

  return routes;
};

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
  '@type': 'Church',
  '@id': churchId,
  name: 'First Christian Church Anniston',
  alternateName: 'FCC Anniston',
  description:
    'An open and affirming Christian Church (Disciples of Christ) congregation serving Anniston, Alabama.',
  url: manifest.siteUrl,
  image: absoluteUrl(manifest.socialImage),
  logo: {
    '@type': 'ImageObject',
    '@id': absoluteUrl('/images/brand/fcc-logo.png#logo'),
    url: absoluteUrl('/images/brand/fcc-logo.png'),
    width: 364,
    height: 486,
  },
  telephone: '+1-256-236-1316',
  email: 'fccannistonal@gmail.com',
  hasMap:
    'https://www.google.com/maps/dir/?api=1&destination=1327+Leighton+Ave%2C+Anniston%2C+AL+36207',
  areaServed: [
    { '@type': 'City', name: 'Anniston' },
    { '@type': 'AdministrativeArea', name: 'Calhoun County' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1327 Leighton Ave.',
    addressLocality: 'Anniston',
    addressRegion: 'AL',
    postalCode: '36207',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'general inquiries',
    telephone: '+1-256-236-1316',
    email: 'fccannistonal@gmail.com',
    areaServed: 'Anniston, AL',
    availableLanguage: ['English', 'Spanish'],
  },
  sameAs: ['https://www.facebook.com/FCCAnniston', 'https://linktr.ee/fccanniston'],
  event: [
    {
      '@type': 'Event',
      '@id': absoluteUrl('/#sunday-school'),
      name: 'Sunday School',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@id': churchId },
      organizer: { '@id': churchId },
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
      '@id': absoluteUrl('/#worship-service'),
      name: 'Worship Service',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@id': churchId },
      organizer: { '@id': churchId },
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

const websiteStructuredData = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: manifest.siteUrl,
  name: manifest.siteName,
  alternateName: 'FCC Anniston',
  inLanguage: ['en', 'es'],
  publisher: { '@id': churchId },
};

function createStructuredData(route) {
  const canonicalUrl = absoluteUrl(route.path);
  const imageUrl = getRouteSocialImage(route);
  const imageId = `${imageUrl}#primaryimage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const pageId = `${canonicalUrl}#webpage`;
  const webPage = {
    '@type': getRouteSchemaTypes(route),
    '@id': pageId,
    url: canonicalUrl,
    name: route.title,
    description: route.description,
    inLanguage: route.locale,
    isPartOf: { '@id': websiteId },
    about: { '@id': churchId },
    publisher: { '@id': churchId },
    primaryImageOfPage: { '@id': imageId },
    breadcrumb: { '@id': breadcrumbId },
    isAccessibleForFree: true,
  };
  const graph = [
    churchStructuredData,
    websiteStructuredData,
    {
      '@type': 'ImageObject',
      '@id': imageId,
      url: imageUrl,
      contentUrl: imageUrl,
      width: manifest.socialImageWidth,
      height: manifest.socialImageHeight,
      caption: getRouteSocialImageAlt(route),
      representativeOfPage: true,
    },
    webPage,
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: createBreadcrumbRoutes(route).map((breadcrumbRoute, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: getBreadcrumbName(breadcrumbRoute),
        item: absoluteUrl(breadcrumbRoute.path),
      })),
    },
  ];

  if (route.id === 'post' && route.post) {
    const articleId = `${canonicalUrl}#blogposting`;
    webPage.mainEntity = { '@id': articleId };
    graph.push({
      '@type': 'BlogPosting',
      '@id': articleId,
      headline: route.post.title,
      description: route.post.description,
      datePublished: route.post.publishedAt,
      dateModified: route.post.publishedAt,
      author: {
        '@type': 'Organization',
        name: route.post.author,
      },
      publisher: { '@id': churchId },
      mainEntityOfPage: { '@id': pageId },
      image: { '@id': imageId },
      inLanguage: route.locale,
      keywords: route.post.tags,
      isAccessibleForFree: true,
    });
  }

  if (route.faq) {
    const faqId = `${canonicalUrl}#faq`;
    webPage.mainEntity = { '@id': faqId };
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
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

  return `<script type="application/ld+json">${serializeStructuredData({
    '@context': 'https://schema.org',
    '@graph': graph,
  })}</script>`;
}

function createMeta(route) {
  const canonicalUrl = absoluteUrl(route.path);
  const englishPath = route.locale === 'en' ? route.path : route.alternatePath;
  const spanishPath = route.locale === 'es' ? route.path : route.alternatePath;
  const socialImage = getRouteSocialImage(route);
  const socialImageAlt = getRouteSocialImageAlt(route);
  const robots = route.robots ?? defaultRobots;
  const ogType = route.id === 'post' ? 'article' : 'website';

  return `<!-- ROUTE_META_START -->
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="${escapeHtml(robots)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${absoluteUrl(englishPath)}" />
    <link rel="alternate" hreflang="es" href="${absoluteUrl(spanishPath)}" />
    <link rel="alternate" hreflang="x-default" href="${absoluteUrl(englishPath)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="${escapeHtml(manifest.siteName)}" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${socialImage}" />
    <meta property="og:image:width" content="${manifest.socialImageWidth}" />
    <meta property="og:image:height" content="${manifest.socialImageHeight}" />
    <meta property="og:image:alt" content="${escapeHtml(socialImageAlt)}" />
    <meta property="og:locale" content="${route.locale === 'es' ? 'es_US' : 'en_US'}" />
    <meta property="og:locale:alternate" content="${route.locale === 'es' ? 'en_US' : 'es_US'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(socialImageAlt)}" />
    ${createStructuredData(route)}
    <!-- ROUTE_META_END -->`;
}

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

function createRssFeed(locale) {
  const channelTitle =
    locale === 'es'
      ? 'Novedades de Primera Iglesia Cristiana de Anniston'
      : 'First Christian Church Anniston Updates';
  const channelUrl = absoluteUrl(locale === 'es' ? '/es/novedades' : '/updates');
  const items = publishedPosts
    .filter((post) => post.locale === locale)
    .map(
      (post) => `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(post.path)}</link>
      <guid isPermaLink="true">${absoluteUrl(post.path)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(`${post.publishedAt}T12:00:00-06:00`).toUTCString()}</pubDate>
      <author>${escapeXml(post.author)}</author>
    </item>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelUrl}</link>
    <description>${escapeXml(channelTitle)}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>
`;
}

function createJsonFeed(locale) {
  const title =
    locale === 'es'
      ? 'Novedades de Primera Iglesia Cristiana de Anniston'
      : 'First Christian Church Anniston Updates';
  const feedUrl = absoluteUrl(locale === 'es' ? '/es/feed.json' : '/feed.json');

  return `${JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title,
      home_page_url: absoluteUrl(locale === 'es' ? '/es/novedades' : '/updates'),
      feed_url: feedUrl,
      language: locale,
      items: publishedPosts
        .filter((post) => post.locale === locale)
        .map((post) => ({
          id: absoluteUrl(post.path),
          url: absoluteUrl(post.path),
          title: post.title,
          summary: post.description,
          content_html: post.html,
          date_published: new Date(`${post.publishedAt}T12:00:00-06:00`).toISOString(),
          authors: [{ name: post.author }],
          tags: post.tags,
        })),
    },
    null,
    2
  )}\n`;
}

for (const route of localizedRoutes) {
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

const sitemapEntries = localizedRoutes
  .filter(isIndexableRoute)
  .map((route) => {
    const englishPath = route.locale === 'en' ? route.path : route.alternatePath;
    const spanishPath = route.locale === 'es' ? route.path : route.alternatePath;
    return `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${absoluteUrl(englishPath)}" />
    <xhtml:link rel="alternate" hreflang="es" href="${absoluteUrl(spanishPath)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(englishPath)}" />
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
await writeFile(resolve(outputDir, 'feed.xml'), createRssFeed('en'), 'utf8');
await writeFile(resolve(outputDir, 'feed.json'), createJsonFeed('en'), 'utf8');
await mkdir(resolve(outputDir, 'es'), { recursive: true });
await writeFile(resolve(outputDir, 'es', 'feed.xml'), createRssFeed('es'), 'utf8');
await writeFile(resolve(outputDir, 'es', 'feed.json'), createJsonFeed('es'), 'utf8');
await writeFile(
  resolve(outputDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`,
  'utf8'
);
await rm(resolve(rootDir, '.ssr'), { recursive: true, force: true });

console.log(`Generated static HTML for ${localizedRoutes.length} localized routes.`);
