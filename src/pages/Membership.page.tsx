import { IconMessage, IconUserHeart } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
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
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { trackContactIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './About.page.module.css';

export function MembershipPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.membership.eyebrow}
        title={content.membership.title}
        description={content.membership.description}
      />

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.welcomeCard}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
          <div>
            <ThemeIcon size={52} radius="xl" variant="light" color="brand">
              <IconUserHeart size={27} stroke={1.7} />
            </ThemeIcon>
            <Title order={2} mt="md">
              {content.membership.introTitle}
            </Title>
          </div>
          <Stack gap="md">
            {content.membership.introParagraphs.map((paragraph) => (
              <Text key={paragraph} c="dimmed" size="lg">
                {paragraph}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </Paper>

      <Stack gap="lg" mt={{ base: '3rem', md: '4rem' }}>
        {content.membership.sections.map((section) => (
          <Paper
            key={section.title}
            withBorder
            p={{ base: 'lg', md: 'xl' }}
            className={classes.practiceCard}
          >
            <Title order={2}>{section.title}</Title>
            <Stack gap="md" mt="md">
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} c="dimmed" size="lg">
                  {paragraph}
                </Text>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper
        p={{ base: 'xl', md: '3rem' }}
        mt={{ base: '3rem', md: '4rem' }}
        className={classes.cta}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Title order={2} c="white">
              {content.membership.ctaTitle}
            </Title>
            <Text mt="md" size="lg" className={classes.ctaText}>
              {content.membership.ctaCopy}
            </Text>
          </div>
          <Group align="center" justify="center">
            <Button
              component={Link}
              to={getLocalizedPath('contact', locale)}
              size="lg"
              leftSection={<IconMessage size={18} />}
              onClick={() => trackContactIntent('membership-cta', locale)}
            >
              {content.membership.cta}
            </Button>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
