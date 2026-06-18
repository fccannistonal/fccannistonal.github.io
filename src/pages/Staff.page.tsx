import { useId, useState } from 'react';
import {
  IconArrowUpRight,
  IconBook2,
  IconBrandInstagram,
  IconBrandSpotify,
  IconChevronDown,
  IconNews,
} from '@tabler/icons-react';
import {
  Badge,
  Button,
  Collapse,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ContentImage } from '../components/church/ContentImage';
import { PageHeader } from '../components/church/PageHeader';
import { staffAssets, staffGroupImages } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import classes from './Staff.page.module.css';

type StaffConnection = {
  id: 'instagram' | 'book' | 'newspaper' | 'podcast';
  label: string;
  description: string;
  href: string;
};

const staffConnectionIcons = {
  instagram: IconBrandInstagram,
  book: IconBook2,
  newspaper: IconNews,
  podcast: IconBrandSpotify,
} satisfies Record<StaffConnection['id'], typeof IconBrandInstagram>;

const staffConnectionColors = {
  instagram: 'pink',
  book: 'grape',
  newspaper: 'brand',
  podcast: 'green',
} satisfies Record<StaffConnection['id'], string>;

export function StaffPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.staff.eyebrow}
        title={content.staff.title}
        description={content.staff.description}
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
        {staffGroupImages.map((image, index) => (
          <ContentImage
            key={image.id}
            src={image.src}
            alt={content.staff.groupImageAlts[index]}
            label={content.common.churchName}
            width={image.width}
            height={image.height}
            ratio={16 / 10}
            sizes="(max-width: 48em) 100vw, 50vw"
            objectPosition={image.objectPosition}
          />
        ))}
      </SimpleGrid>

      <Stack gap="xl" mt="xl">
        {staffAssets.map((asset, index) => {
          const member = content.staff.members[asset.id];
          const media = (
            <ContentImage
              src={asset.imageSrc}
              alt={member.imageAlt}
              label={asset.name}
              width={asset.width}
              height={asset.height}
              ratio={4 / 5}
              sizes="(max-width: 48em) 100vw, 45vw"
            />
          );

          const profile = (
            <Stack gap="md" justify="center">
              <Badge variant="light" color="brand" w="fit-content">
                {member.role}
              </Badge>
              <Title order={2}>{asset.name}</Title>
              <Text c="dimmed" size="lg">
                {member.summary}
              </Text>
              <Group gap="xs">
                {member.focusAreas.map((focus) => (
                  <Badge key={focus} variant="outline" color="moss">
                    {focus}
                  </Badge>
                ))}
              </Group>
              <StaffConnections
                connections={member.connections}
                opensNewTabLabel={content.common.opensNewTab}
                title={content.staff.connectionsTitle(asset.name)}
              />
              <StaffBiography
                biography={member.biography}
                detailsLabel={content.staff.detailsLabel}
                name={asset.name}
              />
            </Stack>
          );

          return (
            <Paper
              key={asset.id}
              withBorder
              p={{ base: 'lg', md: 'xl' }}
              className={classes.memberCard}
            >
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {index % 2 === 0 ? (
                  <>
                    {media}
                    {profile}
                  </>
                ) : (
                  <>
                    {profile}
                    {media}
                  </>
                )}
              </SimpleGrid>
            </Paper>
          );
        })}
      </Stack>
    </Container>
  );
}

function StaffConnections({
  connections,
  opensNewTabLabel,
  title,
}: {
  connections?: StaffConnection[];
  opensNewTabLabel: string;
  title: string;
}) {
  if (!connections?.length) {
    return null;
  }

  return (
    <Stack className={classes.connections} gap="sm">
      <Text className={classes.connectionsTitle} size="sm">
        {title}
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
        {connections.map((connection) => {
          const ConnectionIcon = staffConnectionIcons[connection.id];

          return (
            <a
              key={connection.id}
              href={connection.href}
              target="_blank"
              rel="noreferrer"
              className={classes.connectionLink}
              aria-label={`${connection.label}: ${connection.description} (${opensNewTabLabel})`}
            >
              <ThemeIcon
                className={classes.connectionIcon}
                color={staffConnectionColors[connection.id]}
                radius="xl"
                size={38}
                variant="light"
              >
                <ConnectionIcon aria-hidden="true" size={20} stroke={1.8} />
              </ThemeIcon>
              <span className={classes.connectionText}>
                <Text component="span" fw={800} size="sm">
                  {connection.label}
                </Text>
                <Text component="span" c="dimmed" size="xs">
                  {connection.description}
                </Text>
              </span>
              <IconArrowUpRight
                aria-hidden="true"
                className={classes.connectionArrow}
                size={17}
                stroke={1.8}
              />
            </a>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

function StaffBiography({
  biography,
  detailsLabel,
  name,
}: {
  biography: string[];
  detailsLabel: string;
  name: string;
}) {
  const [opened, setOpened] = useState(false);
  const panelId = useId();

  return (
    <div className={classes.biography}>
      <Button
        aria-controls={panelId}
        aria-expanded={opened}
        className={classes.biographyButton}
        color="brand"
        onClick={() => setOpened((current) => !current)}
        rightSection={
          <IconChevronDown aria-hidden className={classes.biographyChevron} size={16} />
        }
        size="compact-md"
        variant="subtle"
      >
        {detailsLabel}
      </Button>
      <Collapse id={panelId} in={opened} transitionDuration={260} transitionTimingFunction="ease">
        <Stack aria-label={`${name} biography`} className={classes.biographyPanel} gap="sm">
          {biography.map((paragraph) => (
            <Text key={paragraph} c="dimmed">
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Collapse>
    </div>
  );
}
