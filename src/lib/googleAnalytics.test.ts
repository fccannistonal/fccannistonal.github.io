import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from './googleAnalytics';

describe('analytics consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts unset and persists explicit choices', () => {
    expect(getAnalyticsConsent()).toBeNull();
    setAnalyticsConsent('granted');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('granted');
    expect(getAnalyticsConsent()).toBe('granted');
  });

  it('announces consent changes to mounted UI', () => {
    const listener = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, listener);

    setAnalyticsConsent('denied');

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, listener);
  });

  it('revokes analytics storage when an initialized tag is present', () => {
    const gtag = vi.fn();
    Object.assign(window, { gtag });

    setAnalyticsConsent('denied');

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied',
    });
  });
});
