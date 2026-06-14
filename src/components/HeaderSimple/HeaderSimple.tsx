import { Link, NavLink } from 'react-router-dom';
import { Burger, Button, Container, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { siteConfig } from '../../content/churchContent';
import classes from './HeaderSimple.module.css';

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = siteConfig.navigation.map((link) => (
    <NavLink
      key={link.label}
      to={link.href}
      end={link.href === '/'}
      className={({ isActive }) => (isActive ? `${classes.link} ${classes.active}` : classes.link)}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <>
      <header className={classes.header}>
        <Container size="xl" className={classes.inner}>
          <Link to="/" className={classes.logo}>
            <Text className={classes.kicker}>{siteConfig.denomination}</Text>
            <Text className={classes.wordmark}>{siteConfig.shortName}</Text>
          </Link>

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
            <Link key={link.label} to={link.href} className={classes.mobileLink} onClick={toggle}>
              {link.label}
            </Link>
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
