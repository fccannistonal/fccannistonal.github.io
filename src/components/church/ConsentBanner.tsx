import { useEffect, useState } from 'react';
import { IconShieldCheck } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import { getShellContent } from '../../content/localizedShellContent';
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  initializeGoogleAnalytics,
  setAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import { getLocalizedPath } from '../../lib/routing';
import classes from './ConsentBanner.module.css';

export function ConsentBanner() {
  const location = useLocation();
  const locale = useLocale();
  const content = getShellContent(locale);
  const [isMounted, setIsMounted] = useState(false);
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      setConsent((event as CustomEvent<AnalyticsConsent>).detail);
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (consent === 'granted') {
      initializeGoogleAnalytics();
      trackPageView(`${location.pathname}${location.search}`, locale);
    }
  }, [consent, locale, location.pathname, location.search]);

  if (!isMounted || consent) {
    return null;
  }

  return (
    <Paper
      withBorder
      p={{ base: 'md', sm: 'lg' }}
      radius="xl"
      className={classes.banner}
      role="region"
      aria-labelledby="privacy-choice-title"
    >
      <Group align="flex-start" wrap="nowrap">
        <ThemeIcon size={42} radius="xl" variant="light" color="moss">
          <IconShieldCheck size={22} aria-hidden="true" />
        </ThemeIcon>
        <div>
          <Title id="privacy-choice-title" order={2} fz="h3">
            {content.consent.title}
          </Title>
          <Text c="dimmed" mt="xs">
            {content.consent.description}
          </Text>
          <Group mt="md">
            <Button type="button" onClick={() => setAnalyticsConsent('granted')}>
              {content.consent.accept}
            </Button>
            <Button type="button" variant="default" onClick={() => setAnalyticsConsent('denied')}>
              {content.consent.decline}
            </Button>
            <Button
              component={Link}
              to={getLocalizedPath('privacy', locale)}
              variant="subtle"
              color="dark"
            >
              {content.consent.privacyLink}
            </Button>
          </Group>
        </div>
      </Group>
    </Paper>
  );
}
