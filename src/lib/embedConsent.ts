export const EMBED_CONSENT_KEY = 'fccanniston.embed-consent.v1';
export const EMBED_CONSENT_EVENT = 'fccanniston:embed-consent';
export const EMBED_PROVIDER_IDS = ['google-maps', 'spotify', 'facebook'] as const;

export type EmbedProviderId = (typeof EMBED_PROVIDER_IDS)[number];

export type EmbedConsentChange = {
  providerId?: EmbedProviderId;
  enabled: boolean;
  enabledProviders: EmbedProviderId[];
};

const providerIds = new Set<string>(EMBED_PROVIDER_IDS);

function isEmbedProviderId(value: unknown): value is EmbedProviderId {
  return typeof value === 'string' && providerIds.has(value);
}

function uniqueProviders(values: unknown[]): EmbedProviderId[] {
  return [...new Set(values.filter(isEmbedProviderId))];
}

function readStoredProviders(): EmbedProviderId[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(EMBED_CONSENT_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? uniqueProviders(parsedValue) : [];
  } catch {
    return [];
  }
}

function writeStoredProviders(enabledProviders: EmbedProviderId[]) {
  try {
    window.localStorage.setItem(EMBED_CONSENT_KEY, JSON.stringify(enabledProviders));
  } catch {
    // The current page still respects the choice through the dispatched event.
  }
}

function dispatchEmbedConsentChange(change: EmbedConsentChange) {
  window.dispatchEvent(new CustomEvent(EMBED_CONSENT_EVENT, { detail: change }));
}

export function getEnabledEmbedProviders(): EmbedProviderId[] {
  return readStoredProviders();
}

export function getEmbedConsent(providerId: EmbedProviderId): boolean {
  return readStoredProviders().includes(providerId);
}

export function setEmbedConsent(providerId: EmbedProviderId) {
  const enabledProviders = uniqueProviders([...readStoredProviders(), providerId]);

  writeStoredProviders(enabledProviders);
  dispatchEmbedConsentChange({ providerId, enabled: true, enabledProviders });
}

export function clearEmbedConsent(providerId?: EmbedProviderId) {
  const enabledProviders = providerId
    ? readStoredProviders().filter((enabledProvider) => enabledProvider !== providerId)
    : [];

  writeStoredProviders(enabledProviders);
  dispatchEmbedConsentChange({ providerId, enabled: false, enabledProviders });
}
