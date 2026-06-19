import {
  getPreferredHomeRedirectPath,
  getPreferredLocale,
  getStoredLocalePreference,
  rememberLocalePreference,
} from './i18n';

describe('i18n preferences', () => {
  it('chooses the first supported device language', () => {
    expect(getPreferredLocale(['fr-CA', 'es-MX', 'en-US'])).toBe('es');
    expect(getPreferredLocale(['en-US', 'es-MX'])).toBe('en');
    expect(getPreferredLocale(['fr-CA'])).toBe('en');
  });

  it('redirects only the root path to the localized home page', () => {
    expect(getPreferredHomeRedirectPath('/', '?source=qr', '#welcome', 'es')).toBe(
      '/es?source=qr#welcome'
    );
    expect(getPreferredHomeRedirectPath('/', '', '', 'en')).toBeNull();
    expect(getPreferredHomeRedirectPath('/visit', '', '', 'es')).toBeNull();
  });

  it('stores explicit language choices when storage is available', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };

    rememberLocalePreference('es', storage);

    expect(getStoredLocalePreference(storage)).toBe('es');
  });
});
