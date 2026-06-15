import type { ComponentType } from 'react';
import {
  IconArrowUpRight,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
} from '@tabler/icons-react';
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
import { ContactForm } from '../components/church/ContactForm';
import { DeferredEmbed } from '../components/church/DeferredEmbed';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig, type ContactMethodId } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { trackContactIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import classes from './Contact.page.module.css';

const DETAIL_ICONS: Record<ContactMethodId, ComponentType<{ size?: number; stroke?: number }>> = {
  email: IconMail,
  phone: IconPhone,
  location: IconMapPin,
};

export function ContactPage() {
  const locale = useLocale();
  const content = getContent(locale);
  const contactDetails = [
    {
      id: 'location' as const,
      value: siteConfig.addressLines.join(', '),
      href: siteConfig.directionsUrl,
      external: true,
    },
    {
      id: 'email' as const,
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      external: false,
    },
    {
      id: 'phone' as const,
      value: siteConfig.phoneDisplay,
      href: siteConfig.phoneHref,
      external: false,
    },
  ];

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={`${content.common.denomination} · ${content.contact.eyebrow}`}
        title={content.contact.title}
        description={content.contact.description}
      />

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="xl">
        {contactDetails.map((detail) => {
          const Icon = DETAIL_ICONS[detail.id];

          return (
            <Paper
              key={detail.id}
              component="a"
              href={detail.href}
              target={detail.external ? '_blank' : undefined}
              rel={detail.external ? 'noreferrer' : undefined}
              withBorder
              p="lg"
              className={classes.detailCard}
              aria-label={`${content.contact.detailActions[detail.id]}: ${detail.value}`}
              onClick={() => trackContactIntent(detail.id, locale)}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <ThemeIcon size={46} radius="xl" color="brand" variant="light">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <IconArrowUpRight className={classes.detailArrow} size={20} stroke={1.7} />
              </Group>
              <Text className={classes.detailLabel} mt="lg">
                {content.contact.detailLabels[detail.id]}
              </Text>
              <Text fw={700} size="lg" mt={4}>
                {detail.value}
              </Text>
              <Text c="dimmed" size="sm" mt="xs">
                {content.contact.detailHelpers[detail.id]}
              </Text>
            </Paper>
          );
        })}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl" className={classes.mainGrid}>
        <Stack gap="xl">
          <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.visitCard}>
            <Badge variant="light" color="moss" size="lg" leftSection={<IconClock size={15} />}>
              {content.contact.visitBadge}
            </Badge>
            <Title order={2} mt="md">
              {content.contact.visitTitle}
            </Title>
            <Text c="dimmed" size="lg" mt="sm">
              {content.contact.visitCopy}
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

            <Group gap="sm" mt="xl" align="flex-start" wrap="nowrap">
              <ThemeIcon color="moss" variant="light" radius="xl" size={34}>
                <IconSparkles size={17} stroke={1.7} />
              </ThemeIcon>
              <Text c="dimmed">{content.contact.childrenNote}</Text>
            </Group>

            <Button
              component="a"
              href={siteConfig.directionsUrl}
              target="_blank"
              rel="noreferrer"
              mt="xl"
              size="md"
              leftSection={<IconMapPin size={18} />}
              rightSection={<IconArrowUpRight size={17} />}
              onClick={() => trackContactIntent('directions', locale)}
            >
              {content.common.directions}
            </Button>
          </Paper>

          <DeferredEmbed
            provider="Google Maps"
            title={content.contact.mapTitle}
            description={siteConfig.addressLines.join(', ')}
            loadLabel={content.contact.loadMap}
            src={siteConfig.mapEmbedUrl}
            externalUrl={siteConfig.directionsUrl}
            externalLabel={content.common.directions}
            iframeTitle={content.contact.mapTitle}
            connectionNote={content.common.embedConnectionNote('Google Maps')}
            minHeight="24rem"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Stack>

        <ContactForm />
      </SimpleGrid>
    </Container>
  );
}
