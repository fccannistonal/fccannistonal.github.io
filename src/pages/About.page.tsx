import {
  IconArrowRight,
  IconBook2,
  IconCircleCheck,
  IconExternalLink,
  IconHeartHandshake,
  IconSparkles,
  IconTable,
  IconUsersGroup,
} from '@tabler/icons-react';
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

      <section aria-labelledby="about-welcome-title" className={classes.introSection}>
        <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.welcomeCard}>
          <SimpleGrid
            cols={{ base: 1, md: 2 }}
            spacing={{ base: 'xl', md: '4rem' }}
            className={classes.introGrid}
          >
            <div className={classes.introHeading}>
              <Text className={classes.introKicker} fw={800}>
                {content.about.greeting}
              </Text>
              <Title id="about-welcome-title" order={2} mt="md" className={classes.panelTitle}>
                {content.about.welcomeTitle}
              </Title>
            </div>
            <Stack gap="md" className={classes.copyStack}>
              {content.about.welcomeParagraphs.map((paragraph) => (
                <Text key={paragraph} size="lg" className={classes.bodyText}>
                  {paragraph}
                </Text>
              ))}
            </Stack>
          </SimpleGrid>
        </Paper>
      </section>

      <section aria-labelledby="mission-title" className={classes.section}>
        <div className={classes.sectionHeading}>
          <Title id="mission-title" order={2} className={classes.sectionTitle}>
            {content.about.missionTitle}
          </Title>
        </div>
        <ol className={classes.missionGrid}>
          {content.about.missionStatements.map((statement) => (
            <li key={statement} className={classes.missionItem}>
              <Paper withBorder p="lg" className={classes.statementCard}>
                <ThemeIcon size={42} radius="xl" variant="light" color="moss" aria-hidden="true">
                  <IconCircleCheck size={22} stroke={1.8} />
                </ThemeIcon>
                <Text fw={700} mt="md" className={classes.statementText}>
                  {statement}
                </Text>
              </Paper>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="denomination-title" className={classes.section}>
        <div className={classes.storyGrid}>
          <div className={classes.sectionHeading}>
            <Title id="denomination-title" order={2} className={classes.sectionTitle}>
              {content.about.denominationalTitle}
            </Title>
          </div>
          <Stack gap="md" className={classes.storyCopy}>
            {content.about.denominationalParagraphs.map((paragraph) => (
              <Text key={paragraph} size="lg" className={classes.bodyText}>
                {paragraph}
              </Text>
            ))}
            <Button
              component="a"
              href={content.about.denominationalLink.href}
              target="_blank"
              rel="noreferrer"
              variant="subtle"
              color="brand"
              className={classes.disciplesLink}
              rightSection={<IconExternalLink size={17} aria-hidden="true" />}
            >
              {content.about.denominationalLink.label}
              <span className={classes.visuallyHidden}> {content.common.opensNewTab}</span>
            </Button>
          </Stack>
        </div>
      </section>

      <section aria-labelledby="disciples-title" className={classes.section}>
        <div className={classes.sectionHeading}>
          <Title id="disciples-title" order={2} className={classes.sectionTitle}>
            {content.about.disciplesTitle}
          </Title>
          <Text size="lg" className={classes.bodyText}>
            {content.about.disciplesIntro}
          </Text>
        </div>
        <div className={classes.practiceGrid}>
          {content.about.disciplesPractices.map((practice, index) => {
            const Icon = PRACTICE_ICONS[index] ?? IconSparkles;

            return (
              <Paper key={practice.title} withBorder p="lg" className={classes.practiceCard}>
                <ThemeIcon size={46} radius="xl" variant="light" color="brand" aria-hidden="true">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
                <Title order={3} mt="md" className={classes.cardTitle}>
                  {practice.title}
                </Title>
                <Text mt="xs" className={classes.bodyText}>
                  {practice.description}
                </Text>
              </Paper>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="next-steps-title" className={classes.section}>
        <Title id="next-steps-title" order={2} className={classes.sectionTitle}>
          {content.about.nextStepsTitle}
        </Title>
        <div className={classes.nextStepsGrid}>
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
                <Title order={3} className={classes.cardTitle}>
                  {step.title}
                </Title>
                <Text mt="xs" className={classes.bodyText}>
                  {step.description}
                </Text>
              </div>
              <IconArrowRight size={19} className={classes.nextStepArrow} aria-hidden="true" />
            </Paper>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-cta-title" className={`${classes.cta} ${classes.aboutCta}`}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className={classes.ctaGrid}>
          <div>
            <Title id="about-cta-title" order={2} c="white" className={classes.ctaTitle}>
              {content.about.ctaTitle}
            </Title>
            <Text mt="md" size="lg" className={classes.ctaText}>
              {content.about.ctaCopy}
            </Text>
          </div>
          <Group className={classes.ctaActions}>
            <Button
              component={Link}
              to={getLocalizedPath('visit', locale)}
              size="lg"
              className={classes.ctaButton}
              rightSection={<IconArrowRight size={18} aria-hidden="true" />}
              onClick={() => trackVisitPlanningIntent('about-cta', locale)}
            >
              {content.about.cta}
            </Button>
          </Group>
        </SimpleGrid>
      </section>
    </Container>
  );
}
