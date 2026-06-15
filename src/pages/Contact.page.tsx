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
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';
import { trackContactIntent } from '../lib/googleAnalytics';
import classes from './Contact.page.module.css';

const DETAIL_ICONS: Record<string, ComponentType<{ size?: number; stroke?: number }>> = {
  Email: IconMail,
  Phone: IconPhone,
  Location: IconMapPin,
};

export function ContactPage() {
  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={`${siteConfig.denomination} · Anniston, Alabama`}
        title="We’d love to hear from you"
        description="Whether you are planning your first Sunday, looking for a church home, or simply have a question, there is a place for you here."
      />

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="xl">
        {siteConfig.contactDetails.map((detail) => {
          const Icon = DETAIL_ICONS[detail.label] ?? IconSparkles;
          const isExternal = detail.label === 'Location';

          return (
            <Paper
              key={detail.label}
              component="a"
              href={detail.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              withBorder
              p="lg"
              className={classes.detailCard}
              aria-label={`${detail.actionLabel}: ${detail.value}`}
              onClick={() => trackContactIntent(detail.label)}
            >
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <ThemeIcon size={46} radius="xl" color="brand" variant="light">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <IconArrowUpRight className={classes.detailArrow} size={20} stroke={1.7} />
              </Group>
              <Text className={classes.detailLabel} mt="lg">
                {detail.label}
              </Text>
              <Text fw={700} size="lg" mt={4}>
                {detail.value}
              </Text>
              <Text c="dimmed" size="sm" mt="xs">
                {detail.helper}
              </Text>
            </Paper>
          );
        })}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl" className={classes.mainGrid}>
        <Stack gap="xl">
          <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.visitCard}>
            <Badge variant="light" color="moss" size="lg" leftSection={<IconClock size={15} />}>
              Plan your Sunday
            </Badge>
            <Title order={2} mt="md">
              Come worship with us
            </Title>
            <Text c="dimmed" size="lg" mt="sm">
              You do not need to dress a certain way or know what to expect. Come as you are and
              know that you are welcome at the table.
            </Text>

            <Stack gap="sm" mt="xl">
              {siteConfig.serviceTimes.map((service) => (
                <Group
                  key={service.label}
                  justify="space-between"
                  gap="md"
                  className={classes.serviceRow}
                >
                  <Text fw={700}>{service.label}</Text>
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
              <Text c="dimmed">{siteConfig.serviceNotes[2]}</Text>
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
              onClick={() => trackContactIntent('directions')}
            >
              Get directions
            </Button>
          </Paper>

          <Paper withBorder p={0} className={classes.mapCard}>
            <iframe
              src={siteConfig.mapEmbedUrl}
              title="Map showing First Christian Church at 1327 Leighton Avenue in Anniston"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={classes.mapFrame}
            />
            <div className={classes.mapCaption}>
              <Text fw={800}>First Christian Church Anniston</Text>
              <Text c="dimmed" size="sm">
                {siteConfig.addressLines.join(' · ')}
              </Text>
            </div>
          </Paper>
        </Stack>

        <ContactForm />
      </SimpleGrid>
    </Container>
  );
}
