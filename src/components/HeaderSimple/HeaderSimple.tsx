import { useState } from 'react';
import { Burger, Button, Container, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { siteConfig } from '../../content/churchContent';
import classes from './HeaderSimple.module.css';

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(
    typeof window !== 'undefined'
      ? window.location.pathname
      : (siteConfig.navigation[0]?.href ?? '/')
  );

  const items = siteConfig.navigation.map((link) => (
    <a
      key={link.label}
      href={link.href}
      className={classes.link}
      data-active={active === link.href || undefined}
      onClick={() => setActive(link.href)}
    >
      {link.label}
    </a>
  ));

  return (
    <>
      <header className={classes.header}>
        <Container size="xl" className={classes.inner}>
          <a href="/" className={classes.logo}>
            <Text className={classes.kicker}>{siteConfig.denomination}</Text>
            <Text className={classes.wordmark}>{siteConfig.shortName}</Text>
          </a>

          <Group gap={5} visibleFrom="xs">
            {items}
            <Button
              component="a"
              href={siteConfig.homeActions[2].href}
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              Give Online
            </Button>
          </Group>

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="xs"
            size="sm"
            aria-label="Toggle navigation"
          />
        </Container>
      </header>

      <Drawer
        opened={opened}
        onClose={toggle}
        title={siteConfig.shortName}
        padding="lg"
        hiddenFrom="xs"
      >
        <Stack gap="sm">
          {siteConfig.navigation.map((link) => (
            <a key={link.label} href={link.href} className={classes.mobileLink} onClick={toggle}>
              {link.label}
            </a>
          ))}

          <Divider my="sm" />

          <Button
            component="a"
            href={siteConfig.homeActions[2].href}
            target="_blank"
            rel="noreferrer"
            onClick={toggle}
          >
            Give Online
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
