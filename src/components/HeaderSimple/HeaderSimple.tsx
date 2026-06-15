import { lazy, Suspense, useEffect, useState } from 'react';
import { IconLanguage } from '@tabler/icons-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Burger, Button, Container, Group, Text } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { getShellContent } from '../../content/localizedShellContent';
import { trackGivingIntent } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import { getAlternateLocalePath, getLocalizedPath } from '../../lib/routing';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { PRIMARY_NAVIGATION } from './navigation';
import classes from './HeaderSimple.module.css';

const MobileNavigationDrawer = lazy(() =>
  import('./MobileNavigationDrawer').then((module) => ({
    default: module.MobileNavigationDrawer,
  }))
);

export function HeaderSimple() {
  const [opened, setOpened] = useState(false);
  const location = useLocation();
  const locale = useLocale();
  const content = getShellContent(locale);
  const alternatePath = getAlternateLocalePath(location.pathname);

  useEffect(() => {
    setOpened(false);
  }, [location.pathname]);

  const items = PRIMARY_NAVIGATION.map((routeId) => (
    <NavLink
      key={routeId}
      to={getLocalizedPath(routeId, locale)}
      end={routeId === 'home'}
      className={({ isActive }) => (isActive ? `${classes.link} ${classes.active}` : classes.link)}
    >
      {content.common.navigation[routeId]}
    </NavLink>
  ));

  return (
    <>
      <header className={classes.header}>
        <Container size="xl" className={classes.inner}>
          <Link
            to={getLocalizedPath('home', locale)}
            className={classes.logo}
            aria-label={content.common.churchName}
          >
            <BrandLogo className={classes.logoMark} />
            <span className={classes.logoText}>
              <Text className={classes.kicker}>{content.common.denomination}</Text>
              <Text className={classes.wordmark}>{content.common.shortName}</Text>
            </span>
          </Link>

          <Group
            gap={2}
            visibleFrom="md"
            component="nav"
            aria-label={content.common.navigationLabel}
          >
            {items}
            <Button
              component={Link}
              to={alternatePath}
              variant="subtle"
              color="dark"
              size="compact-sm"
              leftSection={<IconLanguage size={17} aria-hidden="true" />}
              aria-label={content.common.switchLanguage}
            >
              {content.common.languageName}
            </Button>
            <Button
              component="a"
              href={siteConfig.givingFormUrl}
              target="_blank"
              rel="noreferrer"
              size="sm"
              onClick={() => trackGivingIntent(locale)}
            >
              {content.common.give}
            </Button>
          </Group>

          <Burger
            opened={opened}
            onClick={() => setOpened((current) => !current)}
            hiddenFrom="md"
            size="sm"
            aria-label={opened ? content.common.closeNavigation : content.common.openNavigation}
          />
        </Container>
      </header>

      {opened && (
        <Suspense fallback={null}>
          <MobileNavigationDrawer opened={opened} onClose={() => setOpened(false)} />
        </Suspense>
      )}
    </>
  );
}
