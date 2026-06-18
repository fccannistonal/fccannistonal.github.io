import { IconBooks } from '@tabler/icons-react';
import { Container, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import classes from './About.page.module.css';

export function RecommendedReadingPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.reading.eyebrow}
        title={content.reading.title}
        description={content.reading.description}
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mt="xl">
        {content.reading.categories.map((category) => (
          <Paper
            key={category.title}
            withBorder
            p={{ base: 'lg', md: 'xl' }}
            className={classes.practiceCard}
          >
            <Stack gap="md">
              <ThemeIcon size={46} radius="xl" variant="light" color="brand">
                <IconBooks size={23} stroke={1.7} />
              </ThemeIcon>
              <Title order={2}>{category.title}</Title>
              <List spacing="sm" c="dimmed">
                {category.books.map((book) => (
                  <List.Item key={`${book.title}-${book.author}`}>
                    <Text component="span" fs="italic">
                      {book.title}
                    </Text>{' '}
                    <Text component="span">
                      {content.reading.byLabel} {book.author}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>

      <Paper withBorder p={{ base: 'lg', md: 'xl' }} mt="xl" className={classes.statementCard}>
        <Text c="dimmed" size="lg">
          {content.reading.closingNote}
        </Text>
      </Paper>
    </Container>
  );
}
