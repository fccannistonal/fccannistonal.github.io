import type { ComponentType } from 'react';
import {
  IconArrowRight,
  IconBell,
  IconHeartHandshake,
  IconMessageCircleHeart,
  IconMusic,
  IconSparkles,
  IconTheater,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Paper, Text, ThemeIcon, Title } from '@mantine/core';
import { ResponsiveImage } from '../components/church/ResponsiveImage';
import {
  diversityTheaterAssets,
  ministryPageAssets,
  photoAssets,
  type PhotoAsset,
} from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Community.page.module.css';

const CARD_ICONS: Record<string, ComponentType<{ size?: number; stroke?: number }>> = {
  worship: IconMusic,
  children: IconSparkles,
  hispanic: IconMessageCircleHeart,
  theater: IconTheater,
  outreach: IconHeartHandshake,
  updates: IconBell,
};

type CommunityImageProps = {
  image: PhotoAsset;
  alt: string;
  className: string;
  loading?: 'eager' | 'lazy';
  sizes: string;
};

function CommunityImage({ image, alt, className, loading = 'lazy', sizes }: CommunityImageProps) {
  return (
    <ResponsiveImage
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      loading={loading}
      fetchPriority={loading === 'eager' ? 'high' : 'auto'}
      className={className}
      style={{ objectPosition: image.objectPosition }}
    />
  );
}

export function CommunityPage() {
  const locale = useLocale();
  const content = getContent(locale);
  const welcomeArea = photoAssets.find((photo) => photo.id === 'welcome-area') ?? photoAssets[0];
  const heroImage = ministryPageAssets.wonderAndWorship.hero;
  const cardPresentation: Record<string, { image: PhotoAsset; alt: string }> = {
    worship: {
      image: ministryPageAssets.worshipAndMusic.hero,
      alt: content.ministries.pages.worshipAndMusic.heroAlt,
    },
    children: {
      image: ministryPageAssets.wonderAndWorship.hero,
      alt: content.ministries.pages.wonderAndWorship.heroAlt,
    },
    hispanic: {
      image: ministryPageAssets.hispanicMinistry.hero,
      alt: content.ministries.pages.hispanicMinistry.heroAlt,
    },
    theater: {
      image: diversityTheaterAssets.heroImage,
      alt: content.theater.imageAlts[diversityTheaterAssets.heroImage.id],
    },
    outreach: {
      image: ministryPageAssets.serviceAndOutreach.hero,
      alt: content.ministries.pages.serviceAndOutreach.heroAlt,
    },
    updates: {
      image: welcomeArea,
      alt: content.home.photos['welcome-area'].alt,
    },
  };

  return (
    <>
      <section className={classes.hero} aria-labelledby="community-title">
        <Container size="xl" className={classes.heroInner}>
          <div className={classes.heroLayout}>
            <div className={classes.heroCopy}>
              <Text className={classes.eyebrow}>{content.community.eyebrow}</Text>
              <Title id="community-title" order={1} className={classes.heroTitle}>
                {content.community.title}
              </Title>
              <Text size="xl" className={classes.heroDescription}>
                {content.community.description}
              </Text>
              <Group gap="sm" mt="xl" className={classes.heroActions}>
                <Button
                  component="a"
                  href="#community-pathways"
                  size="lg"
                  rightSection={<IconArrowRight size={18} aria-hidden="true" />}
                >
                  {content.common.learnMore}
                </Button>
                <Button
                  component={Link}
                  to={getLocalizedPath('contact', locale)}
                  size="lg"
                  variant="light"
                  rightSection={<IconArrowRight size={18} aria-hidden="true" />}
                >
                  {content.community.invitationCta}
                </Button>
              </Group>
            </div>

            <figure className={classes.heroFigure}>
              <CommunityImage
                image={heroImage}
                alt={content.home.photos['childrens-moment'].alt}
                className={classes.heroImage}
                loading="eager"
                sizes="(max-width: 62em) 100vw, 44vw"
              />
              <figcaption className={classes.heroCaption}>
                <Text component="span" className={classes.captionEyebrow}>
                  {content.home.galleryEyebrow}
                </Text>
                <Text component="strong">{content.home.galleryTitle}</Text>
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <Container size="xl" py={{ base: '3rem', md: '5rem' }}>
        <section id="community-pathways" aria-labelledby="community-pathways-title">
          <div className={classes.sectionHeading}>
            <div>
              <Text className={classes.eyebrow}>{content.ministries.relatedEyebrow}</Text>
              <Title id="community-pathways-title" order={2}>
                {content.ministries.relatedTitle}
              </Title>
            </div>
            <Text c="dimmed" size="lg">
              {content.ministries.relatedCopy}
            </Text>
          </div>

          <ul className={classes.pathwayList}>
            {content.community.cards.map((card) => {
              const Icon = CARD_ICONS[card.id] ?? IconSparkles;
              const href = card.routeId ? getLocalizedPath(card.routeId, locale) : card.href;
              const presentation = cardPresentation[card.id] ?? cardPresentation.updates;

              return (
                <li key={card.id}>
                  <Paper
                    component={Link}
                    to={href ?? getLocalizedPath('contact', locale)}
                    withBorder
                    className={classes.pathwayCard}
                    data-community-card={card.id}
                    aria-label={`${content.common.learnMore}: ${card.title}`}
                  >
                    <CommunityImage
                      image={presentation.image}
                      alt={presentation.alt}
                      className={classes.pathwayImage}
                      sizes="(max-width: 48em) 100vw, (max-width: 75em) 45vw, 30vw"
                    />
                    <div className={classes.pathwayBody}>
                      <ThemeIcon size={44} radius="xl" variant="light" color="brand">
                        <Icon size={22} stroke={1.7} />
                      </ThemeIcon>
                      <div className={classes.pathwayText}>
                        <Title order={3}>{card.title}</Title>
                        <Text c="dimmed" mt="xs">
                          {card.description}
                        </Text>
                      </div>
                      <Text className={classes.cardCta} aria-hidden="true">
                        {content.common.learnMore} <IconArrowRight size={16} />
                      </Text>
                    </div>
                  </Paper>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={classes.invitation} aria-labelledby="community-invitation-title">
          <div className={classes.invitationCopy}>
            <Text className={classes.eyebrow}>{content.community.eyebrow}</Text>
            <Title id="community-invitation-title" order={2}>
              {content.community.invitationTitle}
            </Title>
            <Text c="dimmed" size="lg">
              {content.community.invitationCopy}
            </Text>
          </div>
          <div className={classes.invitationAction}>
            <Button
              component={Link}
              to={getLocalizedPath('contact', locale)}
              size="lg"
              rightSection={<IconArrowRight size={18} />}
            >
              {content.community.invitationCta}
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
}
