import { IconAlertTriangle, IconHome2, IconMail, IconRefresh } from '@tabler/icons-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button, Container, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { getShellContent } from '../../content/localizedShellContent';
import { useLocale } from '../../lib/i18n';
import { getLocalizedPath } from '../../lib/routing';
import classes from './RouteErrorFallback.module.css';

const DYNAMIC_IMPORT_ERROR_PATTERNS = [
  'chunkloaderror',
  'loading chunk',
  'css chunk load',
  'failed to fetch dynamically imported module',
  'error loading dynamically imported module',
  'importing a module script failed',
  'dynamically imported module',
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (isRouteErrorResponse(error)) {
    return [error.status, error.statusText].filter(Boolean).join(' ');
  }

  if (typeof error === 'string') {
    return error;
  }

  return '';
}

export function isDynamicImportError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase();
  const name = error instanceof Error ? error.name.toLowerCase() : '';
  const searchableText = `${name} ${message}`;

  return DYNAMIC_IMPORT_ERROR_PATTERNS.some((pattern) => searchableText.includes(pattern));
}

export function RouteErrorFallback() {
  const error = useRouteError();
  const locale = useLocale();
  const content = getShellContent(locale).routeError;
  const isChunkError = isDynamicImportError(error);
  const title = isChunkError ? content.staleTitle : content.genericTitle;
  const description = isChunkError ? content.staleDescription : content.genericDescription;
  const helpText = isChunkError ? content.staleHelp : content.genericHelp;
  const errorMessage = getErrorMessage(error);

  return (
    <Container className={classes.wrap} size="md">
      <Paper
        aria-describedby="route-error-description"
        aria-labelledby="route-error-title"
        className={classes.panel}
        role="alert"
        withBorder
        p={{ base: 'xl', md: '3rem' }}
      >
        <Stack gap="xl">
          <Group align="flex-start" gap="lg">
            <ThemeIcon className={classes.icon} size={54} radius="xl" variant="white">
              <IconAlertTriangle size={28} stroke={1.8} aria-hidden="true" />
            </ThemeIcon>
            <Stack gap="sm">
              <Text className={classes.eyebrow}>{content.label}</Text>
              <Title className={classes.title} id="route-error-title" order={1}>
                {title}
              </Title>
              <Text className={classes.message} id="route-error-description" size="lg" c="dimmed">
                {description}
              </Text>
            </Stack>
          </Group>

          <div className={classes.actions}>
            <Button
              leftSection={<IconRefresh size={18} aria-hidden="true" />}
              onClick={() => window.location.reload()}
            >
              {content.refreshAction}
            </Button>
            <Button
              component={Link}
              to={getLocalizedPath('home', locale)}
              variant="default"
              leftSection={<IconHome2 size={18} aria-hidden="true" />}
            >
              {content.homeAction}
            </Button>
            <Button
              component="a"
              href={`mailto:${siteConfig.email}`}
              variant="subtle"
              leftSection={<IconMail size={18} aria-hidden="true" />}
            >
              {content.contactAction}
            </Button>
          </div>

          <Stack className={classes.details} gap="xs">
            <Text fw={800}>{content.helpTitle}</Text>
            <Text className={classes.message} c="dimmed">
              {helpText}
            </Text>
            {import.meta.env.DEV && errorMessage && (
              <Text c="dimmed" size="sm">
                {content.developerDetails}: {errorMessage}
              </Text>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
