import { IconArrowLeft, IconCalendar, IconTag } from '@tabler/icons-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Badge, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { getPostBySlug } from '../content/posts';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Post.page.module.css';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function PostPage() {
  const locale = useLocale();
  const { slug } = useParams();
  const post = getPostBySlug(locale, slug);
  const content = getContent(locale);

  if (!post && slug === undefined) {
    return <Navigate to={getLocalizedPath('updates', locale)} replace />;
  }

  if (!post) {
    return (
      <Container size="md" py={{ base: 'xl', md: '4rem' }}>
        <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
          <Title order={1}>
            {locale === 'es' ? 'No encontramos esta novedad' : 'We could not find this update'}
          </Title>
          <Text c="dimmed" size="lg" mt="md">
            {locale === 'es'
              ? 'Es posible que la publicación haya cambiado de dirección o ya no esté disponible.'
              : 'The post may have moved or may no longer be available.'}
          </Text>
          <Button component={Link} to={getLocalizedPath('updates', locale)} mt="lg">
            {content.common.navigation.updates}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py={{ base: 'xl', md: '4rem' }}>
      <Button
        component={Link}
        to={getLocalizedPath('updates', locale)}
        variant="subtle"
        color="dark"
        leftSection={<IconArrowLeft size={18} />}
        mb="lg"
      >
        {content.common.navigation.updates}
      </Button>

      <PageHeader
        eyebrow={content.updates.eyebrow}
        title={post.title}
        description={post.description}
      />

      <Paper component="article" withBorder p={{ base: 'lg', md: 'xl' }} mt="xl">
        <Stack gap="md">
          <Group gap="xs">
            <Badge variant="light" color="brand" leftSection={<IconCalendar size={14} />}>
              {dateFormatter.format(new Date(`${post.publishedAt}T12:00:00`))}
            </Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" color="moss" leftSection={<IconTag size={13} />}>
                {tag}
              </Badge>
            ))}
          </Group>

          <Text c="dimmed" fw={700}>
            {post.author}
          </Text>

          <div
            className={classes.postBody}
            // Markdown is repo-owned content rendered by an escaping local parser, not MDX.
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Stack>
      </Paper>
    </Container>
  );
}
