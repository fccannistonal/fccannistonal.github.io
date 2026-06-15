import { IconBrandFacebook, IconCalendarEvent, IconPhone } from '@tabler/icons-react';
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
  Title,
} from '@mantine/core';
import { DeferredEmbed } from '../components/church/DeferredEmbed';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Updates.page.module.css';

export function UpdatesPage() {
  const locale = useLocale();
  const content = getContent(locale);
  const facebookPluginUrl = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
    siteConfig.facebookUrl
  )}&tabs=timeline&width=500&height=700&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.updates.eyebrow}
        title={content.updates.title}
        description={content.updates.description}
      />

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.alertCard}>
        <Badge variant="light" color="moss" leftSection={<IconCalendarEvent size={15} />}>
          {content.updates.alertTitle}
        </Badge>
        <Title order={2} mt="md">
          {content.updates.alertTitle}
        </Title>
        <Text c="dimmed" size="lg" mt="sm">
          {content.updates.alertCopy}
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="xl">
          {siteConfig.serviceTimes.map((service) => (
            <Paper key={service.id} withBorder p="md">
              <Text fw={700}>{content.common.serviceLabels[service.id]}</Text>
              <Text c="brand.7" fw={800} size="xl">
                {service.time}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Paper>

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.facebookCard}>
        <Badge variant="light" color="blue" leftSection={<IconBrandFacebook size={15} />}>
          Facebook
        </Badge>
        <Title order={2} mt="md">
          {content.updates.facebookTitle}
        </Title>
        <Text c="dimmed" size="lg" mt="sm">
          {content.updates.facebookCopy}
        </Text>
        <Stack gap="xs" mt="md">
          <Text size="sm" c="dimmed">
            {content.updates.facebookLanguageNote}
          </Text>
          <Text size="sm" c="dimmed">
            {content.updates.privacyNote}
          </Text>
        </Stack>
        <DeferredEmbed
          provider="Meta / Facebook"
          title={content.updates.facebookTitle}
          description={content.updates.privacyNote}
          loadLabel={content.updates.loadFacebook}
          src={facebookPluginUrl}
          externalUrl={siteConfig.facebookUrl}
          externalLabel={content.updates.openFacebook}
          iframeTitle={content.updates.facebookTitle}
          connectionNote={content.common.embedConnectionNote('Meta / Facebook')}
          minHeight="44rem"
        />
      </Paper>

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.fallbackCard}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Title order={2}>{content.updates.fallbackTitle}</Title>
            <Text c="dimmed" size="lg" mt="md">
              {content.updates.fallbackCopy}
            </Text>
          </div>
          <Group align="center" justify="center">
            <Button
              component="a"
              href={siteConfig.phoneHref}
              variant="light"
              leftSection={<IconPhone size={18} />}
            >
              {siteConfig.phoneDisplay}
            </Button>
            <Button component={Link} to={getLocalizedPath('contact', locale)}>
              {content.common.contact}
            </Button>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
