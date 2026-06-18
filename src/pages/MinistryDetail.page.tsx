import type { ComponentType } from 'react';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBook2,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconHeartHandshake,
  IconMessage,
  IconMessageCircleHeart,
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
  LocalizedMinistryPage,
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
type FeatureLayout = 'worship' | 'story' | 'programs';

const ITEM_ICONS: Record<string, IconComponent> = {
  prayer: IconPray,
  preaching: IconBook2,
  communion: IconHeartHandshake,
  music: IconMusic,
  stories: IconBook2,
  activities: IconSparkles,
  belonging: IconUsers,
  families: IconUsersGroup,
  language: IconMessageCircleHeart,
  'pastoral-care': IconHeartHandshake,
  chaplaincy: IconBuildingCommunity,
  connection: IconUsersGroup,
  oxfordfest: IconCalendarEvent,
  jsu: IconSchool,
  'older-adults': IconHeartHandshake,
  space: IconBuildingCommunity,
  participation: IconSparkles,
  welcome: IconUsersGroup,
  maria: IconMessageCircleHeart,
  gerald: IconMusic,
  jason: IconMicrophone2,
};

const RELATED_ICONS: Record<string, IconComponent> = {
  worship: IconMusic,
  children: IconSparkles,
  hispanic: IconMessageCircleHeart,
  theater: IconTheater,
  outreach: IconHeartHandshake,
  updates: IconCalendarEvent,
};

const MINISTRY_PRESENTATION: Record<MinistryPageId, { featureLayout: FeatureLayout }> = {
  worshipAndMusic: { featureLayout: 'worship' },
  wonderAndWorship: { featureLayout: 'story' },
  hispanicMinistry: { featureLayout: 'story' },
  serviceAndOutreach: { featureLayout: 'programs' },
};

function getItemIcon(id: string) {
  return ITEM_ICONS[id] ?? IconSparkles;
}

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
        : action.destination === 'visit'
          ? IconCalendarEvent
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

function FeatureHeading({ feature }: { feature: LocalizedMinistryFeature }) {
  const Icon = getItemIcon(feature.id);

  return (
    <>
      <Group gap="sm" align="center">
        <ThemeIcon size={42} radius="xl" variant="light" color="brand">
          <Icon size={21} stroke={1.7} />
        </ThemeIcon>
        <Text className={classes.eyebrow}>{feature.eyebrow}</Text>
      </Group>
      <Title order={3} className={classes.featureTitle}>
        {feature.title}
      </Title>
    </>
  );
}

function HighlightList({ highlights }: { highlights: LocalizedMinistryPage['highlights'] }) {
  return (
    <div className={classes.highlightList}>
      {highlights.map((highlight) => {
        const Icon = getItemIcon(highlight.id);

        return (
          <Paper key={highlight.id} component="article" withBorder className={classes.highlightRow}>
            <ThemeIcon size={44} radius="xl" variant="light" color="moss">
              <Icon size={22} stroke={1.7} />
            </ThemeIcon>
            <div>
              <Title order={3}>{highlight.title}</Title>
              <Text c="dimmed" mt="xs">
                {highlight.description}
              </Text>
            </div>
          </Paper>
        );
      })}
    </div>
  );
}

function WorshipFeatureLayout({
  features,
  assets,
}: {
  features: LocalizedMinistryFeature[];
  assets: Record<string, PhotoAsset>;
}) {
  const [practice, ...leaders] = features;

  return (
    <div className={classes.worshipFeatureLayout}>
      {practice ? (
        <Paper withBorder className={classes.practiceCard}>
          {assets[practice.id] && practice.imageAlt ? (
            <MinistryImage
              image={assets[practice.id]}
              alt={practice.imageAlt}
              className={classes.practiceImage}
              sizes="(max-width: 62em) 100vw, 48vw"
            />
          ) : null}
          <Stack gap="md" className={classes.practiceContent}>
            <FeatureHeading feature={practice} />
            <Text c="dimmed" size="lg">
              {practice.description}
            </Text>
          </Stack>
        </Paper>
      ) : null}

      <Stack gap="lg" className={classes.leaderStack}>
        {leaders.map((leader) => (
          <Paper key={leader.id} withBorder className={classes.leaderCard}>
            {assets[leader.id] && leader.imageAlt ? (
              <MinistryImage
                image={assets[leader.id]}
                alt={leader.imageAlt}
                className={classes.leaderImage}
                sizes="(max-width: 48em) 34vw, 14vw"
              />
            ) : null}
            <Stack gap="sm" className={classes.leaderContent}>
              <FeatureHeading feature={leader} />
              <Text c="dimmed">{leader.description}</Text>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </div>
  );
}

function StoryFeatureLayout({
  features,
  assets,
}: {
  features: LocalizedMinistryFeature[];
  assets: Record<string, PhotoAsset>;
}) {
  return (
    <div className={classes.storyFeatureLayout}>
      {features.map((feature, index) => (
        <Paper
          key={feature.id}
          component="article"
          withBorder
          className={classes.storyFeature}
          data-reversed={index % 2 === 1 ? 'true' : undefined}
        >
          {assets[feature.id] && feature.imageAlt ? (
            <MinistryImage
              image={assets[feature.id]}
              alt={feature.imageAlt}
              className={classes.storyFeatureImage}
              sizes="(max-width: 62em) 100vw, 38vw"
            />
          ) : null}
          <Stack gap="md" className={classes.storyFeatureContent}>
            <FeatureHeading feature={feature} />
            <Text c="dimmed" size="lg">
              {feature.description}
            </Text>
          </Stack>
        </Paper>
      ))}
    </div>
  );
}

function ProgramFeatureLayout({
  features,
  assets,
}: {
  features: LocalizedMinistryFeature[];
  assets: Record<string, PhotoAsset>;
}) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      {features.map((feature) => {
        const Icon = getItemIcon(feature.id);
        const featureImage = assets[feature.id];

        return (
          <Paper
            key={feature.id}
            component="article"
            withBorder
            className={classes.programCard}
            data-with-image={featureImage ? 'true' : undefined}
          >
            {featureImage && feature.imageAlt ? (
              <MinistryImage
                image={featureImage}
                alt={feature.imageAlt}
                className={classes.programImage}
                sizes="(max-width: 62em) 100vw, 36vw"
              />
            ) : null}
            <Stack gap="md" className={classes.programContent}>
              <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                <Icon size={23} stroke={1.7} />
              </ThemeIcon>
              <div>
                <Text className={classes.eyebrow}>{feature.eyebrow}</Text>
                <Title order={3} mt="xs">
                  {feature.title}
                </Title>
                <Text c="dimmed" mt="sm">
                  {feature.description}
                </Text>
              </div>
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}

function MinistryFeatures({
  ministry,
  ministryId,
  assets,
}: {
  ministry: LocalizedMinistryPage;
  ministryId: MinistryPageId;
  assets: Record<string, PhotoAsset>;
}) {
  const layout = MINISTRY_PRESENTATION[ministryId].featureLayout;

  return (
    <section
      aria-labelledby={`${ministryId}-features-title`}
      className={classes.featureSection}
      data-layout={layout}
    >
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

      {layout === 'worship' ? (
        <WorshipFeatureLayout features={ministry.features} assets={assets} />
      ) : null}
      {layout === 'story' ? (
        <StoryFeatureLayout features={ministry.features} assets={assets} />
      ) : null}
      {layout === 'programs' ? (
        <ProgramFeatureLayout features={ministry.features} assets={assets} />
      ) : null}
    </section>
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
      <section
        className={classes.hero}
        data-ministry={ministryId}
        aria-labelledby={`${ministryId}-title`}
      >
        <Container size="xl" className={classes.heroInner}>
          <div className={classes.heroPanel}>
            <SimpleGrid
              cols={{ base: 1, lg: 2 }}
              spacing={{ base: 'xl', lg: '4rem' }}
              className={classes.heroGrid}
            >
              <Stack gap="lg" className={classes.heroContent}>
                <Badge variant="light" color="brand" size="lg" w="fit-content">
                  {ministry.eyebrow}
                </Badge>
                <div>
                  <Title id={`${ministryId}-title`} order={1} className={classes.heroTitle}>
                    {ministry.title}
                  </Title>
                  <Text size="xl" className={classes.heroDescription}>
                    {ministry.description}
                  </Text>
                </div>

                <div className={classes.heroActionPanel}>
                  <Text fw={800} className={classes.heroActionTitle}>
                    {ministry.ctaTitle}
                  </Text>
                  <Text c="dimmed" mt="xs">
                    {ministry.ctaCopy}
                  </Text>
                  <Group gap="sm" mt="lg" className={classes.heroActions}>
                    {ministry.actions.map((action) => (
                      <MinistryActionButton
                        key={action.id}
                        action={action}
                        ministryId={ministryId}
                      />
                    ))}
                  </Group>
                </div>
              </Stack>

              <figure className={classes.heroFigure}>
                <MinistryImage
                  image={assets.hero}
                  alt={ministry.heroAlt}
                  className={classes.heroImage}
                  eager
                  sizes="(max-width: 62em) 100vw, 46vw"
                />
                <figcaption className={classes.heroCaption}>
                  <IconSparkles size={16} aria-hidden="true" />
                  {ministry.heroLabel}
                </figcaption>
              </figure>
            </SimpleGrid>
          </div>
        </Container>
      </section>

      <div className={classes.pageStack} data-ministry={ministryId}>
        <section aria-labelledby={`${ministryId}-intro-title`} className={classes.introSection}>
          <Container size="xl">
            <div className={classes.introLayout}>
              <div className={classes.introHeading}>
                <Text className={classes.eyebrow}>{ministry.introEyebrow}</Text>
                <Title id={`${ministryId}-intro-title`} order={2} mt="sm">
                  {ministry.introTitle}
                </Title>
              </div>
              <Stack gap="md" className={classes.prose}>
                {ministry.introduction.map((paragraph) => (
                  <Text key={paragraph} c="dimmed" size="lg">
                    {paragraph}
                  </Text>
                ))}
              </Stack>
            </div>
          </Container>
        </section>

        <section
          aria-labelledby={`${ministryId}-highlights-title`}
          className={classes.highlightsSection}
        >
          <Container size="xl">
            <div className={classes.highlightsHeader}>
              <div>
                <Text className={classes.eyebrow}>{ministry.featureEyebrow}</Text>
                <Title id={`${ministryId}-highlights-title`} order={2} mt="xs">
                  {ministry.highlightsTitle}
                </Title>
              </div>
              <Text c="dimmed" size="lg">
                {ministry.description}
              </Text>
            </div>
            <HighlightList highlights={ministry.highlights} />
          </Container>
        </section>

        <Container size="xl" className={classes.lowerContent}>
          <MinistryFeatures ministry={ministry} ministryId={ministryId} assets={assets.features} />

          <section
            aria-labelledby={`${ministryId}-related-title`}
            className={classes.relatedSection}
          >
            <Text className={classes.eyebrow}>{content.ministries.relatedEyebrow}</Text>
            <Title id={`${ministryId}-related-title`} order={2} mt="xs">
              {content.ministries.relatedTitle}
            </Title>
            <Text c="dimmed" size="lg" mt="sm" maw={680}>
              {content.ministries.relatedCopy}
            </Text>
            <div className={classes.relatedList}>
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
                    className={classes.relatedCard}
                  >
                    <ThemeIcon size={38} radius="xl" variant="light" color="brand">
                      <Icon size={19} stroke={1.7} />
                    </ThemeIcon>
                    <div className={classes.relatedCopy}>
                      <Title order={3}>{card.title}</Title>
                      <Text c="dimmed" mt={4}>
                        {card.description}
                      </Text>
                    </div>
                    <IconArrowRight size={18} className={classes.relatedArrow} aria-hidden="true" />
                  </Paper>
                );
              })}
            </div>
          </section>
        </Container>
      </div>
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
