import { Button, Container, Paper, Stack, Text, Title } from '@mantine/core';

export function NotFoundPage() {
  return (
    <Container size="md" py={{ base: 'xl', md: '5rem' }}>
      <Paper withBorder p={{ base: 'xl', md: '3rem' }}>
        <Stack gap="md" align="flex-start">
          <Title order={1}>Page not found</Title>
          <Text c="dimmed">
            This route does not exist yet. Head back home to continue exploring the church site.
          </Text>
          <Button component="a" href="/">
            Return home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
