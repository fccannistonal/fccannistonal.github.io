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
import { ResponsiveImage } from '../components/church/ResponsiveImage';
import {
  diversityTheaterAssets,
  siteConfig,
  type TheaterImage as TheaterImageData,
} from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import classes from './DiversityTheater.page.module.css';

type TheaterImageProps = {
  image: TheaterImageData;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  sizes?: string;
};

type ValueCardProps = {
  icon: ComponentType<{ size?: number; stroke?: number }>;
  title: string;
  description: string;
};

function TheaterImage({ image, alt, className, loading = 'lazy', sizes }: TheaterImageProps) {
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

export function DiversityTheaterPage() {
  const locale = useLocale();
  const content = getContent(locale);
  const theater = content.theater;
  const hero = diversityTheaterAssets.heroImage;
  const valueIcons = [IconTheater, IconHeartHandshake, IconUsersGroup];

  return (
    <>
      <section className={classes.hero} aria-labelledby="theater-title">
        <TheaterImage
          image={hero}
          alt={theater.imageAlts[hero.id]}
          className={classes.heroImage}
          loading="eager"
          sizes="100vw"
        />
        <div className={classes.heroOverlay} />
        <Container size="xl" className={classes.heroInner}>
          <div className={classes.heroContent}>
            <Badge variant="filled" color="brand" size="lg" className={classes.heroBadge}>
              {theater.eyebrow}
            </Badge>
            <Title id="theater-title" order={1} className={classes.heroTitle}>
              {theater.titleLead} <span>{theater.titleEmphasis}</span>
            </Title>
            <Text size="xl" className={classes.heroLead}>
              {theater.lead}
            </Text>
            <Group mt="xl">
              <Button
                component="a"
                href={siteConfig.diversityTheaterFacebookUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
                color="brand"
                leftSection={<IconBrandFacebook size={20} />}
                rightSection={<IconArrowUpRight size={18} />}
              >
                {theater.follow}
              </Button>
              <Button
                component="a"
                href="#theater-story"
                size="lg"
                variant="white"
                color="dark"
                rightSection={<IconArrowDown size={18} />}
              >
                {theater.discover}
              </Button>
            </Group>
          </div>
        </Container>
      </section>

      <Container size="xl" py={{ base: '3rem', md: '6rem' }}>
        <Stack className={classes.pageStack}>
          <section id="theater-story" aria-labelledby="theater-story-title">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '4rem' }}>
              <div>
                <Text className={classes.eyebrow}>{theater.storyEyebrow}</Text>
                <Title id="theater-story-title" order={2} mt="sm" maw={620}>
                  {theater.storyTitle}
                </Title>
              </div>
              <Stack gap="md">
                {theater.introduction.map((paragraph) => (
                  <Text key={paragraph} c="dimmed" size="lg">
                    {paragraph}
                  </Text>
                ))}
              </Stack>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt={{ base: 'xl', md: '3rem' }}>
              {theater.values.map((value, index) => {
                const Icon = valueIcons[index] ?? IconSparkles;
                return (
                  <ValueCard
                    key={value.title}
                    icon={Icon}
                    title={value.title}
                    description={value.description}
                  />
                );
              })}
            </SimpleGrid>
          </section>

          <section aria-labelledby="theater-gallery-title">
            <div className={classes.sectionHeading}>
              <div>
                <Text className={classes.eyebrow}>{theater.galleryEyebrow}</Text>
                <Title id="theater-gallery-title" order={2} mt="xs">
                  {theater.galleryTitle}
                </Title>
              </div>
              <Text c="dimmed" size="lg" maw={520}>
                {theater.mission}
              </Text>
            </div>

            <div className={classes.gallery}>
              {diversityTheaterAssets.galleryImages.map((image, index) => (
                <figure
                  key={image.id}
                  className={`${classes.galleryItem} ${index === 0 ? classes.galleryItemFeatured : ''}`}
                >
                  <TheaterImage
                    image={image}
                    alt={theater.imageAlts[image.id]}
                    className={classes.galleryPicture}
                    sizes={
                      index === 0
                        ? '(max-width: 48em) 100vw, 58vw'
                        : '(max-width: 48em) 100vw, 29vw'
                    }
                  />
                  <figcaption className={classes.visuallyHidden}>
                    {theater.imageAlts[image.id]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="founder" aria-labelledby="founder-title">
            <Paper withBorder p={{ base: 'lg', md: 'xl' }} className={classes.founderCard}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: '3rem' }}>
                <div className={classes.founderImages}>
                  <TheaterImage
                    image={diversityTheaterAssets.founderPortrait}
                    alt={theater.imageAlts[diversityTheaterAssets.founderPortrait.id]}
                    className={classes.founderPortrait}
                    sizes="(max-width: 48em) 100vw, 40vw"
                  />
                  <TheaterImage
                    image={diversityTheaterAssets.founderActionImage}
                    alt={theater.imageAlts[diversityTheaterAssets.founderActionImage.id]}
                    className={classes.founderAction}
                    sizes="(max-width: 48em) 42vw, 18vw"
                  />
                </div>

                <Stack gap="md" justify="center" className={classes.founderContent}>
                  <Badge variant="light" color="brand" w="fit-content" size="lg">
                    {theater.founderBadge}
                  </Badge>
                  <Title id="founder-title" order={2}>
                    Maury Evans
                  </Title>
                  {theater.founderBio.map((paragraph) => (
                    <Text key={paragraph} c="dimmed" size="lg">
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </SimpleGrid>
            </Paper>
          </section>

          <section aria-labelledby="theater-updates-title">
            <Paper p={{ base: 'xl', md: '3rem' }} className={classes.updatesCard}>
              <div className={classes.updatesGlow} aria-hidden="true" />
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" className={classes.updatesContent}>
                <div>
                  <Text className={classes.updatesEyebrow}>{theater.updatesEyebrow}</Text>
                  <Title id="theater-updates-title" order={2} mt="xs" c="white">
                    {theater.updatesTitle}
                  </Title>
                  <Text mt="md" size="lg" className={classes.updatesText}>
                    {theater.updatesCopy}
                  </Text>
                </div>
                <Stack gap="lg" justify="center">
                  <Group gap="sm">
                    {theater.updateBadges.map((badge, index) => {
                      const BadgeIcon = [IconSparkles, IconCalendarEvent, IconTicket][index];
                      return (
                        <Badge
                          key={badge}
                          size="lg"
                          variant="outline"
                          color="gray"
                          leftSection={BadgeIcon ? <BadgeIcon size={14} /> : undefined}
                        >
                          {badge}
                        </Badge>
                      );
                    })}
                  </Group>
                  <Button
                    component="a"
                    href={siteConfig.diversityTheaterFacebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="lg"
                    color="brand"
                    w="fit-content"
                    leftSection={<IconBrandFacebook size={20} />}
                    rightSection={<IconArrowUpRight size={18} />}
                  >
                    {theater.updatesCta}
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
