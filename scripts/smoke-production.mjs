#!/usr/bin/env node
import routeManifest from '../src/content/routeManifest.json' with { type: 'json' };
import { legacyRedirects } from './legacy-redirects.mjs';

const baseUrl = (process.env.SMOKE_BASE_URL ?? routeManifest.siteUrl).replace(/\/+$/, '');
const errors = [];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const fetchHtml = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' });
  const html = await response.text();

  return { response, html };
};

const fetchExpectedHtml = async (path, expectedFragment) => {
  const result = await fetchHtml(path);

  if (path !== '/' && !path.endsWith('/') && !result.html.includes(expectedFragment)) {
    const slashResult = await fetchHtml(`${path}/`);
    if (slashResult.html.includes(expectedFragment)) {
      return slashResult;
    }
  }

  return result;
};

const includes = (html, expected) => html.includes(expected);

for (const route of routeManifest.routes) {
  const { response, html } = await fetchExpectedHtml(route.path, `<title>${route.title}</title>`);
  const canonicalUrl = new URL(route.path, routeManifest.siteUrl).toString();
  const socialImageUrl = new URL(
    route.socialImage ?? routeManifest.socialImage,
    routeManifest.siteUrl
  ).toString();

  if (!response.ok) {
    errors.push(`${route.path}: expected 2xx response, received ${response.status}`);
    continue;
  }

  const routeChecks = [
    [`<html lang="${route.locale}"`, 'localized html lang'],
    [`<title>${route.title}</title>`, 'route title'],
    [`<link rel="canonical" href="${canonicalUrl}"`, 'canonical URL'],
    [`<meta property="og:image" content="${socialImageUrl}"`, 'social image'],
    [`hreflang="en"`, 'English alternate'],
    [`hreflang="es"`, 'Spanish alternate'],
  ];

  routeChecks.forEach(([fragment, label]) => {
    if (!includes(html, fragment)) {
      errors.push(`${route.path}: missing ${label}`);
    }
  });

  if (!new RegExp(`<title>${escapeRegExp(route.title)}</title>`).test(html)) {
    errors.push(`${route.path}: title did not match manifest exactly`);
  }

  if (route.faq && !html.includes('"@type":"FAQPage"')) {
    errors.push(`${route.path}: missing FAQ structured data`);
  }
}

for (const redirect of legacyRedirects) {
  const canonicalUrl = new URL(redirect.destinationPath, routeManifest.siteUrl).toString();
  const { response, html } = await fetchExpectedHtml(
    redirect.sourcePath,
    `<link rel="canonical" href="${canonicalUrl}"`
  );

  if (!response.ok) {
    errors.push(
      `${redirect.sourcePath}: expected redirect page 2xx response, received ${response.status}`
    );
    continue;
  }

  const redirectChecks = [
    [`<html lang="${redirect.locale}"`, 'localized redirect shell'],
    [`<link rel="canonical" href="${canonicalUrl}"`, 'canonical destination'],
    [`href="${redirect.destinationPath}"`, 'destination fallback link'],
    [`window.location.replace(destination)`, 'JavaScript redirect'],
  ];

  redirectChecks.forEach(([fragment, label]) => {
    if (!includes(html, fragment)) {
      errors.push(`${redirect.sourcePath}: missing ${label}`);
    }
  });
}

if (errors.length > 0) {
  throw new Error(`Production smoke test failed:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Production smoke test passed for ${routeManifest.routes.length} routes and ${legacyRedirects.length} legacy redirects at ${baseUrl}.`
);
