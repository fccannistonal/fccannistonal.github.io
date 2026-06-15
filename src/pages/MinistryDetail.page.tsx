import type { ComponentType } from 'react';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBook2,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconHeartHandshake,
  IconLanguage,
  IconMessage,
  IconMicrophone2,
  IconMusic,
  IconPray,
  IconSchool,
  IconSparkles,
  IconTheater,
  IconUsers,
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
import { ResponsiveImage } from '../components/church/ResponsiveImage';
import {
  ministryPageAssets,
  siteConfig,
  type MinistryPageId,
  type PhotoAsset,
} from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import type {
  LocalizedMinistryAction,
  LocalizedMinistryFeature,
} from '../content/localizedMinistryContent';
import {
  trackContactIntent,
  trackGivingIntent,
  trackVisitPlanningIntent,
} from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath, type RouteId } from '../lib/routing';
import classes from './MinistryDetail.page.module.css';

type IconComponent = ComponentType<{ size?: number; stroke?: number }>;

const ITEM_ICONS: Record<string, IconComponent> = {
  prayer: IconPray,
  preaching: IconBook2,
  communion: IconHeartHandshake,
  music: IconMusic,
  stories: IconBook2,
  activities: IconSparkles,
  belonging: IconUsers,
  families: IconUsersGroup,
  language: IconLanguage,
  'pastoral-care': IconHeartHandshake,
  chaplaincy: IconBuildingCommunity,
  connection: IconUsersGroup,
  oxfordfest: IconCalendarEvent,
  jsu: IconSchool,
  'older-adults': IconHeartHandshake,
  space: IconBuildingCommunity,
  participation: IconSparkles,
  welcome: IconUsersGroup,
  maria: IconLanguage,
  gerald: IconMusic,
  jason: IconMicrophone2,
};

const RELATED_ICONS: Record<string, IconComponent> = {
  worship: IconMusic,
  children: IconSparkles,
  hispanic: IconLanguage,
  theater: IconTheater,
  outreach: IconHeartHandshake,
  updates: IconCalendarEvent,
};

function MinistryImage({
  image,
  alt,
  className,
  eager = false,
  sizes,
}: {
  image: PhotoAsset;
  alt: string;
  className: string;
  eager?: boolean;
  sizes: string;
}) {
  return (
    <ResponsiveImage
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      className={className}
      style={{ objectPosition: image.objectPosition }}
    />
  );
}

function MinistryActionButton({
  action,
  ministryId,
}: {
  action: LocalizedMinistryAction;
  ministryId: MinistryPageId;
}) {
  const locale = useLocale();
  const icon =
    action.destination === 'give'
      ? IconHeartHandshake
      : action.destination === 'sermons'
        ? IconMicrophone2
        : action.destination === 'contact'
          ? IconMessage
          : IconArrowRight;
  const Icon = icon;

  if (action.destination === 'give' || action.destination === 'sermons') {
    const href = action.destination === 'give' ? siteConfig.givingFormUrl : siteConfig.sermonUrl;

    return (
      <Button
        component="a"
        href={href}
        target="_blank"
        rel="noreferrer"
        size="lg"
        variant={action.destination === 'give' ? 'filled' : 'light'}
        leftSection={<Icon size={19} />}
        rightSection={<IconArrowUpRight size={17} />}
        onClick={action.destination === 'give' ? () => trackGivingIntent(locale) : undefined}
      >
        {action.label}
      </Button>
    );
  }

  const routeId: RouteId = action.destination;
  const destination = getLocalizedPath(routeId, locale);
  const to =
    action.destination === 'contact'
      ? `${destination}?source=${ministryId}&interest=${action.id}`
      : destination;

  return (
    <Button
      component={Link}
      to={to}
      size="lg"
      variant={action.destination === 'staff' ? 'light' : 'filled'}
      leftSection={<Icon size={19} />}
      rightSection={<IconArrowRight size={17} />}
      onClick={() => {
        if (action.destination === 'visit') {
          trackVisitPlanningIntent(action.id, locale);
        }
        if (action.destination === 'contact') {
          trackContactIntent(action.id, locale);
        }
      }}
    >
      {action.label}
    </Button>
  );
}

function FeatureCard({
  feature,
  image,
}: {
  feature: LocalizedMinistryFeature;
  image?: PhotoAsset;
}) {
  const Icon = ITEM_ICONS[feature.id] ?? IconSparkles;

  return (
    <Paper withBorder className={classes.featureCard}>
      {image && feature.imageAlt ? (
        <MinistryImage
          image={image}
          alt={feature.imageAlt}
          className={classes.featureImage}
          sizes="(max-width: 48em) 100vw, 42vw"
        />
      ) : null}
      <Stack gap="sm" className={classes.featureContent}>
        <ThemeIcon size={44} radius="xl" variant="light" color="brand">
          <Icon size={22} stroke={1.7} />
        </ThemeIcon>
        <Text className={classes.eyebrow}>{feature.eyebrow}</Text>
        <Title order={3}>{feature.title}</Title>
        <Text c="dimmed" size="lg">
          {feature.description}
        </Text>
      </Stack>
    </Paper>
  );
}

export function MinistryDetailPage({ ministryId }: { ministryId: MinistryPageId }) {
  const locale = useLocale();
  const content = getContent(locale);
  const ministry = content.ministries.pages[ministryId];
  const assets = ministryPageAssets[ministryId];
  const relatedCards = content.community.cards.filter((card) => card.routeId !== ministryId);

  return (
    <>
      <section className={classes.hero} aria-labelledby={`${ministryId}-title`}>
        <MinistryImage
          image={assets.hero}
          alt={ministry.heroAlt}
          className={classes.heroImage}
          eager
          sizes="100vw"
        />
        <div className={classes.heroOverlay} />
        <Container size="xl" className={classes.heroInner}>
          <div className={classes.heroContent}>
            <Badge variant="filled" color="brand" size="lg">
              {ministry.eyebrow}
            </Badge>
            <Title id={`${ministryId}-title`} order={1} className={classes.heroTitle}>
              {ministry.title}
            </Title>
            <Text size="xl" className={classes.heroDescription}>
              {ministry.description}
            </Text>
            <Group gap="sm" mt="xl">
              <Badge
                size="lg"
                variant="outline"
                color="gray"
                leftSection={<IconSparkles size={15} />}
                className={classes.heroFact}
              >
                {ministry.heroLabel}
              </Badge>
            </Group>
          </div>
        </Container>
      </section>

      <Container size="xl" py={{ base: '3rem', md: '6rem' }}>
        <Stack className={classes.pageStack}>
          <section aria-labelledby={`${ministryId}-intro-title`}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
              <div>
                <Text className={classes.eyebrow}>{ministry.introEyebrow}</Text>
                <Title id={`${ministryId}-intro-title`} order={2} mt="sm">
                  {ministry.introTitle}
                </Title>
              </div>
              <Stack gap="md">
                {ministry.introduction.map((paragraph) => (
                  <Text key={paragraph} c="dimmed" size="lg">
                    {paragraph}
                  </Text>
                ))}
              </Stack>
            </SimpleGrid>
          </section>

          <section aria-labelledby={`${ministryId}-highlights-title`}>
            <Title id={`${ministryId}-highlights-title`} order={2}>
              {ministry.highlightsTitle}
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mt="xl">
              {ministry.highlights.map((highlight) => {
                const Icon = ITEM_ICONS[highlight.id] ?? IconSparkles;

                return (
                  <Paper key={highlight.id} withBorder p="lg" className={classes.highlightCard}>
                    <ThemeIcon size={46} radius="xl" variant="light" color="moss">
                      <Icon size={23} stroke={1.7} />
                    </ThemeIcon>
                    <Title order={3} mt="md">
                      {highlight.title}
                    </Title>
                    <Text c="dimmed" mt="xs">
                      {highlight.description}
                    </Text>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </section>

          <section aria-labelledby={`${ministryId}-features-title`}>
            <div className={classes.sectionHeading}>
              <div>
                <Text className={classes.eyebrow}>{ministry.featureEyebrow}</Text>
                <Title id={`${ministryId}-features-title`} order={2} mt="xs">
                  {ministry.featureTitle}
                </Title>
              </div>
              <Text c="dimmed" size="lg" maw={560}>
                {ministry.featureCopy}
              </Text>
            </div>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {ministry.features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  image={assets.features[feature.id]}
                />
              ))}
            </SimpleGrid>
          </section>

          <section aria-labelledby={`${ministryId}-cta-title`}>
            <Paper p={{ base: 'xl', md: '3rem' }} className={classes.ctaCard}>
              <div className={classes.ctaGlow} aria-hidden="true" />
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className={classes.ctaContent}>
                <div>
                  <Title id={`${ministryId}-cta-title`} order={2} c="white">
                    {ministry.ctaTitle}
                  </Title>
                  <Text mt="md" size="lg" className={classes.ctaCopy}>
                    {ministry.ctaCopy}
                  </Text>
                </div>
                <Group gap="sm" align="center">
                  {ministry.actions.map((action) => (
                    <MinistryActionButton key={action.id} action={action} ministryId={ministryId} />
                  ))}
                </Group>
              </SimpleGrid>
            </Paper>
          </section>

          <section aria-labelledby={`${ministryId}-related-title`}>
            <Text className={classes.eyebrow}>{content.ministries.relatedEyebrow}</Text>
            <Title id={`${ministryId}-related-title`} order={2} mt="xs">
              {content.ministries.relatedTitle}
            </Title>
            <Text c="dimmed" size="lg" mt="sm" maw={680}>
              {content.ministries.relatedCopy}
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
              {relatedCards.map((card) => {
                const Icon = RELATED_ICONS[card.id] ?? IconSparkles;
                const href = card.routeId
                  ? getLocalizedPath(card.routeId, locale)
                  : (card.href ?? getLocalizedPath('community', locale));

                return (
                  <Paper
                    key={card.id}
                    component={Link}
                    to={href}
                    withBorder
                    p="lg"
                    className={classes.relatedCard}
                  >
                    <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                      <Icon size={21} stroke={1.7} />
                    </ThemeIcon>
                    <Title order={3} mt="md">
                      {card.title}
                    </Title>
                    <Text c="dimmed" mt="xs">
                      {card.description}
                    </Text>
                    <Text className={classes.relatedCta}>
                      {content.common.learnMore} <IconArrowRight size={16} aria-hidden="true" />
                    </Text>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </section>
        </Stack>
      </Container>
    </>
  );
}

export function WorshipAndMusicPage() {
  return <MinistryDetailPage ministryId="worshipAndMusic" />;
}

export function WonderAndWorshipPage() {
  return <MinistryDetailPage ministryId="wonderAndWorship" />;
}

export function HispanicMinistryPage() {
  return <MinistryDetailPage ministryId="hispanicMinistry" />;
}

export function ServiceAndOutreachPage() {
  return <MinistryDetailPage ministryId="serviceAndOutreach" />;
}
