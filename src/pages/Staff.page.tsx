import { Badge, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { ContentImage } from '../components/church/ContentImage';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig, staffMembers } from '../content/churchContent';

export function StaffPage() {
  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={siteConfig.denomination}
        title="Meet the staff"
        description="Introduce the people who shape worship, care for the congregation, and help visitors feel at home."
      />

      <Stack gap="xl" mt="xl">
        {staffMembers.map((member, index) => {
          const media = (
            <ContentImage
              src={member.imageSrc}
              alt={member.imageAlt}
              label={member.name}
              description="Replace with a real staff portrait when the image library is ready."
              ratio={4 / 5}
            />
          );

          const content = (
            <Stack gap="md">
              <Badge variant="light" color="brand" w="fit-content">
                {member.role}
              </Badge>
              <Title order={2}>{member.name}</Title>
              <Text c="dimmed" size="lg">
                {member.bio}
              </Text>
              <Group gap="xs">
                {member.focusAreas.map((focus) => (
                  <Badge key={focus} variant="outline" color="moss">
                    {focus}
                  </Badge>
                ))}
              </Group>
            </Stack>
          );

          return (
            <Paper key={member.id} withBorder p={{ base: 'lg', md: 'xl' }}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {index % 2 === 0 ? (
                  <>
                    {media}
                    {content}
                  </>
                ) : (
                  <>
                    {content}
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
