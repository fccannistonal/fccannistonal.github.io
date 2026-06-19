import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';

export function AnalyticsRouteTracker() {
  const location = useLocation();
  const locale = useLocale();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`, locale);
  }, [locale, location.pathname, location.search]);

  return null;
}
