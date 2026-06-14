import { useEffect, useState } from 'react';
import { Button, Container, Group, Text } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { heroMessages, siteConfig } from '../../content/churchContent';
import classes from './HomeHero.module.css';

export const HERO_ROTATION_INTERVAL_MS = 3200;

export function HomeHero() {
  const prefersReducedMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setMessageIndex((currentIndex) => (currentIndex + 1) % heroMessages.length);
    }, HERO_ROTATION_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion]);

  const currentMessage = heroMessages[prefersReducedMotion ? 0 : messageIndex];
  const backgroundImage = siteConfig.heroBackgroundSrc
    ? `linear-gradient(180deg, rgba(25, 18, 12, 0.35), rgba(25, 18, 12, 0.55)), url(${siteConfig.heroBackgroundSrc})`
    : undefined;

  return (
    <section className={classes.hero} style={{ backgroundImage }}>
      <Container size="lg" className={classes.inner}>
        <Text className={classes.eyebrow}>{siteConfig.denomination}</Text>

        <h1 className={classes.title}>
          <span className={classes.staticText}>We are</span>{' '}
          <span
            key={currentMessage.id}
            className={classes.message}
            style={{ color: currentMessage.color }}
          >
            {currentMessage.text}
          </span>
        </h1>

        <Text className={classes.description}>{siteConfig.tagline}</Text>

        <Group className={classes.actions}>
          <Button component="a" href={siteConfig.heroPrimaryAction.href} size="lg">
            {siteConfig.heroPrimaryAction.cta}
          </Button>
          <Button
            component="a"
            href={siteConfig.heroSecondaryAction.href}
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
