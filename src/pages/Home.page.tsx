import { useEffect } from 'react';
import {
  IconClock,
  IconHeartHandshake,
  IconMapPin,
  IconMicrophone2,
  IconSparkles,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Carousel } from '@mantine/carousel';
import {
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
import { ContentImage } from '../components/church/ContentImage';
import { HomeHero } from '../components/church/HomeHero';
import { photoSlides, siteConfig } from '../content/churchContent';
import classes from './Home.page.module.css';

function TithelyGiveButton() {
  useEffect(() => {
    if (document.querySelector('script[data-tithely-give-script]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://static.tithely.com/give/give.js';
    script.defer = true;
    script.dataset.tithelyGiveScript = 'true';
    document.body.appendChild(script);
  }, []);

  return (
    <Button
      type="button"
      size="lg"
      color="green"
      className="tithely-give-button"
      data-form={siteConfig.givingFormId}
      leftSection={<IconHeartHandshake size={20} />}
    >
      Give
    </Button>
  );
}

export function HomePage() {
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

                  <iframe
                    src={siteConfig.sermonEmbedUrl}
                    title="Uplifting Sermons by Pastor Laura Hutchinson on Spotify"
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: 12, marginTop: '1.5rem' }}
                  />
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
                    <TithelyGiveButton />
                  </Group>
                </Paper>
              </Grid.Col>
            </Grid>
          </section>

          <section aria-labelledby="gallery-title">
            <Text fw={700} tt="uppercase" c="#8c633d" size="sm" style={{ letterSpacing: '0.18em' }}>
              Life at FCC Anniston
            </Text>
            <Title id="gallery-title" order={2} mt="xs" mb="lg">
              Come Check Us Out!
            </Title>

            <Carousel
              slideSize={{ base: '100%', sm: '50%', lg: '33.333333%' }}
              slideGap="lg"
              withIndicators
              emblaOptions={{ align: 'start' }}
              nextControlProps={{ 'aria-label': 'Next slide' }}
              previousControlProps={{ 'aria-label': 'Previous slide' }}
            >
              {photoSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <Paper withBorder p="md" h="100%">
                    <ContentImage
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      label={slide.title}
                      description="Photo placeholder"
                      ratio={4 / 3}
                    />
                    <Title order={3} mt="md">
                      {slide.title}
                    </Title>
                    <Text c="dimmed" mt="xs">
                      {slide.caption}
                    </Text>
                  </Paper>
                </Carousel.Slide>
              ))}
            </Carousel>
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
