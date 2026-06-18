import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';

export function AnalyticsRouteTracker() {
  const location = useLocation();
  const locale = useLocale();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (consent === 'granted') {
      trackPageView(`${location.pathname}${location.search}`, locale);
    }
  }, [consent, locale, location.pathname, location.search]);

  return null;
}
