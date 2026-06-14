import {
  IconArrowRight,
  IconHeartHandshake,
  IconMapPin,
  IconMicrophone2,
  IconSparkles,
  IconVideo,
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

const actionIcons = {
  podcast: IconMicrophone2,
  zoom: IconVideo,
  give: IconHeartHandshake,
} as const;

export function HomePage() {
  return (
    <>
      <HomeHero />

      <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
        <Stack gap="3rem">
          <section id="welcome">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
                <Badge variant="light" color="brand">
                  Welcome
                </Badge>
                <Title order={2} mt="md">
                  {siteConfig.welcomeTitle}
                </Title>
                <Stack gap="md" mt="md">
                  {siteConfig.welcomeParagraphs.map((paragraph) => (
                    <Text key={paragraph} c="dimmed" size="lg">
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </Paper>

              <Paper
                withBorder
                p={{ base: 'lg', md: 'xl' }}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 249, 241, 0.98), rgba(244, 234, 220, 0.9))',
                }}
              >
                <Badge variant="light" color="moss">
                  First visit
                </Badge>
                <Title order={3} mt="md">
                  A quick sense of what this site can hold
                </Title>
                <List
                  mt="lg"
                  spacing="md"
                  icon={
                    <ThemeIcon color="brand" variant="light" radius="xl" size={28}>
                      <IconSparkles size={16} stroke={1.7} />
                    </ThemeIcon>
                  }
                >
                  {siteConfig.visitHighlights.map((highlight) => (
                    <List.Item key={highlight}>
                      <Text c="dimmed">{highlight}</Text>
                    </List.Item>
                  ))}
                </List>
              </Paper>
            </SimpleGrid>
          </section>

          <section aria-labelledby="online-links-title">
            <Group justify="space-between" align="end" mb="lg">
              <div>
                <Text
                  fw={700}
                  tt="uppercase"
                  c="#8c633d"
                  size="sm"
                  style={{ letterSpacing: '0.18em' }}
                >
                  Connect online
                </Text>
                <Title id="online-links-title" order={2} mt="xs">
                  Listen, worship, and give online
                </Title>
              </div>
            </Group>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {siteConfig.homeActions.map((action) => {
                const Icon = actionIcons[action.id as keyof typeof actionIcons];

                return (
                  <Paper key={action.id} withBorder p="xl">
                    <ThemeIcon size={50} radius="xl" variant="light" color="brand">
                      <Icon size={26} stroke={1.7} />
                    </ThemeIcon>
                    <Title order={3} mt="md">
                      {action.title}
                    </Title>
                    <Text c="dimmed" mt="sm">
                      {action.description}
                    </Text>
                    <Button
                      component="a"
                      href={action.href}
                      target={action.external ? '_blank' : undefined}
                      rel={action.external ? 'noreferrer' : undefined}
                      variant="light"
                      mt="lg"
                      rightSection={<IconArrowRight size={18} />}
                    >
                      {action.cta}
                    </Button>
                  </Paper>
                );
              })}
            </SimpleGrid>
          </section>

          <section aria-labelledby="gallery-title">
            <Group justify="space-between" align="end" mb="lg">
              <div>
                <Text
                  fw={700}
                  tt="uppercase"
                  c="#8c633d"
                  size="sm"
                  style={{ letterSpacing: '0.18em' }}
                >
                  Photo carousel
                </Text>
                <Title id="gallery-title" order={2} mt="xs">
                  Life together at a glance
                </Title>
              </div>
            </Group>

            <Carousel
              slideSize={{ base: '100%', md: '50%' }}
              slideGap="lg"
              withIndicators
              emblaOptions={{ align: 'start' }}
              nextControlProps={{ 'aria-label': 'Next slide' }}
              previousControlProps={{ 'aria-label': 'Previous slide' }}
            >
              {photoSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <Paper withBorder p="md">
                    <ContentImage
                      src={slide.imageSrc}
                      alt={slide.imageAlt}
                      label={slide.title}
                      description="Add a church photo here when your image library is ready."
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
                    End the landing page with the church location
                  </Title>
                  <Text c="dimmed" mt="md">
                    The map is ready for the church’s final address while the text block gives
                    visitors a quick path to contact details and visit planning.
                  </Text>

                  <Stack gap="sm" mt="xl">
                    {siteConfig.addressLines.map((line) => (
                      <Group key={line} gap="sm" align="flex-start" wrap="nowrap">
                        <ThemeIcon size={34} radius="xl" variant="light" color="brand">
                          <IconMapPin size={18} stroke={1.7} />
                        </ThemeIcon>
                        <Text>{line}</Text>
                      </Group>
                    ))}
                  </Stack>

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
