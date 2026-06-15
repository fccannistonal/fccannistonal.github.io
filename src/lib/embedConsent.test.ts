import {
  clearEmbedConsent,
  EMBED_CONSENT_EVENT,
  EMBED_CONSENT_KEY,
  getEmbedConsent,
  getEnabledEmbedProviders,
  setEmbedConsent,
} from './embedConsent';

describe('embed consent', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty and persists provider-specific choices', () => {
    expect(getEnabledEmbedProviders()).toEqual([]);
    expect(getEmbedConsent('google-maps')).toBe(false);

    setEmbedConsent('google-maps');

    expect(window.localStorage.getItem(EMBED_CONSENT_KEY)).toBe('["google-maps"]');
    expect(getEmbedConsent('google-maps')).toBe(true);
    expect(getEmbedConsent('spotify')).toBe(false);
  });

  it('ignores unknown stored providers', () => {
    window.localStorage.setItem(EMBED_CONSENT_KEY, '["google-maps","unknown","spotify"]');

    expect(getEnabledEmbedProviders()).toEqual(['google-maps', 'spotify']);
  });

  it('clears one provider or all providers', () => {
    setEmbedConsent('google-maps');
    setEmbedConsent('spotify');

    clearEmbedConsent('google-maps');
    expect(getEnabledEmbedProviders()).toEqual(['spotify']);

    clearEmbedConsent();
    expect(getEnabledEmbedProviders()).toEqual([]);
  });

  it('announces consent changes to mounted UI', () => {
    const listener = vi.fn();
    window.addEventListener(EMBED_CONSENT_EVENT, listener);

    setEmbedConsent('facebook');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({
      detail: {
        providerId: 'facebook',
        enabled: true,
        enabledProviders: ['facebook'],
      },
    });

    window.removeEventListener(EMBED_CONSENT_EVENT, listener);
  });
});
