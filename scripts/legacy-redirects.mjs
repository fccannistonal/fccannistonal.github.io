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
    sourcePath: '/community/worship-and-music',
    destinationPath: '/community/sunday-worship',
    locale: 'en',
    title: 'Sunday Worship',
  },
  {
    sourcePath: '/community/wonder-and-worship',
    destinationPath: '/community/childrens-ministry',
    locale: 'en',
    title: 'Children’s Ministry',
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
  {
    sourcePath: '/es/comunidad/adoracion-y-musica',
    destinationPath: '/es/comunidad/adoracion-dominical',
    locale: 'es',
    title: 'Adoración dominical',
  },
  {
    sourcePath: '/es/comunidad/wonder-and-worship',
    destinationPath: '/es/comunidad/ministerio-infantil',
    locale: 'es',
    title: 'Ministerio infantil',
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
