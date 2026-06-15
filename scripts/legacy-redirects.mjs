export const legacyRedirects = [
  {
    sourcePath: '/outreach',
    destinationPath: '/community/service-and-outreach',
    locale: 'en',
    title: 'Service and Outreach',
  },
  {
    sourcePath: '/diversity-theater',
    destinationPath: '/community/diversity-theater',
    locale: 'en',
    title: 'Diversity Theater Company',
  },
  {
    sourcePath: '/es/outreach',
    destinationPath: '/es/comunidad/servicio-comunitario',
    locale: 'es',
    title: 'Servicio comunitario',
  },
  {
    sourcePath: '/es/teatro-diversidad',
    destinationPath: '/es/comunidad/teatro-diversidad',
    locale: 'es',
    title: 'Compañía de Teatro Diversidad',
  },
];

const normalizePath = (pathname) => {
  if (pathname === '/') {
    return pathname;
  }

  return pathname.replace(/\/+$/, '') || '/';
};

export function findLegacyRedirect(pathname) {
  const normalizedPath = normalizePath(pathname);
  return legacyRedirects.find((redirect) => redirect.sourcePath === normalizedPath);
}
