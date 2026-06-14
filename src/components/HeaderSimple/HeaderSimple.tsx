import { Link, NavLink } from 'react-router-dom';
import { Burger, Button, Container, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { siteConfig } from '../../content/churchContent';
import classes from './HeaderSimple.module.css';

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const givingLink = siteConfig.homeActions.find((action) => action.id === 'give');

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
            <span className={classes.logoMark}>
              <img src={siteConfig.logoSrc} alt="" />
            </span>
            <span className={classes.logoText}>
              <Text className={classes.kicker}>{siteConfig.denomination}</Text>
              <Text className={classes.wordmark}>{siteConfig.shortName}</Text>
            </span>
          </Link>

          <Group gap={5} visibleFrom="xs">
            {items}
            {givingLink ? (
              <Button component="a" href={givingLink.href} size="sm">
                Give Online
              </Button>
            ) : null}
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
        title={
          <Group gap="sm" wrap="nowrap">
            <span className={`${classes.logoMark} ${classes.drawerLogoMark}`}>
              <img src={siteConfig.logoSrc} alt="" />
            </span>
            <Text fw={700}>{siteConfig.shortName}</Text>
          </Group>
        }
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

          {givingLink ? (
            <Button component="a" href={givingLink.href} onClick={toggle}>
              Give Online
            </Button>
          ) : null}
        </Stack>
      </Drawer>
    </>
  );
}
