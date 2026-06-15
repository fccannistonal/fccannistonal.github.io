import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { restoreRedirectPath } from './lib/githubPages';
import { updatePageMetadata } from './lib/pageMetadata';

restoreRedirectPath();
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
