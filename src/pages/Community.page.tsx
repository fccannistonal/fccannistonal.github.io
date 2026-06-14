import type { ComponentType } from 'react';
import {
  IconArrowDown,
  IconArrowUpRight,
  IconBrandFacebook,
  IconCalendarEvent,
  IconHeartHandshake,
  IconSparkles,
  IconTheater,
  IconTicket,
  IconUsersGroup,
} from '@tabler/icons-react';
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
import { diversityTheater, type TheaterImage as TheaterImageData } from '../content/churchContent';
import classes from './Community.page.module.css';

type TheaterImageProps = {
  image: TheaterImageData;
  className?: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
  srcSet?: string;
};

type ValueCardProps = {
  icon: ComponentType<{ size?: number; stroke?: number }>;
  title: string;
  description: string;
};

function TheaterImage({ image, className, loading = 'lazy', sizes, srcSet }: TheaterImageProps) {
  return (
    <picture className={className}>
      <img
        src={image.src}
        srcSet={srcSet}
        sizes={sizes}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={loading}
        decoding="async"
        style={{ objectPosition: image.objectPosition }}
      />
    </picture>
  );
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <Paper withBorder p="lg" className={classes.valueCard}>
      <ThemeIcon size={46} radius="xl" color="brand" variant="light">
        <Icon size={23} stroke={1.7} />
      </ThemeIcon>
      <Title order={3} mt="md">
        {title}
      </Title>
      <Text c="dimmed" mt="xs">
        {description}
      </Text>
    </Paper>
  );
}

export function CommunityPage() {
  const hero = diversityTheater.heroImage;

  return (
    <>
      <section className={classes.hero} aria-labelledby="community-title">
        <TheaterImage
          image={hero}
          className={classes.heroImage}
          loading="eager"
          sizes="100vw"
          srcSet={hero.srcSet}
        />
        <div className={classes.heroOverlay} />
        <Container size="xl" className={classes.heroInner}>
          <div className={classes.heroContent}>
            <Badge variant="filled" color="brand" size="lg" className={classes.heroBadge}>
              {diversityTheater.eyebrow}
            </Badge>
            <Title id="community-title" order={1} className={classes.heroTitle}>
              Diversity <span>Theater Company</span>
            </Title>
            <Text size="xl" className={classes.heroLead}>
              Stories that make room for every voice and reveal Christ-like love in action.
            </Text>
            <Group mt="xl">
              <Button
                component="a"
                href={diversityTheater.facebookUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
                color="brand"
                leftSection={<IconBrandFacebook size={20} />}
                rightSection={<IconArrowUpRight size={18} />}
              >
                Follow on Facebook
              </Button>
              <Button
                component="a"
                href="#about"
                size="lg"
                variant="white"
                color="dark"
                rightSection={<IconArrowDown size={18} />}
              >
                Discover our story
              </Button>
            </Group>
          </div>
        </Container>
      </section>

      <Container size="xl" py={{ base: '3rem', md: '6rem' }}>
        <Stack className={classes.pageStack}>
          <section id="about" aria-labelledby="about-title">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
              <div>
                <Text className={classes.eyebrow}>Storytelling with purpose</Text>
                <Title id="about-title" order={2} mt="sm" maw={620}>
                  A stage where belonging takes center place
                </Title>
              </div>
              <Stack gap="md">
                {diversityTheater.introduction.map((paragraph) => (
                  <Text key={paragraph} c="dimmed" size="lg">
                    {paragraph}
                  </Text>
                ))}
              </Stack>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt={{ base: 'xl', md: '3rem' }}>
              <ValueCard
                icon={IconTheater}
                title="Honest stories"
                description="Plays and musicals reflect LGBTQ lives with humor, poignancy, and humanity."
              />
              <ValueCard
                icon={IconHeartHandshake}
                title="Open hospitality"
                description="Every production offers a warm welcome to people who have not always felt embraced by church."
              />
              <ValueCard
                icon={IconUsersGroup}
                title="Stronger community"
                description="Shared experiences create space for unity, compassion, conversation, and understanding."
              />
            </SimpleGrid>
          </section>

          <section aria-labelledby="gallery-title">
            <div className={classes.sectionHeading}>
              <div>
                <Text className={classes.eyebrow}>On stage</Text>
                <Title id="gallery-title" order={2} mt="xs">
                  Theater brings us together
                </Title>
              </div>
              <Text c="dimmed" size="lg" maw={520}>
                {diversityTheater.missionStatement}
              </Text>
            </div>

            <div className={classes.gallery}>
              {diversityTheater.galleryImages.map((image, index) => (
                <figure
                  key={image.id}
                  className={`${classes.galleryItem} ${index === 0 ? classes.galleryItemFeatured : ''}`}
                >
                  <TheaterImage
                    image={image}
                    className={classes.galleryPicture}
                    sizes={
                      index === 0
                        ? '(max-width: 48em) 100vw, 58vw'
                        : '(max-width: 48em) 100vw, 29vw'
                    }
                  />
                  <figcaption className={classes.visuallyHidden}>{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="founder" aria-labelledby="founder-title">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.founderCard}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '3rem' }}>
                <div className={classes.founderImages}>
                  <TheaterImage
                    image={diversityTheater.founderPortrait}
                    className={classes.founderPortrait}
                    sizes="(max-width: 48em) 100vw, 40vw"
                  />
                  <TheaterImage
                    image={diversityTheater.founderActionImage}
                    className={classes.founderAction}
                    sizes="(max-width: 48em) 42vw, 18vw"
                  />
                </div>

                <Stack gap="md" justify="center" className={classes.founderContent}>
                  <Badge variant="light" color="brand" w="fit-content" size="lg">
                    Meet the {diversityTheater.founderRole}
                  </Badge>
                  <Title id="founder-title" order={2}>
                    {diversityTheater.founderName}
                  </Title>
                  {diversityTheater.founderBio.map((paragraph) => (
                    <Text key={paragraph} c="dimmed" size="lg">
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </SimpleGrid>
            </Paper>
          </section>

          <section aria-labelledby="updates-title">
            <Paper p={{ base: 'xl', md: '3rem' }} className={classes.updatesCard}>
              <div className={classes.updatesGlow} aria-hidden="true" />
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className={classes.updatesContent}>
                <div>
                  <Text className={classes.updatesEyebrow}>The next act</Text>
                  <Title id="updates-title" order={2} mt="xs" c="white">
                    Stay tuned for what’s coming
                  </Title>
                  <Text mt="md" size="lg" className={classes.updatesText}>
                    New production announcements, audition schedules, show dates, and ticket sales
                    will be shared as our mission of inclusivity and creative expression continues.
                  </Text>
                </div>
                <Stack gap="lg" justify="center">
                  <Group gap="sm">
                    <Badge
                      size="lg"
                      variant="outline"
                      color="gray"
                      leftSection={<IconSparkles size={14} />}
                    >
                      Productions
                    </Badge>
                    <Badge
                      size="lg"
                      variant="outline"
                      color="gray"
                      leftSection={<IconCalendarEvent size={14} />}
                    >
                      Auditions & dates
                    </Badge>
                    <Badge
                      size="lg"
                      variant="outline"
                      color="gray"
                      leftSection={<IconTicket size={14} />}
                    >
                      Tickets
                    </Badge>
                  </Group>
                  <Button
                    component="a"
                    href={diversityTheater.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="lg"
                    color="brand"
                    w="fit-content"
                    leftSection={<IconBrandFacebook size={20} />}
                    rightSection={<IconArrowUpRight size={18} />}
                  >
                    Get the latest on Facebook
                  </Button>
                </Stack>
              </SimpleGrid>
            </Paper>
          </section>
        </Stack>
      </Container>
    </>
  );
}
