import { useEffect, useState } from 'react';
import { Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { getContent } from '../../content/localizedContent';
import {
  clearEmbedConsent,
  EMBED_CONSENT_EVENT,
  EMBED_PROVIDER_IDS,
  getEnabledEmbedProviders,
  type EmbedConsentChange,
  type EmbedProviderId,
} from '../../lib/embedConsent';
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  setAnalyticsConsent,
  type AnalyticsConsent,
} from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';

export function PrivacyPreferences() {
  const locale = useLocale();
  const content = getContent(locale);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());
  const [enabledEmbedProviders, setEnabledEmbedProviders] = useState<EmbedProviderId[]>(() =>
    getEnabledEmbedProviders()
  );

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    const handleEmbedConsentChange = (event: Event) => {
      setEnabledEmbedProviders((event as CustomEvent<EmbedConsentChange>).detail.enabledProviders);
    };

    window.addEventListener(EMBED_CONSENT_EVENT, handleEmbedConsentChange);
    return () => window.removeEventListener(EMBED_CONSENT_EVENT, handleEmbedConsentChange);
  }, []);

  const status =
    consent === 'granted'
      ? content.privacy.currentAccepted
      : consent === 'denied'
        ? content.privacy.currentDeclined
        : content.privacy.currentUnset;
  const savedEmbedProviders = EMBED_PROVIDER_IDS.filter((providerId) =>
    enabledEmbedProviders.includes(providerId)
  );

  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
      <Stack gap="xl">
        <div>
          <Title order={2}>{content.privacy.preferencesTitle}</Title>
          <Text c="dimmed" mt="sm">
            {content.privacy.preferencesCopy}
          </Text>
          <Text mt="md" fw={700} role="status">
            {status}
          </Text>
          <Group mt="lg">
            <Button type="button" onClick={() => setAnalyticsConsent('granted')}>
              {content.privacy.acceptAnalytics}
            </Button>
            <Button type="button" variant="default" onClick={() => setAnalyticsConsent('denied')}>
              {content.privacy.declineAnalytics}
            </Button>
          </Group>
        </div>

        <Divider />

        <div>
          <Title order={2}>{content.privacy.embedPreferencesTitle}</Title>
          <Text c="dimmed" mt="sm">
            {content.privacy.embedPreferencesCopy}
          </Text>

          {savedEmbedProviders.length > 0 ? (
            <Stack gap="sm" mt="lg">
              {savedEmbedProviders.map((providerId) => (
                <Group key={providerId} justify="space-between" gap="md">
                  <Text fw={700}>{content.privacy.embedProviderLabels[providerId]}</Text>
                  <Button
                    type="button"
                    variant="default"
                    size="xs"
                    onClick={() => clearEmbedConsent(providerId)}
                  >
                    {content.privacy.clearEmbedPreference}
                  </Button>
                </Group>
              ))}
              <Group>
                <Button
                  type="button"
                  variant="subtle"
                  color="dark"
                  onClick={() => clearEmbedConsent()}
                >
                  {content.privacy.clearAllEmbedPreferences}
                </Button>
              </Group>
            </Stack>
          ) : (
            <Text mt="md" fw={700}>
              {content.privacy.noEmbedPreferences}
            </Text>
          )}
        </div>
      </Stack>
    </Paper>
  );
}
