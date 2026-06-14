import { IconHeartHandshake } from '@tabler/icons-react';
import { Badge, Container, List, Paper, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { ContentImage } from '../components/church/ContentImage';
import { PageHeader } from '../components/church/PageHeader';
import { outreachItems, siteConfig } from '../content/churchContent';

export function OutreachPage() {
  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={siteConfig.denomination}
        title="Community outreach"
        description="Use this page to show how the church serves beyond Sunday morning with practical care, shared tables, and local partnerships."
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
        {outreachItems.map((item) => (
          <Paper key={item.id} withBorder p="md">
            <ContentImage
              src={item.imageSrc}
              alt={item.imageAlt}
              label={item.title}
              description="Replace with a ministry or event photo when church outreach images are available."
            />
            <Badge variant="light" color="moss" mt="md">
              Outreach
            </Badge>
            <Title order={2} mt="md">
              {item.title}
            </Title>
            <Text c="dimmed" mt="sm">
              {item.summary}
            </Text>

            <List
              mt="lg"
              spacing="sm"
              icon={
                <ThemeIcon color="brand" variant="light" radius="xl" size={28}>
                  <IconHeartHandshake size={16} stroke={1.7} />
                </ThemeIcon>
              }
            >
              {item.highlights.map((highlight) => (
                <List.Item key={highlight}>
                  <Text c="dimmed">{highlight}</Text>
                </List.Item>
              ))}
            </List>
          </Paper>
        ))}
      </SimpleGrid>
    </Container>
  );
}
