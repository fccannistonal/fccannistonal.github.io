const REDIRECT_PATH_KEY = 'fccanniston.redirect-path';

export function restoreRedirectPath() {
  if (typeof window === 'undefined') {
    return;
  }

  let redirectPath: string | null = null;

  try {
    redirectPath = window.sessionStorage.getItem(REDIRECT_PATH_KEY);
  } catch (error) {
    return;
  }

  if (!redirectPath) {
    return;
  }

  try {
    window.sessionStorage.removeItem(REDIRECT_PATH_KEY);
  } catch (error) {
    // Ignore storage failures once the path has already been read.
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (currentPath !== redirectPath) {
    window.history.replaceState(null, '', redirectPath);
  }
}

export function getRedirectPathKey() {
  return REDIRECT_PATH_KEY;
}
