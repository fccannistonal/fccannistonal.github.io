import { useCallback, useEffect, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { heroSentences, siteConfig, type HeroSentence } from '../../content/churchContent';
import classes from './HomeHero.module.css';

export const HERO_ROTATION_INTERVAL_MS = 3200;
export const HERO_ROLL_DURATION_MS = 650;

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
  const prefersReducedMotion = useReducedMotion();
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [previousSentenceIndex, setPreviousSentenceIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const finishRoll = useCallback(() => {
    setIsRolling(false);
  }, []);

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
  }, [isPaused, isRolling, prefersReducedMotion, sentenceIndex]);

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
  const backgroundImage = siteConfig.heroBackgroundSrc
    ? `url(${siteConfig.heroBackgroundSrc})`
    : undefined;

  return (
    <section className={classes.hero} style={{ backgroundImage }}>
      <Container size="lg" className={classes.inner}>
        <Text className={classes.eyebrow}>{siteConfig.denomination}</Text>

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
              {isPaused ? 'Resume text animation' : 'Pause text animation'}
            </Button>
          )}
        </div>

        <Text className={classes.description}>{siteConfig.tagline}</Text>

        <Group className={classes.actions}>
          <Button component={Link} to={siteConfig.heroPrimaryAction.href} size="lg">
            {siteConfig.heroPrimaryAction.cta}
          </Button>
          <Button
            component={Link}
            to={siteConfig.heroSecondaryAction.href}
            size="lg"
            variant="outline"
            className={classes.secondaryButton}
          >
            {siteConfig.heroSecondaryAction.cta}
          </Button>
        </Group>
      </Container>
    </section>
  );
}
