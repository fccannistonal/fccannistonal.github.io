import type { Locale } from './routing';

const GOOGLE_ANALYTICS_ID = 'G-FNLZREG4BR';
const GOOGLE_TAG_SCRIPT_ID = 'google-analytics-tag';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
export const ANALYTICS_CONSENT_KEY = 'fccanniston.analytics-consent.v1';
export const ANALYTICS_CONSENT_EVENT = 'fccanniston:analytics-consent';

export type AnalyticsConsent = 'granted' | 'denied';
type AnalyticsParameters = Record<string, string | number | boolean>;
type GtagArguments = [command: string, ...args: unknown[]];
type AnalyticsWindow = Window &
  typeof globalThis & {
    dataLayer?: GtagArguments[];
    gtag?: (...args: GtagArguments) => void;
  };

let isInitialized = false;

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return storedValue === 'granted' || storedValue === 'denied' ? storedValue : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  } catch {
    // The current page still respects the choice when storage is unavailable.
  }

  if (value === 'denied' && typeof window !== 'undefined') {
    (window as AnalyticsWindow).gtag?.('consent', 'update', {
      analytics_storage: 'denied',
    });
  }

  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}

function isAnalyticsEnvironmentAvailable() {
  return (
    import.meta.env.PROD &&
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    !LOCAL_HOSTNAMES.has(window.location.hostname)
  );
}

function isAnalyticsEnabled() {
  return isAnalyticsEnvironmentAvailable() && getAnalyticsConsent() === 'granted';
}

export function initializeGoogleAnalytics() {
  if (!isAnalyticsEnabled() || isInitialized) {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.gtag =
    analyticsWindow.gtag ??
    ((...args: GtagArguments) => {
      analyticsWindow.dataLayer?.push(args);
    });

  if (!document.getElementById(GOOGLE_TAG_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GOOGLE_TAG_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);
  }

  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('consent', 'default', {
    analytics_storage: 'granted',
  });
  analyticsWindow.gtag('config', GOOGLE_ANALYTICS_ID, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    send_page_view: false,
  });

  isInitialized = true;
}

export function trackEvent(eventName: string, parameters: AnalyticsParameters = {}) {
  if (!isAnalyticsEnabled()) {
    return;
  }

  initializeGoogleAnalytics();
  (window as AnalyticsWindow).gtag?.('event', eventName, parameters);
}

export function trackPageView(path: string, locale: Locale) {
  trackEvent('page_view', {
    page_location: new URL(path, window.location.origin).toString(),
    page_path: path,
    language: locale,
  });
}

export function trackVisitPlanningIntent(source: string, locale: Locale) {
  trackEvent('select_content', {
    content_id: source,
    content_type: 'plan_visit',
    language: locale,
  });
}

export function trackContactFormSubmission(locale?: Locale) {
  trackEvent('generate_lead', {
    lead_source: 'contact_form',
    ...(locale ? { language: locale } : {}),
  });
}

export function trackContactIntent(contactMethod: string, locale?: Locale) {
  trackEvent('select_content', {
    content_id: contactMethod.toLowerCase(),
    content_type: 'contact_method',
    ...(locale ? { language: locale } : {}),
  });
}

export function trackGivingIntent(locale?: Locale) {
  trackEvent('select_content', {
    content_id: 'tithely',
    content_type: 'giving',
    ...(locale ? { language: locale } : {}),
  });
}
