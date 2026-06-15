import { useEffect, useState } from 'react';
import { Button, Group, Paper, Text, Title } from '@mantine/core';
import { getContent } from '../../content/localizedContent';
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

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
  }, []);

  const status =
    consent === 'granted'
      ? content.privacy.currentAccepted
      : consent === 'denied'
        ? content.privacy.currentDeclined
        : content.privacy.currentUnset;

  return (
    <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
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
    </Paper>
  );
}
