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

const MINISTRY_PRESENTATION: Record<MinistryPageId, { featureLayout: FeatureLayout }> = {
  worshipAndMusic: { featureLayout: 'worship' },
  wonderAndWorship: { featureLayout: 'story' },
  hispanicMinistry: { featureLayout: 'story' },
  serviceAndOutreach: { featureLayout: 'programs' },
};

type MinistryLanguage = 'en' | 'es';

type QuickFact = {
  label: string;
  value: string;
  icon: IconComponent;
};

const MINISTRY_UI_COPY: Record<
  MinistryLanguage,
  {
    glanceEyebrow: string;
    glanceTitle: string;
    expectEyebrow: string;
    finalCtaEyebrow: string;
  }
> = {
  en: {
    glanceEyebrow: 'At a glance',
    glanceTitle: 'What to know before you visit',
    expectEyebrow: 'What to expect',
    finalCtaEyebrow: 'Next step',
  },
  es: {
    glanceEyebrow: 'De un vistazo',
    glanceTitle: 'Qué saber antes de visitar',
    expectEyebrow: 'Qué esperar',
    finalCtaEyebrow: 'Próximo paso',
  },
};

const MINISTRY_QUICK_FACTS: Record<MinistryPageId, Record<MinistryLanguage, QuickFact[]>> = {
  worshipAndMusic: {
    en: [
      {
        label: 'Best for',
        value:
          'Visitors and members who want worship shaped by song, prayer, Scripture, communion, and shared leadership.',
        icon: IconUsersGroup,
      },
      {
        label: 'When',
        value: 'During Sunday worship.',
        icon: IconCalendarEvent,
      },
      {
        label: 'Next step',
        value: 'Attend worship, listen to a sermon, or ask about participating in music.',
        icon: IconMusic,
      },
    ],
    es: [
      {
        label: 'Ideal para',
        value:
          'Visitantes y miembros que quieren adorar con canto, oración, Escritura, comunión y liderazgo compartido.',
        icon: IconUsersGroup,
      },
      {
        label: 'Cuándo',
        value: 'Durante el culto dominical.',
        icon: IconCalendarEvent,
      },
      {
        label: 'Próximo paso',
        value: 'Asistir al culto, escuchar un sermón o preguntar cómo participar en la música.',
        icon: IconMusic,
      },
    ],
  },
  wonderAndWorship: {
    en: [
      {
        label: 'Best for',
        value: 'Children and families who need a worship space designed for young participants.',
        icon: IconSparkles,
      },
      {
        label: 'When',
        value: 'During the worship service.',
        icon: IconCalendarEvent,
      },
      {
        label: 'Next step',
        value: 'Visit on Sunday and ask where children gather before worship begins.',
        icon: IconUsersGroup,
      },
    ],
    es: [
      {
        label: 'Ideal para',
        value: 'Niños y familias que necesitan un espacio de adoración pensado para participantes pequeños.',
        icon: IconSparkles,
      },
      {
        label: 'Cuándo',
        value: 'Durante el culto.',
        icon: IconCalendarEvent,
      },
      {
        label: 'Próximo paso',
        value: 'Visitar un domingo y preguntar dónde se reúnen los niños.',
        icon: IconUsersGroup,
      },
    ],
  },
  hispanicMinistry: {
    en: [
      {
        label: 'Best for',
        value:
          'Spanish-speaking neighbors, bilingual families, and anyone seeking cross-cultural Christian community.',
        icon: IconLanguage,
      },
      {
        label: 'Focus',
        value: 'Pastoral care, language, belonging, and shared congregational life.',
        icon: IconHeartHandshake,
      },
      {
        label: 'Next step',
        value: 'Contact the church to connect with the ministry team.',
        icon: IconMessage,
      },
    ],
    es: [
      {
        label: 'Ideal para',
        value:
          'Vecinos de habla hispana, familias bilingües y personas que buscan comunidad cristiana intercultural.',
        icon: IconLanguage,
      },
      {
        label: 'Enfoque',
        value: 'Cuidado pastoral, idioma, pertenencia y vida congregacional compartida.',
        icon: IconHeartHandshake,
      },
      {
        label: 'Próximo paso',
        value: 'Contactar a la iglesia para conectarse con el equipo del ministerio.',
        icon: IconMessage,
      },
    ],
  },
  serviceAndOutreach: {
    en: [
      {
        label: 'Best for',
        value: 'People who want to serve neighbors through outreach, events, partnerships, and practical care.',
        icon: IconHeartHandshake,
      },
      {
        label: 'Opportunities',
        value: 'Community events, chaplaincy, older adult care, and shared use of church space.',
        icon: IconBuildingCommunity,
      },
      {
        label: 'Next step',
        value: 'Ask where current help is needed.',
        icon: IconMessage,
      },
    ],
    es: [
      {
        label: 'Ideal para',
        value:
          'Personas que quieren servir a sus vecinos mediante proyectos, eventos, alianzas y cuidado práctico.',
        icon: IconHeartHandshake,
      },
      {
        label: 'Oportunidades',
        value:
          'Eventos comunitarios, capellanía, cuidado de adultos mayores y uso compartido del espacio de la iglesia.',
        icon: IconBuildingCommunity,
      },
      {
        label: 'Próximo paso',
        value: 'Preguntar dónde se necesita ayuda ahora.',
        icon: IconMessage,
      },
    ],
  },
};

function getMinistryLanguage(locale: ReturnType<typeof useLocale>): MinistryLanguage {
  return String(locale).startsWith('es') ? 'es' : 'en';
}

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

function AtAGlance({
  ministryId,
  locale,
}: {
  ministryId: MinistryPageId;
  locale: ReturnType<typeof useLocale>;
}) {
  const language = getMinistryLanguage(locale);
  const copy = MINISTRY_UI_COPY[language];
  const facts = MINISTRY_QUICK_FACTS[ministryId][language];

  return (
    <section aria-labelledby={`${ministryId}-glance-title`} className={classes.glanceSection}>
      <Paper withBorder className={classes.glancePanel}>
        <div className={classes.glanceHeading}>
          <div>
            <Text className={classes.eyebrow}>{copy.glanceEyebrow}</Text>
            <Title id={`${ministryId}-glance-title`} order={2} mt="xs">
              {copy.glanceTitle}
            </Title>
          </div>
        </div>

        <div className={classes.glanceList}>
          {facts.map((fact) => {
            const Icon = fact.icon;

            return (
              <Paper key={fact.label} withBorder className={classes.glanceItem}>
                <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                  <Icon size={21} stroke={1.7} />
                </ThemeIcon>
                <div>
                  <Title order={3}>{fact.label}</Title>
                  <Text c="dimmed" mt={4}>
                    {fact.value}
                  </Text>
                </div>
              </Paper>
            );
          })}
        </div>
      </Paper>
    </section>
  );
}

function WhatToExpectList({ highlights }: { highlights: LocalizedMinistryPage['highlights'] }) {
  return (
    <div className={classes.expectationList}>
      {highlights.map((highlight) => {
        const Icon = getItemIcon(highlight.id);

        return (
          <Paper key={highlight.id} component="article" withBorder className={classes.expectationCard}>
            <ThemeIcon size={42} radius="xl" variant="light" color="moss">
              <Icon size={21} stroke={1.7} />
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

function MinistryFinalCta({
  ministry,
  ministryId,
  locale,
}: {
  ministry: LocalizedMinistryPage;
  ministryId: MinistryPageId;
  locale: ReturnType<typeof useLocale>;
}) {
  const language = getMinistryLanguage(locale);
  const copy = MINISTRY_UI_COPY[language];

  return (
    <section aria-labelledby={`${ministryId}-cta-title`} className={classes.finalCtaSection}>
      <Paper withBorder className={classes.finalCtaCard}>
        <Stack gap="lg">
          <div>
            <Text className={classes.eyebrow}>{copy.finalCtaEyebrow}</Text>
            <Title id={`${ministryId}-cta-title`} order={2} mt="xs">
              {ministry.ctaTitle}
            </Title>
            <Text c="dimmed" size="lg" mt="sm" maw={720}>
              {ministry.ctaCopy}
            </Text>
          </div>

          <Group gap="sm" className={classes.finalCtaActions}>
            {ministry.actions.map((action) => (
              <MinistryActionButton key={action.id} action={action} ministryId={ministryId} />
            ))}
          </Group>
        </Stack>
      </Paper>
    </section>
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
      {features.map((feature, index) => {
        const Icon = getItemIcon(feature.id);
        const featureImage = assets[feature.id];
        const itemNumber = String(index + 1).padStart(2, '0');

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
              <Group justify="space-between" align="flex-start">
                <Text component="span" className={classes.programNumber}>
                  {itemNumber}
                </Text>
                <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                  <Icon size={23} stroke={1.7} />
                </ThemeIcon>
              </Group>
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
  const language = getMinistryLanguage(locale);
  const copy = MINISTRY_UI_COPY[language];
  const content = getContent(locale);
  const ministry = content.ministries.pages[ministryId];
  const assets = ministryPageAssets[ministryId];
  const relatedCards = content.community.cards.filter((card) => card.routeId !== ministryId);
  const heroActions = ministry.actions.slice(0, 2);

  return (
    <>
      <section
        className={classes.hero}
        data-ministry={ministryId}
        aria-labelledby={`${ministryId}-title`}
      >
        <Container size="xl" className={classes.heroInner}>
          <Paper withBorder className={classes.heroCard}>
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={0} className={classes.heroGrid}>
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

                  {heroActions.length > 0 ? (
                    <Group gap="sm" mt="xl" className={classes.heroActions}>
                      {heroActions.map((action) => (
                        <MinistryActionButton
                          key={action.id}
                          action={action}
                          ministryId={ministryId}
                        />
                      ))}
                    </Group>
                  ) : null}
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
          </Paper>
        </Container>
      </section>

      <Container size="xl" py={{ base: '3rem', md: '5rem' }}>
        <Stack className={classes.pageStack} data-ministry={ministryId}>
          <AtAGlance ministryId={ministryId} locale={locale} />

          <section aria-labelledby={`${ministryId}-intro-title`} className={classes.introSection}>
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
              <div>
                <Text className={classes.eyebrow}>{ministry.introEyebrow}</Text>
                <Title id={`${ministryId}-intro-title`} order={2} mt="sm" maw={680}>
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
            </SimpleGrid>
          </section>

          <section
            aria-labelledby={`${ministryId}-expect-title`}
            className={classes.highlightsSection}
          >
            <div className={classes.sectionHeading}>
              <div>
                <Text className={classes.eyebrow}>{copy.expectEyebrow}</Text>
                <Title id={`${ministryId}-expect-title`} order={2} mt="xs">
                  {ministry.highlightsTitle}
                </Title>
              </div>
              <Text c="dimmed" size="lg" maw={520}>
                {ministry.description}
              </Text>
            </div>

            <WhatToExpectList highlights={ministry.highlights} />
          </section>

          <MinistryFeatures ministry={ministry} ministryId={ministryId} assets={assets.features} />

          <MinistryFinalCta ministry={ministry} ministryId={ministryId} locale={locale} />

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
