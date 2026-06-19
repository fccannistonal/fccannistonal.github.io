import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { restoreRedirectPath } from './lib/githubPages';
import { getBrowserPreferredLocale, getPreferredHomeRedirectPath } from './lib/i18n';
import { updatePageMetadata } from './lib/pageMetadata';

restoreRedirectPath();
const preferredHomeRedirectPath = getPreferredHomeRedirectPath(
  window.location.pathname,
  window.location.search,
  window.location.hash,
  getBrowserPreferredLocale()
);

if (preferredHomeRedirectPath) {
  window.location.replace(preferredHomeRedirectPath);
} else {
  updatePageMetadata(window.location.pathname);

  const root = document.getElementById('root')!;

  if (root.hasChildNodes()) {
    let isHydrated = false;
    const hydrate = () => {
      if (isHydrated) {
        return;
      }

      isHydrated = true;
      window.clearTimeout(timeout);
      window.removeEventListener('pointerdown', hydrate);
      window.removeEventListener('keydown', hydrate);
      hydrateRoot(root, <App />);
    };
    const timeout = window.setTimeout(hydrate, 2500);

    window.addEventListener('pointerdown', hydrate, { capture: true, once: true });
    window.addEventListener('keydown', hydrate, { capture: true, once: true });
  } else {
    createRoot(root).render(<App />);
  }
}
