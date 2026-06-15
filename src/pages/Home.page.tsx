import { useEffect, useState } from 'react';
import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconBrandLinktree,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconHeartHandshake,
  IconMapPin,
  IconMicrophone2,
  IconSparkles,
  IconSwipe,
} from '@tabler/icons-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { Link } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Grid,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ContentImage } from '../components/church/ContentImage';
import { DeferredEmbed } from '../components/church/DeferredEmbed';
import { HomeHero } from '../components/church/HomeHero';
import { photoAssets, siteConfig } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { trackGivingIntent, trackVisitPlanningIntent } from '../lib/googleAnalytics';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Home.page.module.css';

export function HomePage() {
  const locale = useLocale();
  const content = getContent(locale);
  const [galleryApi, setGalleryApi] = useState<EmblaCarouselType | null>(null);
  const [selectedGallerySlide, setSelectedGallerySlide] = useState(0);
  const [canScrollGalleryPrevious, setCanScrollGalleryPrevious] = useState(false);
  const [canScrollGalleryNext, setCanScrollGalleryNext] = useState(true);
  const showsThreeGalleryCards = useMediaQuery('(min-width: 75em)');
  const showsTwoGalleryCards = useMediaQuery('(min-width: 48em)');

  useEffect(() => {
    if (!galleryApi) {
      return;
    }

    const updateGalleryState = () => {
      setSelectedGallerySlide(galleryApi.selectedScrollSnap());
      setCanScrollGalleryPrevious(galleryApi.canScrollPrev());
      setCanScrollGalleryNext(galleryApi.canScrollNext());
    };

    updateGalleryState();
    galleryApi.on('select', updateGalleryState);
    galleryApi.on('reInit', updateGalleryState);
    galleryApi.on('resize', updateGalleryState);

    return () => {
      galleryApi.off('select', updateGalleryState);
      galleryApi.off('reInit', updateGalleryState);
      galleryApi.off('resize', updateGalleryState);
    };
  }, [galleryApi]);

  const visibleGalleryCardCount = showsThreeGalleryCards ? 3 : showsTwoGalleryCards ? 2 : 1;
  const firstVisiblePhoto = selectedGallerySlide + 1;
  const lastVisiblePhoto = Math.min(
    firstVisiblePhoto + visibleGalleryCardCount - 1,
    photoAssets.length
  );

  return (
    <>
      <HomeHero />

      <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
        <Stack gap="4rem">
          <section id="welcome" aria-labelledby="welcome-title">
            <Grid gutter="xl" align="stretch">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper withBorder p={{ base: 'lg', md: 'xl' }} h="100%">
                  <Badge variant="light" color="brand">
                    {content.home.welcomeEyebrow}
                  </Badge>
                  <Title id="welcome-title" order={2} mt="md">
                    {content.home.welcomeTitle}
                  </Title>
                  <Stack gap="md" mt="md">
                    {content.home.welcomeParagraphs.map((paragraph) => (
                      <Text key={paragraph} c="dimmed" size="lg">
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="xl">
                    {siteConfig.serviceTimes.map((service) => (
                      <Paper key={service.id} withBorder p="md">
                        <Group wrap="nowrap">
                          <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                            <IconClock size={21} stroke={1.7} />
                          </ThemeIcon>
                          <div>
                            <Text fw={700}>{content.common.serviceLabels[service.id]}</Text>
                            <Text c="dimmed">{service.time}</Text>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>

                  <Button
                    component={Link}
                    to={getLocalizedPath('visit', locale)}
                    mt="xl"
                    variant="light"
                    onClick={() => trackVisitPlanningIntent('home-welcome', locale)}
                  >
                    {content.home.welcomeCta}
                  </Button>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper
                  component="figure"
                  withBorder
                  p="md"
                  m={0}
                  h="100%"
                  className={classes.exteriorCard}
                >
                  <ContentImage
                    src={siteConfig.exteriorImageSrc}
                    alt={content.home.churchImageAlt}
                    label={content.home.churchImageLabel}
                    width={siteConfig.exteriorImageWidth}
                    height={siteConfig.exteriorImageHeight}
                    ratio={4 / 5}
                    sizes="(max-width: 48em) 100vw, 40vw"
                    objectPosition="62% 52%"
                    className={classes.exteriorImage}
                  />
                  <figcaption className={classes.exteriorCaption}>
                    <Badge variant="light" color="brand">
                      {content.home.welcomeEyebrow}
                    </Badge>
                    <Title order={3} mt="sm">
                      {content.home.churchImageLabel}
                    </Title>
                    <Text c="dimmed" mt={4}>
                      {content.home.churchImageCaption}
                    </Text>
                  </figcaption>
                </Paper>
              </Grid.Col>
            </Grid>
          </section>

          <section aria-labelledby="sermons-title">
            <Grid gutter="xl" align="stretch">
              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper withBorder p={{ base: 'lg', md: 'xl' }} h="100%">
                  <Group gap="sm">
                    <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                      <IconMicrophone2 size={21} stroke={1.7} />
                    </ThemeIcon>
                    <div>
                      <Text fw={700} tt="uppercase" c="#8c633d" size="sm">
                        {content.home.sermonsEyebrow}
                      </Text>
                      <Title id="sermons-title" order={2}>
                        {content.home.sermonsTitle}
                      </Title>
                    </div>
                  </Group>
                  <Text c="dimmed" mt="md">
                    {content.home.sermonsDescription}
                  </Text>
                  <DeferredEmbed
                    provider="Spotify"
                    title={content.home.sermonsTitle}
                    description={content.home.sermonsDescription}
                    loadLabel={content.home.loadSermons}
                    src={siteConfig.sermonEmbedUrl}
                    externalUrl={siteConfig.sermonUrl}
                    externalLabel={content.home.sermonsEyebrow}
                    iframeTitle={content.home.sermonsTitle}
                    connectionNote={content.common.embedConnectionNote('Spotify')}
                    minHeight="10rem"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className={classes.spotifyFrame}
                  />
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper id="give" withBorder p={{ base: 'lg', md: 'xl' }} h="100%">
                  <ThemeIcon size={50} radius="xl" variant="light" color="green">
                    <IconHeartHandshake size={26} stroke={1.7} />
                  </ThemeIcon>
                  <Title order={2} mt="md">
                    {content.home.givingTitle}
                  </Title>
                  <Text c="dimmed" mt="md" size="lg">
                    {content.home.givingCopy}
                  </Text>
                  <Button
                    component="a"
                    href={siteConfig.givingFormUrl}
                    target="_blank"
                    rel="noreferrer"
                    mt="xl"
                    size="lg"
                    color="green"
                    leftSection={<IconHeartHandshake size={20} />}
                    onClick={() => trackGivingIntent(locale)}
                  >
                    {content.common.give}
                  </Button>
                </Paper>
              </Grid.Col>
            </Grid>
          </section>

          <section aria-labelledby="gallery-title">
            <div className={classes.galleryHeader}>
              <div>
                <Text fw={700} tt="uppercase" c="#8c633d" size="sm" lts="0.18em">
                  {content.home.galleryEyebrow}
                </Text>
                <Title id="gallery-title" order={2} mt="xs">
                  {content.home.galleryTitle}
                </Title>
                <Group gap="xs" mt="sm" className={classes.galleryHint}>
                  <IconSwipe size={20} stroke={1.7} aria-hidden="true" />
                  <Text size="sm" fw={600}>
                    {content.home.galleryHint}
                  </Text>
                </Group>
              </div>

              <div className={classes.galleryNavigation}>
                <Text
                  className={classes.galleryStatus}
                  size="sm"
                  fw={700}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {content.home.photoStatus(
                    firstVisiblePhoto,
                    lastVisiblePhoto,
                    photoAssets.length
                  )}
                </Text>
                <Group gap="sm" wrap="nowrap">
                  <ActionIcon
                    type="button"
                    size={46}
                    radius="xl"
                    variant="default"
                    aria-label={content.home.previousPhotos}
                    disabled={!canScrollGalleryPrevious}
                    onClick={() => galleryApi?.scrollPrev()}
                    className={classes.galleryControl}
                  >
                    <IconChevronLeft size={24} stroke={1.8} />
                  </ActionIcon>
                  <ActionIcon
                    type="button"
                    size={46}
                    radius="xl"
                    variant="filled"
                    color="brand"
                    aria-label={content.home.nextPhotos}
                    disabled={!canScrollGalleryNext}
                    onClick={() => galleryApi?.scrollNext()}
                    className={classes.galleryControl}
                  >
                    <IconChevronRight size={24} stroke={1.8} />
                  </ActionIcon>
                </Group>
              </div>
            </div>

            <Carousel
              slideSize={{ base: '86%', sm: '47%', lg: '32%' }}
              slideGap="lg"
              emblaOptions={{ align: 'start' }}
              getEmblaApi={setGalleryApi}
              withControls={false}
              role="region"
              aria-label={content.home.galleryLabel}
              className={classes.galleryCarousel}
            >
              {photoAssets.map((photo) => {
                const localizedPhoto = content.home.photos[photo.id];

                return (
                  <Carousel.Slide key={photo.id} className={classes.gallerySlide}>
                    <Paper
                      component="figure"
                      withBorder
                      p="md"
                      m={0}
                      h="100%"
                      className={classes.galleryCard}
                    >
                      <ContentImage
                        src={photo.src}
                        alt={localizedPhoto.alt}
                        label={localizedPhoto.title}
                        width={photo.width}
                        height={photo.height}
                        ratio={4 / 3}
                        sizes="(max-width: 48em) 86vw, (max-width: 75em) 47vw, 32vw"
                        objectPosition={photo.objectPosition}
                        className={classes.galleryImage}
                      />
                      <figcaption className={classes.galleryCaption}>
                        <Title order={3}>{localizedPhoto.title}</Title>
                        <Text c="dimmed" mt="xs">
                          {localizedPhoto.caption}
                        </Text>
                      </figcaption>
                    </Paper>
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </section>

          <section aria-labelledby="connect-title">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.connectPanel}>
              <Grid gutter={{ base: 'xl', md: '3rem' }} align="center">
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Badge variant="light" color="moss">
                    {content.home.connectEyebrow}
                  </Badge>
                  <Title id="connect-title" order={2} mt="md">
                    {content.home.connectTitle}
                  </Title>
                  <Text c="dimmed" size="lg" mt="md">
                    {content.home.connectCopy}
                  </Text>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {[
                      {
                        id: 'facebook',
                        href: siteConfig.facebookUrl,
                        title: content.common.social.facebookTitle,
                        description: content.common.social.facebookDescription,
                        cta: content.common.social.facebookCta,
                        icon: IconBrandFacebook,
                        color: 'blue',
                      },
                      {
                        id: 'linktree',
                        href: siteConfig.linktreeUrl,
                        title: content.common.social.linktreeTitle,
                        description: content.common.social.linktreeDescription,
                        cta: content.common.social.linktreeCta,
                        icon: IconBrandLinktree,
                        color: 'moss',
                      },
                    ].map((social) => (
                      <Paper
                        key={social.id}
                        component="a"
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        withBorder
                        p="lg"
                        className={classes.socialCard}
                        aria-label={`${social.cta} (${content.common.opensNewTab})`}
                      >
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          <ThemeIcon size={48} radius="xl" variant="light" color={social.color}>
                            <social.icon size={25} stroke={1.8} />
                          </ThemeIcon>
                          <IconArrowUpRight
                            className={classes.socialArrow}
                            size={21}
                            stroke={1.8}
                          />
                        </Group>
                        <Title order={3} mt="lg">
                          {social.title}
                        </Title>
                        <Text c="dimmed" mt="xs">
                          {social.description}
                        </Text>
                        <Text className={classes.socialCta} mt="lg">
                          {social.cta}
                        </Text>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </Grid.Col>
              </Grid>
            </Paper>
          </section>

          <section aria-labelledby="map-title">
            <Grid gutter="xl" align="stretch">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper withBorder p={{ base: 'lg', md: 'xl' }} h="100%">
                  <Badge variant="light" color="moss">
                    {content.home.visitEyebrow}
                  </Badge>
                  <Title id="map-title" order={2} mt="md">
                    {content.home.visitTitle}
                  </Title>
                  <Text c="dimmed" mt="md">
                    {content.home.visitCopy}
                  </Text>
                  <Group gap="sm" align="flex-start" wrap="nowrap" mt="lg">
                    <ThemeIcon size={38} radius="xl" variant="light" color="brand">
                      <IconMapPin size={20} stroke={1.7} />
                    </ThemeIcon>
                    <div>
                      <Text fw={700}>{content.common.churchName}</Text>
                      <Text c="dimmed">{siteConfig.addressLines.join(', ')}</Text>
                    </div>
                  </Group>
                  <List
                    mt="xl"
                    spacing="sm"
                    icon={
                      <ThemeIcon color="moss" variant="light" radius="xl" size={28}>
                        <IconSparkles size={16} stroke={1.7} />
                      </ThemeIcon>
                    }
                  >
                    {content.home.visitNotes.map((note) => (
                      <List.Item key={note}>
                        <Text c="dimmed">{note}</Text>
                      </List.Item>
                    ))}
                  </List>
                  <Button
                    component={Link}
                    to={getLocalizedPath('visit', locale)}
                    mt="xl"
                    onClick={() => trackVisitPlanningIntent('home-map', locale)}
                  >
                    {content.home.primaryAction}
                  </Button>
                </Paper>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <DeferredEmbed
                  provider="Google Maps"
                  title={content.home.mapTitle}
                  description={siteConfig.addressLines.join(', ')}
                  loadLabel={content.home.loadMap}
                  src={siteConfig.mapEmbedUrl}
                  externalUrl={siteConfig.directionsUrl}
                  externalLabel={content.common.directions}
                  iframeTitle={content.home.mapTitle}
                  connectionNote={content.common.embedConnectionNote('Google Maps')}
                  minHeight="26rem"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Grid.Col>
            </Grid>
          </section>
        </Stack>
      </Container>
    </>
  );
}
