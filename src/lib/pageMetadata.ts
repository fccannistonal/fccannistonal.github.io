import {
  getCanonicalUrl,
  getLocaleFromPath,
  getRouteInfo,
  localizedRoutes,
  routeManifest,
} from './routing';

const defaultRobots = 'index, follow, max-image-preview:large';

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

export function getPageTitle(pathname: string) {
  const route = getRouteInfo(pathname);

  if (route) {
    return route.title;
  }

  return getLocaleFromPath(pathname) === 'es'
    ? `Página no encontrada | ${routeManifest.siteName}`
    : `Page Not Found | ${routeManifest.siteName}`;
}

export function updatePageMetadata(pathname: string) {
  const route = getRouteInfo(pathname);
  const locale = route?.locale ?? getLocaleFromPath(pathname);
  const fallbackRoute =
    localizedRoutes.find((candidate) => candidate.id === 'home' && candidate.locale === locale) ??
    localizedRoutes[0];
  const metadata = route ?? fallbackRoute;
  const canonicalUrl = getCanonicalUrl(metadata.path);
  const socialImageUrl = new URL(
    metadata.socialImage ?? routeManifest.socialImage,
    routeManifest.siteUrl
  ).toString();
  const socialImageAlt = metadata.socialImageAlt ?? routeManifest.socialImageAlt;
  const robots = route?.robots ?? (route ? defaultRobots : 'noindex, follow');

  document.title = route ? metadata.title : getPageTitle(pathname);
  document.documentElement.lang = locale;

  upsertMeta('meta[name="description"]', {
    name: 'description',
    content: metadata.description,
  });
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: robots,
  });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: metadata.description,
  });
  upsertMeta('meta[property="og:site_name"]', {
    property: 'og:site_name',
    content: routeManifest.siteName,
  });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImageUrl });
  upsertMeta('meta[property="og:image:width"]', {
    property: 'og:image:width',
    content: String(routeManifest.socialImageWidth),
  });
  upsertMeta('meta[property="og:image:height"]', {
    property: 'og:image:height',
    content: String(routeManifest.socialImageHeight),
  });
  upsertMeta('meta[property="og:image:alt"]', {
    property: 'og:image:alt',
    content: socialImageAlt,
  });
  upsertMeta('meta[property="og:locale"]', {
    property: 'og:locale',
    content: locale === 'es' ? 'es_US' : 'en_US',
  });
  upsertMeta('meta[property="og:locale:alternate"]', {
    property: 'og:locale:alternate',
    content: locale === 'es' ? 'en_US' : 'es_US',
  });
  upsertMeta('meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: 'summary_large_image',
  });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: document.title });
  upsertMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: metadata.description,
  });
  upsertMeta('meta[name="twitter:image"]', {
    name: 'twitter:image',
    content: socialImageUrl,
  });
  upsertMeta('meta[name="twitter:image:alt"]', {
    name: 'twitter:image:alt',
    content: socialImageAlt,
  });
  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });
  upsertLink('link[rel="alternate"][hreflang="en"]', {
    rel: 'alternate',
    hreflang: 'en',
    href: new URL(
      locale === 'en' ? metadata.path : metadata.alternatePath,
      routeManifest.siteUrl
    ).toString(),
  });
  upsertLink('link[rel="alternate"][hreflang="es"]', {
    rel: 'alternate',
    hreflang: 'es',
    href: new URL(
      locale === 'es' ? metadata.path : metadata.alternatePath,
      routeManifest.siteUrl
    ).toString(),
  });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', {
    rel: 'alternate',
    hreflang: 'x-default',
    href: new URL(
      locale === 'en' ? metadata.path : metadata.alternatePath,
      routeManifest.siteUrl
    ).toString(),
  });
}
