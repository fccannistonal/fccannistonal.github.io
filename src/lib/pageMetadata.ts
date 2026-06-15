const SITE_NAME = 'First Christian Church Anniston';
const PAGE_TITLES: Record<string, string> = {
  '/': SITE_NAME,
  '/community': `Community | ${SITE_NAME}`,
  '/contact': `Contact | ${SITE_NAME}`,
  '/staff': `Staff | ${SITE_NAME}`,
};

export function getPageTitle(pathname: string) {
  return PAGE_TITLES[pathname] ?? `Page Not Found | ${SITE_NAME}`;
}
