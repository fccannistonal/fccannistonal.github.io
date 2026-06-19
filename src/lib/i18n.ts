import { useLocation } from 'react-router-dom';
import { getLocaleFromPath, getLocalizedPath, type Locale } from './routing';

export const LOCALE_PREFERENCE_KEY = 'fccanniston.locale';

function normalizeLocale(language: string | null | undefined): Locale | null {
  const languageCode = language?.trim().toLowerCase().split(/[-_]/)[0];

  if (languageCode === 'en' || languageCode === 'es') {
    return languageCode;
  }

  return null;
}

export function getPreferredLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const locale = normalizeLocale(language);

    if (locale) {
      return locale;
    }
  }

  return 'en';
}

export function getStoredLocalePreference(storage?: Pick<Storage, 'getItem'> | null) {
  const resolvedStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);

  if (!resolvedStorage) {
    return null;
  }

  try {
    return normalizeLocale(resolvedStorage.getItem(LOCALE_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

export function rememberLocalePreference(
  locale: Locale,
  storage?: Pick<Storage, 'setItem'> | null
) {
  const resolvedStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : null);

  try {
    resolvedStorage?.setItem(LOCALE_PREFERENCE_KEY, locale);
  } catch {
    // Ignore storage failures; explicit localized routes still work without persistence.
  }
}

export function getBrowserPreferredLocale(): Locale {
  const storedLocale = getStoredLocalePreference();

  if (storedLocale) {
    return storedLocale;
  }

  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const languages =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  return getPreferredLocale(languages);
}

export function getPreferredHomeRedirectPath(
  pathname: string,
  search = '',
  hash = '',
  locale: Locale = 'en'
) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const targetPath = getLocalizedPath('home', locale);

  if (normalizedPath !== '/' || targetPath === '/') {
    return null;
  }

  return `${targetPath}${search}${hash}`;
}

export function useLocale() {
  const location = useLocation();
  return getLocaleFromPath(location.pathname);
}
