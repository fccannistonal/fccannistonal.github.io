import { useCallback, useEffect, useState } from 'react';
import { IconClock, IconMapPin, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Text, ThemeIcon } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { siteConfig } from '../../content/churchContent';
import { getContent } from '../../content/localizedContent';
import { trackVisitPlanningIntent } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import { getLocalizedPath } from '../../lib/routing';
import { ResponsiveImage } from './ResponsiveImage';
import classes from './HomeHero.module.css';

export const HERO_ROTATION_INTERVAL_MS = 3200;
export const HERO_ROLL_DURATION_MS = 650;

type HeroSentence = ReturnType<typeof getContent>['home']['heroSentences'][number];

function getSentenceText(sentence: HeroSentence) {
  return `${sentence.lead}${sentence.emphasis}${sentence.ending}`;
}

function SentenceText({ sentence }: { sentence: HeroSentence }) {
  return (
    <span className={classes.sentenceContent}>
      {sentence.lead}
      <span style={{ color: sentence.color }}>{sentence.emphasis}</span>
      {sentence.ending}
    </span>
  );
}

export function HomeHero() {
  const locale = useLocale();
  const content = getContent(locale);
  const heroSentences = content.home.heroSentences;
  const prefersReducedMotion = useReducedMotion();
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [previousSentenceIndex, setPreviousSentenceIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const finishRoll = useCallback(() => {
    setIsRolling(false);
  }, []);

  useEffect(() => {
    setSentenceIndex(0);
    setPreviousSentenceIndex(0);
    setIsRolling(false);
  }, [locale]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || isRolling || heroSentences.length < 2) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousSentenceIndex(sentenceIndex);
      setSentenceIndex((sentenceIndex + 1) % heroSentences.length);
      setIsRolling(true);
    }, HERO_ROTATION_INTERVAL_MS);

    return () => window.clearTimeout(timeoutId);
  }, [heroSentences.length, isPaused, isRolling, prefersReducedMotion, sentenceIndex]);

  useEffect(() => {
    if (!isRolling) {
      return undefined;
    }

    const timeoutId = window.setTimeout(finishRoll, HERO_ROLL_DURATION_MS + 100);

    return () => window.clearTimeout(timeoutId);
  }, [finishRoll, isRolling]);

  const visibleSentenceIndex = prefersReducedMotion ? 0 : sentenceIndex;
  const visibleSentence = heroSentences[visibleSentenceIndex];
  const previousSentence = heroSentences[previousSentenceIndex];
  const showRollingTrack = isRolling && !prefersReducedMotion;
  return (
    <section className={classes.hero}>
      <ResponsiveImage
        src={siteConfig.heroImageSrc}
        alt=""
        width={siteConfig.heroImageWidth}
        height={siteConfig.heroImageHeight}
        sizes="100vw"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
        className={classes.heroMedia}
        imageClassName={classes.heroMediaImage}
      />
      <Container size="lg" className={classes.inner}>
        <Text className={classes.eyebrow}>{content.home.heroEyebrow}</Text>

        <div className={classes.headline}>
          <h1 className={classes.title}>
            <span className={classes.visuallyHidden}>{getSentenceText(heroSentences[0])}</span>

            <span className={classes.sentenceRoller} aria-hidden="true">
              <span className={classes.sentenceSizer}>
                {heroSentences.map((sentence) => (
                  <span key={sentence.id} className={classes.sentenceSizerItem}>
                    <SentenceText sentence={sentence} />
                  </span>
                ))}
              </span>

              <span className={classes.sentenceStage}>
                {showRollingTrack ? (
                  <span
                    key={`${previousSentence.id}-${visibleSentence.id}`}
                    className={classes.sentenceTrack}
                    onAnimationEnd={finishRoll}
                  >
                    <span className={classes.sentencePanel}>
                      <SentenceText sentence={previousSentence} />
                    </span>
                    <span className={classes.sentencePanel} data-testid="hero-current-sentence">
                      <SentenceText sentence={visibleSentence} />
                    </span>
                  </span>
                ) : (
                  <span className={classes.settledSentence} data-testid="hero-current-sentence">
                    <SentenceText sentence={visibleSentence} />
                  </span>
                )}
              </span>
            </span>
          </h1>

          {!prefersReducedMotion && heroSentences.length > 1 && (
            <Button
              type="button"
              variant="subtle"
              size="compact-sm"
              className={classes.animationControl}
              leftSection={
                isPaused ? (
                  <IconPlayerPlay size={16} aria-hidden="true" />
                ) : (
                  <IconPlayerPause size={16} aria-hidden="true" />
                )
              }
              aria-pressed={isPaused}
              onClick={() => setIsPaused((currentValue) => !currentValue)}
            >
              {isPaused ? content.common.resumeTextAnimation : content.common.pauseTextAnimation}
            </Button>
          )}
        </div>

        <Text className={classes.description}>{content.home.heroDescription}</Text>

        <Group className={classes.facts}>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon radius="xl" variant="light" color="brand">
              <IconClock size={18} aria-hidden="true" />
            </ThemeIcon>
            <Text fw={700}>{content.home.serviceFactLabel}</Text>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon radius="xl" variant="light" color="moss">
              <IconMapPin size={18} aria-hidden="true" />
            </ThemeIcon>
            <Text fw={700}>{content.home.locationFactLabel}</Text>
          </Group>
        </Group>

        <Group className={classes.actions}>
          <Button
            component={Link}
            to={getLocalizedPath('visit', locale)}
            size="lg"
            onClick={() => trackVisitPlanningIntent('home-hero', locale)}
          >
            {content.home.primaryAction}
          </Button>
          <Button
            component="a"
            href={siteConfig.directionsUrl}
            target="_blank"
            rel="noreferrer"
            size="lg"
            variant="outline"
            className={classes.secondaryButton}
          >
            {content.home.secondaryAction}
          </Button>
        </Group>
      </Container>
    </section>
  );
}
