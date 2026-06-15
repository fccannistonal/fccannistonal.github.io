import { useId, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
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
  Title,
} from '@mantine/core';
import { ContentImage } from '../components/church/ContentImage';
import { PageHeader } from '../components/church/PageHeader';
import { staffAssets, staffGroupImages } from '../content/churchContent';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import classes from './Staff.page.module.css';

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
