import { IconBrandFacebook, IconBrandLinktree, IconLanguage } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { getShellContent } from '../../content/localizedShellContent';
import { trackGivingIntent } from '../../lib/googleAnalytics';
import { rememberLocalePreference, useLocale } from '../../lib/i18n';
import { getAlternateLocalePath, getLocalizedPath } from '../../lib/routing';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import { CHURCH_LIFE_NAVIGATION, PRIMARY_NAVIGATION } from './navigation';
import classes from './HeaderSimple.module.css';

type MobileNavigationDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

export function MobileNavigationDrawer({ opened, onClose }: MobileNavigationDrawerProps) {
  const location = useLocation();
  const locale = useLocale();
  const content = getShellContent(locale);
  const alternatePath = getAlternateLocalePath(location.pathname);
  const alternateLocale = locale === 'en' ? 'es' : 'en';
  const churchLifeSubpages = CHURCH_LIFE_NAVIGATION.filter((routeId) => routeId !== 'community');

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <BrandLogo className={`${classes.logoMark} ${classes.drawerLogoMark}`} />
          <Text fw={700}>{content.common.shortName}</Text>
        </Group>
      }
      padding="lg"
      hiddenFrom="md"
      transitionProps={{ duration: 0 }}
      returnFocus={false}
    >
      <Stack gap="sm" component="nav" aria-label={content.common.navigationLabel}>
        {PRIMARY_NAVIGATION.map((routeId) => {
          if (routeId === 'community') {
            return (
              <div key={routeId} className={classes.mobileChurchLifeGroup}>
                <Link
                  to={getLocalizedPath(routeId, locale)}
                  className={`${classes.mobileLink} ${classes.mobileChurchLifeHub}`}
                >
                  <span>{content.common.churchLifeMenu.hubLabel}</span>
                  {` `}
                  <Text component="span" className={classes.mobileChurchLifeDescription}>
                    {content.common.churchLifeMenu.hubDescription}
                  </Text>
                </Link>
                <Text className={classes.mobileSectionTitle} mt="sm">
                  {content.common.churchLifeMenu.subpagesLabel}
                </Text>
                <Stack gap={6} mt="xs">
                  {churchLifeSubpages.map((subpageId) => (
                    <Link
                      key={subpageId}
                      to={getLocalizedPath(subpageId, locale)}
                      className={classes.mobileSubLink}
                    >
                      {content.common.navigation[subpageId]}
                    </Link>
                  ))}
                </Stack>
              </div>
            );
          }

          return (
            <Link
              key={routeId}
              to={getLocalizedPath(routeId, locale)}
              className={classes.mobileLink}
            >
              {content.common.navigation[routeId]}
            </Link>
          );
        })}

        <Divider my="sm" />

        <Button
          component={Link}
          to={alternatePath}
          variant="light"
          color="moss"
          leftSection={<IconLanguage size={18} aria-hidden="true" />}
          aria-label={content.common.switchLanguage}
          onClick={() => rememberLocalePreference(alternateLocale)}
        >
          {content.common.languageName}
        </Button>

        <Button
          component="a"
          href={siteConfig.givingFormUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackGivingIntent(locale)}
        >
          {content.common.give}
        </Button>

        <Divider my="xs" />

        <div>
          <Text className={classes.mobileSectionTitle}>{content.common.footerConnect}</Text>
          <Stack gap="xs" mt="sm">
            <Button
              component="a"
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              variant="light"
              color="blue"
              leftSection={<IconBrandFacebook size={19} stroke={1.8} />}
              className={classes.mobileSocialLink}
            >
              {content.common.social.facebookCta}
            </Button>
            <Button
              component="a"
              href={siteConfig.linktreeUrl}
              target="_blank"
              rel="noreferrer"
              variant="light"
              color="moss"
              leftSection={<IconBrandLinktree size={19} stroke={1.8} />}
              className={classes.mobileSocialLink}
            >
              {content.common.social.linktreeCta}
            </Button>
          </Stack>
        </div>
      </Stack>
    </Drawer>
  );
}
