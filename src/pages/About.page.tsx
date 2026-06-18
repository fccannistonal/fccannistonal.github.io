import {
  IconArrowRight,
  IconBook2,
  IconHeartHandshake,
  IconSparkles,
  IconTable,
  IconUsersGroup,
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
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { trackVisitPlanningIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './About.page.module.css';

const PRACTICE_ICONS = [IconTable, IconUsersGroup, IconBook2, IconSparkles, IconHeartHandshake];

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

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.welcomeCard}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
          <div>
            <Badge variant="light" color="brand" size="lg">
              {content.about.greeting}
            </Badge>
            <Title order={2} mt="md">
              {content.about.welcomeTitle}
            </Title>
          </div>
          <Stack gap="md">
            {content.about.welcomeParagraphs.map((paragraph) => (
              <Text key={paragraph} c="dimmed" size="lg">
                {paragraph}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </Paper>

      <section aria-labelledby="mission-title" className={classes.section}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
          <Title id="mission-title" order={2}>
            {content.about.missionTitle}
          </Title>
          <Stack gap="sm">
            {content.about.missionStatements.map((statement) => (
              <Paper key={statement} withBorder p="md" className={classes.statementCard}>
                <Text fw={700}>{statement}</Text>
              </Paper>
            ))}
          </Stack>
        </SimpleGrid>
      </section>

      <section aria-labelledby="denomination-title" className={classes.section}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
          <Title id="denomination-title" order={2}>
            {content.about.denominationalTitle}
          </Title>
          <Stack gap="md">
            {content.about.denominationalParagraphs.map((paragraph) => (
              <Text key={paragraph} c="dimmed" size="lg">
                {paragraph}
              </Text>
            ))}
          </Stack>
        </SimpleGrid>
      </section>

      <section aria-labelledby="disciples-title" className={classes.section}>
        <div className={classes.sectionHeading}>
          <Title id="disciples-title" order={2}>
            {content.about.disciplesTitle}
          </Title>
          <Text c="dimmed" size="lg">
            {content.about.disciplesIntro}
          </Text>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl">
          {content.about.disciplesPractices.map((practice, index) => {
            const Icon = PRACTICE_ICONS[index] ?? IconSparkles;

            return (
              <Paper key={practice.title} withBorder p="lg" className={classes.practiceCard}>
                <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <Title order={3} mt="md">
                  {practice.title}
                </Title>
                <Text c="dimmed" mt="xs">
                  {practice.description}
                </Text>
              </Paper>
            );
          })}
        </SimpleGrid>
      </section>

      <section aria-labelledby="next-steps-title" className={classes.section}>
        <Title id="next-steps-title" order={2}>
          {content.about.nextStepsTitle}
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mt="xl">
          {content.about.nextSteps.map((step) => (
            <Paper
              key={step.routeId}
              component={Link}
              to={getLocalizedPath(step.routeId, locale)}
              withBorder
              p="lg"
              className={classes.nextStepCard}
            >
              <div>
                <Title order={3}>{step.title}</Title>
                <Text c="dimmed" mt="xs">
                  {step.description}
                </Text>
              </div>
              <IconArrowRight size={19} className={classes.nextStepArrow} aria-hidden="true" />
            </Paper>
          ))}
        </SimpleGrid>
      </section>

      <Paper
        p={{ base: 'xl', md: '3rem' }}
        mt={{ base: '3rem', md: '4rem' }}
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
          <Group align="center" justify="center">
            <Button
              component={Link}
              to={getLocalizedPath('visit', locale)}
              size="lg"
              onClick={() => trackVisitPlanningIntent('about-cta', locale)}
            >
              {content.about.cta}
            </Button>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
