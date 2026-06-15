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
import { HomeHero } from '../components/church/HomeHero';
import { photoSlides, siteConfig } from '../content/churchContent';
import { trackGivingIntent } from '../lib/googleAnalytics';
import classes from './Home.page.module.css';

export function HomePage() {
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
    photoSlides.length
  );
  const galleryStatus =
    firstVisiblePhoto === lastVisiblePhoto
      ? `Photo ${firstVisiblePhoto} of ${photoSlides.length}`
      : `Photos ${firstVisiblePhoto}–${lastVisiblePhoto} of ${photoSlides.length}`;

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
                    Welcome
                  </Badge>
                  <Title id="welcome-title" order={2} mt="md">
                    {siteConfig.welcomeTitle}
                  </Title>
                  <Stack gap="md" mt="md">
                    {siteConfig.welcomeParagraphs.map((paragraph) => (
                      <Text key={paragraph} c="dimmed" size="lg">
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>

                  <Title order={3} mt="xl">
                    Join us on Sundays for worship and connection
                  </Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt="md">
                    {siteConfig.serviceTimes.map((service) => (
                      <Paper key={service.label} withBorder p="md">
                        <Group wrap="nowrap">
                          <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                            <IconClock size={21} stroke={1.7} />
                          </ThemeIcon>
                          <div>
                            <Text fw={700}>{service.label}</Text>
                            <Text c="dimmed">{service.time}</Text>
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>
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
                    alt="Stone exterior of First Christian Church Anniston framed by a large tree at sunset"
                    label="First Christian Church Anniston"
                    ratio={4 / 5}
                    objectPosition="62% 52%"
                    className={classes.exteriorImage}
                  />
                  <figcaption className={classes.exteriorCaption}>
                    <Badge variant="light" color="brand">
                      Our church
                    </Badge>
                    <Title order={3} mt="sm">
                      First Christian Church Anniston
                    </Title>
                    <Text c="dimmed" mt={4}>
                      A welcoming spiritual home in Anniston, Alabama.
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
                        Listen online
                      </Text>
                      <Title id="sermons-title" order={2}>
                        Uplifting Sermons by Pastor Laura Hutchinson
                      </Title>
                    </div>
                  </Group>

                  <div className={classes.spotifyFrame}>
                    <iframe
                      src={siteConfig.sermonEmbedUrl}
                      title="Uplifting Sermons by Pastor Laura Hutchinson on Spotify"
                      width="100%"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className={classes.spotifyEmbed}
                    />
                  </div>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 5 }}>
                <Paper
                  id="give"
                  withBorder
                  p={{ base: 'lg', md: 'xl' }}
                  h="100%"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255, 249, 241, 0.98), rgba(244, 234, 220, 0.9))',
                  }}
                >
                  <ThemeIcon size={50} radius="xl" variant="light" color="green">
                    <IconHeartHandshake size={26} stroke={1.7} />
                  </ThemeIcon>
                  <Title order={2} mt="md">
                    Partner with Us Financially
                  </Title>
                  <Text c="dimmed" mt="md" size="lg">
                    {siteConfig.givingCopy}
                  </Text>
                  <Group mt="xl">
                    <Button
                      component="a"
                      href={siteConfig.givingFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      size="lg"
                      color="green"
                      leftSection={<IconHeartHandshake size={20} />}
                      onClick={trackGivingIntent}
                    >
                      Give
                    </Button>
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </section>

          <section aria-labelledby="gallery-title">
            <div className={classes.galleryHeader}>
              <div>
                <Text
                  fw={700}
                  tt="uppercase"
                  c="#8c633d"
                  size="sm"
                  style={{ letterSpacing: '0.18em' }}
                >
                  Life at FCC Anniston
                </Text>
                <Title id="gallery-title" order={2} mt="xs">
                  Come Check Us Out!
                </Title>
                <Group gap="xs" mt="sm" className={classes.galleryHint}>
                  <IconSwipe size={20} stroke={1.7} aria-hidden="true" />
                  <Text size="sm" fw={600}>
                    Swipe or drag to explore
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
                  {galleryStatus}
                </Text>
                <Group gap="sm" wrap="nowrap">
                  <ActionIcon
                    type="button"
                    size={46}
                    radius="xl"
                    variant="default"
                    aria-label="Previous photos"
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
                    aria-label="Next photos"
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
              aria-label="Life at First Christian Church photo gallery"
              className={classes.galleryCarousel}
            >
              {photoSlides.map((slide) => (
                <Carousel.Slide key={slide.id} className={classes.gallerySlide}>
                  <Paper
                    component="figure"
                    withBorder
                    p="md"
                    m={0}
                    h="100%"
                    className={classes.galleryCard}
                  >
                    <ContentImage
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      label={slide.title}
                      ratio={4 / 3}
                      objectPosition={slide.objectPosition}
                      className={classes.galleryImage}
                    />
                    <figcaption className={classes.galleryCaption}>
                      <Title order={3}>{slide.title}</Title>
                      <Text c="dimmed" mt="xs">
                        {slide.caption}
                      </Text>
                    </figcaption>
                  </Paper>
                </Carousel.Slide>
              ))}
            </Carousel>
          </section>

          <section aria-labelledby="connect-title">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.connectPanel}>
              <Grid gutter={{ base: 'xl', md: '3rem' }} align="center">
                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Badge variant="light" color="moss">
                    Stay connected
                  </Badge>
                  <Title id="connect-title" order={2} mt="md">
                    Keep up with life at FCC Anniston
                  </Title>
                  <Text c="dimmed" size="lg" mt="md">
                    Follow along between Sundays for church news, upcoming events, photos, sermons,
                    giving, and helpful resources.
                  </Text>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {siteConfig.socialLinks.map((link) => {
                      const Icon = link.id === 'facebook' ? IconBrandFacebook : IconBrandLinktree;

                      return (
                        <Paper
                          key={link.id}
                          component="a"
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          withBorder
                          p="lg"
                          className={classes.socialCard}
                          aria-label={`${link.cta} (opens in a new tab)`}
                        >
                          <Group justify="space-between" align="flex-start" wrap="nowrap">
                            <ThemeIcon
                              size={48}
                              radius="xl"
                              variant="light"
                              color={link.id === 'facebook' ? 'blue' : 'moss'}
                            >
                              <Icon size={25} stroke={1.8} />
                            </ThemeIcon>
                            <IconArrowUpRight
                              className={classes.socialArrow}
                              size={21}
                              stroke={1.8}
                            />
                          </Group>
                          <Title order={3} mt="lg">
                            {link.title}
                          </Title>
                          <Text c="dimmed" mt="xs">
                            {link.description}
                          </Text>
                          <Text className={classes.socialCta} mt="lg">
                            {link.cta}
                          </Text>
                        </Paper>
                      );
                    })}
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
                    Find us
                  </Badge>
                  <Title id="map-title" order={2} mt="md">
                    Visit First Christian Church
                  </Title>
                  <Group gap="sm" align="flex-start" wrap="nowrap" mt="lg">
                    <ThemeIcon size={38} radius="xl" variant="light" color="brand">
                      <IconMapPin size={20} stroke={1.7} />
                    </ThemeIcon>
                    <div>
                      <Text fw={700}>First Christian Church Anniston</Text>
                      <Text c="dimmed">Anniston, Alabama</Text>
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
                    {siteConfig.serviceNotes.map((note) => (
                      <List.Item key={note}>
                        <Text c="dimmed">{note}</Text>
                      </List.Item>
                    ))}
                  </List>

                  <Button component={Link} to="/contact" mt="xl">
                    Contact the church
                  </Button>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper withBorder p={0} radius="xl" style={{ overflow: 'hidden', minHeight: 420 }}>
                  <iframe
                    src={siteConfig.mapEmbedUrl}
                    title="Map showing the church's Anniston location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ width: '100%', minHeight: 420 }}
                  />
                </Paper>
              </Grid.Col>
            </Grid>
          </section>
        </Stack>
      </Container>
    </>
  );
}
