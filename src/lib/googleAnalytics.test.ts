// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://fccanniston.com/"}

type GoogleAnalyticsModule = typeof import('./googleAnalytics');

async function loadGoogleAnalytics() {
  vi.resetModules();
  return import('./googleAnalytics') as Promise<GoogleAnalyticsModule>;
}

function getQueuedCommands() {
  return ((window as typeof window & { dataLayer?: IArguments[] }).dataLayer ?? []).map((entry) =>
    Array.from(entry)
  );
}

describe('analytics consent', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    window.localStorage.clear();
    document.getElementById('google-analytics-tag')?.remove();
    delete (window as typeof window & { dataLayer?: unknown }).dataLayer;
    delete (window as typeof window & { gtag?: unknown }).gtag;
  });

  it('starts unset and persists explicit choices', async () => {
    const { ANALYTICS_CONSENT_KEY, getAnalyticsConsent, setAnalyticsConsent } =
      await loadGoogleAnalytics();

    expect(getAnalyticsConsent()).toBeNull();
    setAnalyticsConsent('granted');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('granted');
    expect(getAnalyticsConsent()).toBe('granted');
  });

  it('announces consent changes to mounted UI', async () => {
    const { ANALYTICS_CONSENT_EVENT, setAnalyticsConsent } = await loadGoogleAnalytics();
    const listener = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);

    setAnalyticsConsent('denied');

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  });

  it('revokes all Google consent fields when an initialized tag is present', async () => {
    const { setAnalyticsConsent } = await loadGoogleAnalytics();
    const gtag = vi.fn();
    Object.assign(window, { gtag });

    setAnalyticsConsent('denied');

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('does not create a script or queue events without granted consent', async () => {
    vi.stubEnv('PROD', true);
    const { initializeGoogleAnalytics, trackEvent } = await loadGoogleAnalytics();

    initializeGoogleAnalytics();
    trackEvent('page_view', { page_path: '/' });

    expect(document.getElementById('google-analytics-tag')).not.toBeInTheDocument();
    expect((window as typeof window & { dataLayer?: unknown }).dataLayer).toBeUndefined();
  });

  it('creates the tag and queues consent before config when consent is granted', async () => {
    vi.stubEnv('PROD', true);
    const { ANALYTICS_CONSENT_KEY, initializeGoogleAnalytics } = await loadGoogleAnalytics();
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');

    initializeGoogleAnalytics();

    const script = document.getElementById('google-analytics-tag') as HTMLScriptElement | null;
    expect(script).toBeInTheDocument();
    expect(script?.async).toBe(true);
    expect(script?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-FNLZREG4BR');
    expect(getQueuedCommands()).toEqual([
      [
        'consent',
        'default',
        {
          ad_personalization: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          analytics_storage: 'granted',
        },
      ],
      ['js', expect.any(Date)],
      [
        'config',
        'G-FNLZREG4BR',
        {
          allow_ad_personalization_signals: false,
          allow_google_signals: false,
          send_page_view: false,
        },
      ],
    ]);
  });

  it('uses the Google tag arguments queue format instead of a rest-parameter array', async () => {
    vi.stubEnv('PROD', true);
    const { ANALYTICS_CONSENT_KEY, initializeGoogleAnalytics } = await loadGoogleAnalytics();
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'granted');

    initializeGoogleAnalytics();

    const [firstCommand] = (window as typeof window & { dataLayer?: IArguments[] }).dataLayer ?? [];
    expect(firstCommand).toBeDefined();
    expect(Array.isArray(firstCommand)).toBe(false);
    expect(Object.prototype.toString.call(firstCommand)).toBe('[object Arguments]');
  });
});
