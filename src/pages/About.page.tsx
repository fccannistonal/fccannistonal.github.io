import {
  IconBook2,
  IconHeartHandshake,
  IconMessageQuestion,
  IconSparkles,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { trackVisitPlanningIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './About.page.module.css';

const VALUE_ICONS = [IconHeartHandshake, IconSparkles, IconBook2, IconMessageQuestion];

export function AboutPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.about.eyebrow}
        title={content.about.title}
        description={content.about.description}
      />

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.identityCard}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
          <Title order={2}>{content.about.identityTitle}</Title>
          <Stack gap="md">
            {content.about.identityParagraphs.map((paragraph) => (
              <Text key={paragraph} c="dimmed" size="lg">
                {paragraph}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </Paper>

      <section aria-labelledby="values-title">
        <Title id="values-title" order={2} mt={{ base: '3rem', md: '5rem' }}>
          {content.about.valuesTitle}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl">
          {content.about.values.map((value, index) => {
            const Icon = VALUE_ICONS[index] ?? IconSparkles;

            return (
              <Paper key={value.title} withBorder p="lg" className={classes.valueCard}>
                <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <Title order={3} mt="md">
                  {value.title}
                </Title>
                <Text c="dimmed" mt="xs">
                  {value.description}
                </Text>
              </Paper>
            );
          })}
        </SimpleGrid>
      </section>

      <section aria-labelledby="history-title">
        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing={{ base: 'xl', md: '4rem' }}
          mt={{ base: '3rem', md: '5rem' }}
        >
          <Title id="history-title" order={2}>
            {content.about.historyTitle}
          </Title>
          <Stack gap="md">
            {content.about.historyParagraphs.map((paragraph) => (
              <Text key={paragraph} c="dimmed" size="lg">
                {paragraph}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </section>

      <Paper
        p={{ base: 'xl', md: '3rem' }}
        mt={{ base: '3rem', md: '5rem' }}
        className={classes.cta}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Title order={2} c="white">
              {content.about.ctaTitle}
            </Title>
            <Text mt="md" size="lg" className={classes.ctaText}>
              {content.about.ctaCopy}
            </Text>
          </div>
          <Stack align="center" justify="center">
            <Button
              component={Link}
              to={getLocalizedPath('visit', locale)}
              size="lg"
              onClick={() => trackVisitPlanningIntent('about-cta', locale)}
            >
              {content.about.cta}
            </Button>
          </Stack>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
