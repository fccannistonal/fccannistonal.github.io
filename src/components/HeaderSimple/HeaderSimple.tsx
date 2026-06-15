import { lazy, Suspense, useEffect, useId, useState } from 'react';
import { IconChevronDown, IconHome2, IconLanguage } from '@tabler/icons-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Burger, Button, Container, Group, Popover, Text } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { getShellContent } from '../../content/localizedShellContent';
import { trackGivingIntent } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import { getAlternateLocalePath, getLocalizedPath, getRouteInfo } from '../../lib/routing';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { CHURCH_LIFE_NAVIGATION, PRIMARY_NAVIGATION } from './navigation';
import classes from './HeaderSimple.module.css';

const MobileNavigationDrawer = lazy(() =>
  import('./MobileNavigationDrawer').then((module) => ({
    default: module.MobileNavigationDrawer,
  }))
);

export function HeaderSimple() {
  const [opened, setOpened] = useState(false);
  const [churchLifeMenuOpened, setChurchLifeMenuOpened] = useState(false);
  const churchLifeMenuId = useId();
  const location = useLocation();
  const locale = useLocale();
  const content = getShellContent(locale);
  const alternatePath = getAlternateLocalePath(location.pathname);
  const currentRoute = getRouteInfo(location.pathname);
  const churchLifeIsActive =
    currentRoute !== undefined && CHURCH_LIFE_NAVIGATION.includes(currentRoute.id);
  const churchLifeSubpages = CHURCH_LIFE_NAVIGATION.filter((routeId) => routeId !== 'community');

  useEffect(() => {
    setOpened(false);
    setChurchLifeMenuOpened(false);
  }, [location.pathname]);

  const items = PRIMARY_NAVIGATION.map((routeId) => {
    if (routeId === 'community') {
      return (
        <Popover
          key={routeId}
          opened={churchLifeMenuOpened}
          onChange={setChurchLifeMenuOpened}
          position="bottom-start"
          offset={8}
          width={320}
          shadow="lg"
        >
          <Popover.Target>
            <button
              type="button"
              className={`${classes.link} ${classes.menuTrigger} ${
                churchLifeIsActive ? classes.active : ''
              }`}
              aria-controls={churchLifeMenuOpened ? churchLifeMenuId : undefined}
              aria-expanded={churchLifeMenuOpened}
              aria-label={content.common.churchLifeMenu.openLabel}
              data-expanded={churchLifeMenuOpened}
              onClick={() => setChurchLifeMenuOpened((current) => !current)}
            >
              <span>{content.common.navigation.community}</span>
              <IconChevronDown size={15} stroke={2} aria-hidden="true" />
            </button>
          </Popover.Target>
          <Popover.Dropdown className={classes.churchLifeDropdown}>
            <nav id={churchLifeMenuId} aria-label={content.common.navigation.community}>
              <Link
                to={getLocalizedPath('community', locale)}
                className={classes.churchLifeHubItem}
              >
                <IconHome2
                  size={18}
                  stroke={1.8}
                  aria-hidden="true"
                  className={classes.churchLifeHubIcon}
                />
                <span>
                  <span className={classes.churchLifeHubTitle}>
                    {content.common.churchLifeMenu.hubLabel}
                  </span>
                  {` `}
                  <span className={classes.churchLifeHubDescription}>
                    {content.common.churchLifeMenu.hubDescription}
                  </span>
                </span>
              </Link>

              <Text
                component="span"
                className={`${classes.mobileSectionTitle} ${classes.churchLifeMenuLabel}`}
              >
                {content.common.churchLifeMenu.subpagesLabel}
              </Text>
              {churchLifeSubpages.map((subpageId) => (
                <Link
                  key={subpageId}
                  to={getLocalizedPath(subpageId, locale)}
                  className={classes.churchLifeSubLink}
                >
                  {content.common.navigation[subpageId]}
                </Link>
              ))}
            </nav>
          </Popover.Dropdown>
        </Popover>
      );
    }

    return (
      <NavLink
        key={routeId}
        to={getLocalizedPath(routeId, locale)}
        end={routeId === 'home'}
        className={({ isActive }) =>
          isActive ? `${classes.link} ${classes.active}` : classes.link
        }
      >
        {content.common.navigation[routeId]}
      </NavLink>
    );
  });

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
