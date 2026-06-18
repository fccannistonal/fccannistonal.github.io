import routeManifestData from '../content/routeManifest.json';

export type Locale = 'en' | 'es';
export type RouteId =
  | 'home'
  | 'visit'
  | 'about'
  | 'membership'
  | 'recommendedReading'
  | 'staff'
  | 'community'
  | 'worshipAndMusic'
  | 'wonderAndWorship'
  | 'hispanicMinistry'
  | 'serviceAndOutreach'
  | 'diversityTheater'
  | 'updates'
  | 'contact'
  | 'privacy';

export type LocalizedRoute = {
  id: RouteId;
  locale: Locale;
  path: string;
  alternatePath: string;
  title: string;
  description: string;
  socialImage?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
};

type RouteManifest = {
  siteUrl: string;
  siteName: string;
  socialImage: string;
  routes: LocalizedRoute[];
};

export const routeManifest = routeManifestData as RouteManifest;
export const localizedRoutes = routeManifest.routes;

const normalizePath = (pathname: string) => {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '') || '/';
};

export function getRouteInfo(pathname: string) {
  const normalizedPath = normalizePath(pathname);
  return localizedRoutes.find((route) => route.path === normalizedPath);
}

export function getLocaleFromPath(pathname: string): Locale {
  return (
    getRouteInfo(pathname)?.locale ?? (normalizePath(pathname).startsWith('/es') ? 'es' : 'en')
  );
}

export function getLocalizedPath(id: RouteId, locale: Locale) {
  return localizedRoutes.find((route) => route.id === id && route.locale === locale)?.path ?? '/';
}

export function getAlternateLocalePath(pathname: string) {
  const route = getRouteInfo(pathname);

  if (route) {
    return route.alternatePath;
  }

  return getLocaleFromPath(pathname) === 'en' ? '/es' : '/';
}

export function getCanonicalUrl(pathname: string) {
  const route = getRouteInfo(pathname) ?? localizedRoutes[0];
  return new URL(route.path, routeManifest.siteUrl).toString();
}
