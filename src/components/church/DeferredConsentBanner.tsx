import { lazy, Suspense, useEffect, useState } from 'react';

const ConsentBanner = lazy(() =>
  import('./ConsentBanner').then((module) => ({ default: module.ConsentBanner }))
);

export function DeferredConsentBanner() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 2500);
    return () => window.clearTimeout(timeout);
  }, []);

  return isReady ? (
    <Suspense fallback={null}>
      <ConsentBanner />
    </Suspense>
  ) : null;
}
