const GOOGLE_ANALYTICS_ID = 'G-FNLZREG4BR';
const GOOGLE_TAG_SCRIPT_ID = 'google-analytics-tag';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

type AnalyticsParameters = Record<string, string | number | boolean>;
type GtagArguments = [command: string, ...args: unknown[]];
type AnalyticsWindow = Window &
  typeof globalThis & {
    dataLayer?: GtagArguments[];
    gtag?: (...args: GtagArguments) => void;
  };

let isInitialized = false;

function isAnalyticsEnabled() {
  return (
    import.meta.env.PROD &&
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    !LOCAL_HOSTNAMES.has(window.location.hostname)
  );
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
  analyticsWindow.gtag('config', GOOGLE_ANALYTICS_ID, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
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

export function trackContactFormSubmission() {
  trackEvent('generate_lead', {
    lead_source: 'contact_form',
  });
}

export function trackContactIntent(contactMethod: string) {
  trackEvent('select_content', {
    content_id: contactMethod.toLowerCase(),
    content_type: 'contact_method',
  });
}

export function trackGivingIntent() {
  trackEvent('select_content', {
    content_id: 'tithely',
    content_type: 'giving',
  });
}
