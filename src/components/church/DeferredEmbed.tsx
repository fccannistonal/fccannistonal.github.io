import { useEffect, useState, type CSSProperties } from 'react';
import {
  IconArrowUpRight,
  IconBrandFacebook,
  IconBrandSpotify,
  IconExternalLink,
  IconLoader2,
  IconMapPin,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { Button, Center, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  EMBED_CONSENT_EVENT,
  getEmbedConsent,
  setEmbedConsent,
  type EmbedConsentChange,
  type EmbedProviderId,
} from '../../lib/embedConsent';
import classes from './DeferredEmbed.module.css';

type PreviewVariant = 'map' | 'spotify' | 'facebook';

type Props = {
  providerId: EmbedProviderId;
  preview: PreviewVariant;
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
  loadedMaxWidth?: string;
  allow?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  className?: string;
};

export function DeferredEmbed({
  providerId,
  preview,
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
  loadedMaxWidth,
  allow,
  referrerPolicy,
  className,
}: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasIframeLoaded, setHasIframeLoaded] = useState(false);
  const style = {
    '--embed-min-height': minHeight,
    ...(loadedMaxWidth ? { '--embed-loaded-max-width': loadedMaxWidth } : {}),
  } as CSSProperties;

  useEffect(() => {
    if (getEmbedConsent(providerId)) {
      setIsLoaded(true);
    }

    const handleEmbedConsentChange = (event: Event) => {
      const { enabledProviders } = (event as CustomEvent<EmbedConsentChange>).detail;
      if (enabledProviders.includes(providerId)) {
        setIsLoaded(true);
      }
    };

    window.addEventListener(EMBED_CONSENT_EVENT, handleEmbedConsentChange);
    return () => window.removeEventListener(EMBED_CONSENT_EVENT, handleEmbedConsentChange);
  }, [providerId]);

  const handleLoad = () => {
    setHasIframeLoaded(false);
    setIsLoaded(true);
    setEmbedConsent(providerId);
  };

  return (
    <div className={[classes.frame, className].filter(Boolean).join(' ')} style={style}>
      {isLoaded ? (
        <div className={classes.loadedFrame}>
          {!hasIframeLoaded ? (
            <Center className={classes.loadingOverlay} role="status" aria-live="polite">
              <Group gap="xs">
                <IconLoader2 size={18} aria-hidden="true" className={classes.loadingIcon} />
                <Text size="sm" fw={700}>
                  {loadLabel}
                </Text>
              </Group>
            </Center>
          ) : null}
          <iframe
            src={src}
            title={iframeTitle}
            allow={allow}
            loading="lazy"
            referrerPolicy={referrerPolicy}
            className={classes.iframe}
            onLoad={() => setHasIframeLoaded(true)}
          />
        </div>
      ) : (
        <div className={classes.placeholder}>
          <EmbedPreview preview={preview} title={title} description={description} />
          <Stack gap="md" className={classes.placeholderContent}>
            <Group gap="sm" justify="center">
              <ThemeIcon size={42} radius="xl" variant="light" color="brand">
                <PreviewIcon preview={preview} />
              </ThemeIcon>
              <Text fw={800} size="xs" tt="uppercase" c="brand.8" lts="0.12em">
                {provider}
              </Text>
            </Group>
            <Title order={3}>{title}</Title>
            <Text c="dimmed">{description}</Text>
            <Group className={classes.actions}>
              <Button
                type="button"
                onClick={handleLoad}
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
        </div>
      )}
    </div>
  );
}

function PreviewIcon({ preview }: { preview: PreviewVariant }) {
  if (preview === 'map') {
    return <IconMapPin size={22} stroke={1.7} aria-hidden="true" />;
  }

  if (preview === 'spotify') {
    return <IconBrandSpotify size={22} stroke={1.7} aria-hidden="true" />;
  }

  return <IconBrandFacebook size={22} stroke={1.7} aria-hidden="true" />;
}

function EmbedPreview({
  preview,
  title,
  description,
}: {
  preview: PreviewVariant;
  title: string;
  description: string;
}) {
  if (preview === 'map') {
    return (
      <div className={classes.mapPreview} aria-hidden="true">
        <div className={classes.mapRoadHorizontal} />
        <div className={classes.mapRoadVertical} />
        <div className={classes.mapPin}>
          <IconMapPin size={22} stroke={2} />
        </div>
        <div className={classes.mapLabel}>
          <Text size="xs" fw={800}>
            {title}
          </Text>
          <Text size="xs">{description}</Text>
        </div>
      </div>
    );
  }

  if (preview === 'spotify') {
    return (
      <div className={classes.playerPreview} aria-hidden="true">
        <div className={classes.albumArt}>
          <IconBrandSpotify size={34} stroke={1.6} />
        </div>
        <div className={classes.trackInfo}>
          <div className={classes.trackLineWide} />
          <div className={classes.trackLineShort} />
          <div className={classes.playerBar}>
            <span />
          </div>
        </div>
        <div className={classes.playBubble}>
          <IconPlayerPlay size={18} fill="currentColor" />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.timelinePreview} aria-hidden="true">
      <div className={classes.timelineHeader}>
        <div className={classes.facebookMark}>
          <IconBrandFacebook size={22} stroke={1.8} />
        </div>
        <div>
          <div className={classes.timelineTitle} />
          <div className={classes.timelineDate} />
        </div>
      </div>
      <div className={classes.timelineLine} />
      <div className={classes.timelineLineShort} />
      <div className={classes.timelineCard} />
    </div>
  );
}
