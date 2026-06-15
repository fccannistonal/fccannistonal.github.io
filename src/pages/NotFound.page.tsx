import { Link } from 'react-router-dom';
import { Button, Container, Paper, Stack, Text, Title } from '@mantine/core';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';

export function NotFoundPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="sm" py={{ base: '4rem', md: '7rem' }}>
      <Paper withBorder p={{ base: 'xl', md: '3rem' }}>
        <Stack align="center" ta="center">
          <Text c="brand.7" fw={800} tt="uppercase" lts="0.18em">
            404
          </Text>
          <Title order={1}>{content.notFound.title}</Title>
          <Text c="dimmed" size="lg">
            {content.notFound.description}
          </Text>
          <Button component={Link} to={getLocalizedPath('home', locale)} mt="md">
            {content.notFound.action}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
