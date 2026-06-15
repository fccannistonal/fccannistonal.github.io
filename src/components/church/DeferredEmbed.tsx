import { useState, type CSSProperties } from 'react';
import { IconArrowUpRight, IconExternalLink, IconPlayerPlay } from '@tabler/icons-react';
import { Button, Center, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import classes from './DeferredEmbed.module.css';

type Props = {
  provider: string;
  title: string;
  description: string;
  loadLabel: string;
  src: string;
  externalUrl: string;
  externalLabel: string;
  iframeTitle: string;
  connectionNote: string;
  minHeight?: string;
  allow?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  className?: string;
};

export function DeferredEmbed({
  provider,
  title,
  description,
  loadLabel,
  src,
  externalUrl,
  externalLabel,
  iframeTitle,
  connectionNote,
  minHeight = '20rem',
  allow,
  referrerPolicy,
  className,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const style = { '--embed-min-height': minHeight } as CSSProperties;

  return (
    <div className={[classes.frame, className].filter(Boolean).join(' ')} style={style}>
      {isLoaded ? (
        <iframe
          src={src}
          title={iframeTitle}
          allow={allow}
          loading="lazy"
          referrerPolicy={referrerPolicy}
          className={classes.iframe}
        />
      ) : (
        <Center className={classes.placeholder}>
          <Stack gap="md" align="center" ta="center" maw={620}>
            <ThemeIcon size={54} radius="xl" variant="light" color="brand">
              <IconPlayerPlay size={28} stroke={1.7} aria-hidden="true" />
            </ThemeIcon>
            <Text fw={800} size="xs" tt="uppercase" c="brand.8" lts="0.12em">
              {provider}
            </Text>
            <Title order={3}>{title}</Title>
            <Text c="dimmed">{description}</Text>
            <Group className={classes.actions}>
              <Button
                type="button"
                onClick={() => setIsLoaded(true)}
                leftSection={<IconPlayerPlay size={18} aria-hidden="true" />}
              >
                {loadLabel}
              </Button>
              <Button
                component="a"
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                variant="default"
                rightSection={<IconExternalLink size={17} aria-hidden="true" />}
              >
                {externalLabel}
              </Button>
            </Group>
            <Text size="xs" c="dimmed">
              <IconArrowUpRight
                size={14}
                style={{ display: 'inline', verticalAlign: '-2px' }}
                aria-hidden="true"
              />{' '}
              {connectionNote}
            </Text>
          </Stack>
        </Center>
      )}
    </div>
  );
}
