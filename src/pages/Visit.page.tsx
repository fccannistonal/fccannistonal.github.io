import type { ComponentType } from 'react';
import {
  IconAccessible,
  IconClock,
  IconHeartHandshake,
  IconMapPin,
  IconMessage,
  IconParking,
  IconShirt,
  IconUsers,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DeferredEmbed } from '../components/church/DeferredEmbed';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { trackContactIntent, trackVisitPlanningIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Visit.page.module.css';

const SECTION_ICONS: Record<string, ComponentType<{ size?: number; stroke?: number }>> = {
  arrival: IconParking,
  accessibility: IconAccessible,
  dress: IconShirt,
  worship: IconClock,
  communion: IconHeartHandshake,
  children: IconUsers,
};

export function VisitPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.visit.eyebrow}
        title={content.visit.title}
        description={content.visit.description}
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
        <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.quickCard}>
          <Badge variant="light" color="brand" leftSection={<IconClock size={15} />}>
            {content.visit.quickTitle}
          </Badge>
          <Title order={2} mt="md">
            {content.visit.quickTitle}
          </Title>
          <Text c="dimmed" size="lg" mt="sm">
            {content.visit.quickCopy}
          </Text>
          <Stack gap="sm" mt="xl">
            {siteConfig.serviceTimes.map((service) => (
              <Group
                key={service.id}
                justify="space-between"
                gap="md"
                className={classes.serviceRow}
              >
                <Text fw={700}>{content.common.serviceLabels[service.id]}</Text>
                <Text c="brand.7" fw={800}>
                  {service.time}
                </Text>
              </Group>
            ))}
          </Stack>
          <Group gap="sm" mt="xl">
            <Button
              component="a"
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noreferrer"
              leftSection={<IconMapPin size={18} />}
              onClick={() => trackVisitPlanningIntent('visit-directions', locale)}
            >
              {content.common.directions}
            </Button>
            <Button
              component={Link}
              to={getLocalizedPath('contact', locale)}
              variant="light"
              leftSection={<IconMessage size={18} />}
              onClick={() => trackContactIntent('visit-page', locale)}
            >
              {content.visit.contactCta}
            </Button>
          </Group>
        </Paper>

        <DeferredEmbed
          providerId="google-maps"
          preview="map"
          provider="Google Maps"
          title={content.visit.mapTitle}
          description={siteConfig.addressLines.join(', ')}
          loadLabel={content.visit.loadMap}
          src={siteConfig.mapEmbedUrl}
          externalUrl={siteConfig.directionsUrl}
          externalLabel={content.common.directions}
          iframeTitle={content.visit.mapTitle}
          connectionNote={content.common.embedConnectionNote('Google Maps')}
          minHeight="28rem"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </SimpleGrid>

      <section aria-labelledby="visit-logistics-title">
        <Title id="visit-logistics-title" order={2} mt={{ base: '3rem', md: '5rem' }}>
          {content.visit.logisticsTitle}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
          {content.visit.sections.map((section) => {
            const Icon = SECTION_ICONS[section.id] ?? IconHeartHandshake;

            return (
              <Paper key={section.id} withBorder p="lg" className={classes.logisticsCard}>
                <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <Title order={3} mt="md">
                  {section.title}
                </Title>
                <Text c="dimmed" mt="xs">
                  {section.description}
                </Text>
              </Paper>
            );
          })}
        </SimpleGrid>
      </section>

      <Paper
        withBorder
        p={{ base: 'lg', md: 'xl' }}
        mt={{ base: '3rem', md: '5rem' }}
        className={classes.welcomeCard}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Title order={2}>{content.visit.welcomeTitle}</Title>
            <Text c="dimmed" size="lg" mt="md">
              {content.visit.welcomeCopy}
            </Text>
          </div>
          <Group align="center" justify="center">
            <Button
              component={Link}
              to={getLocalizedPath('contact', locale)}
              size="lg"
              leftSection={<IconMessage size={20} />}
              onClick={() => trackContactIntent('visit-page-bottom', locale)}
            >
              {content.visit.contactCta}
            </Button>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
