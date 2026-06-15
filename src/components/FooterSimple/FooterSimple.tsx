import { IconArrowUpRight, IconBrandFacebook, IconBrandLinktree } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Anchor, Container, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { getShellContent } from '../../content/localizedShellContent';
import { trackGivingIntent } from '../../lib/googleAnalytics';
import { useLocale } from '../../lib/i18n';
import { getLocalizedPath, type RouteId } from '../../lib/routing';
import { BrandLogo } from '../BrandLogo/BrandLogo';
import classes from './FooterSimple.module.css';

const FOOTER_ROUTES: RouteId[] = [
  'visit',
  'about',
  'community',
  'staff',
  'updates',
  'contact',
  'privacy',
];

export function FooterSimple() {
  const locale = useLocale();
  const content = getShellContent(locale);

  return (
    <div className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <Stack gap="xs">
            <Link
              to={getLocalizedPath('home', locale)}
              className={classes.brand}
              aria-label={content.common.churchName}
            >
              <BrandLogo className={classes.logoMark} />
              <span>
                <Text className={classes.kicker}>{content.common.denomination}</Text>
                <Text className={classes.wordmark}>{content.common.churchName}</Text>
              </span>
            </Link>
            <Text c="dimmed" size="sm" maw={320}>
              {content.common.footerSummary}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Text className={classes.sectionTitle}>{content.common.footerExplore}</Text>
            <Group gap="xs" className={classes.links}>
              {FOOTER_ROUTES.map((routeId) => (
                <Anchor
                  component={Link}
                  c="inherit"
                  key={routeId}
                  to={getLocalizedPath(routeId, locale)}
                  size="sm"
                  className={classes.link}
                >
                  {content.common.navigation[routeId]}
                </Anchor>
              ))}
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text className={classes.sectionTitle}>{content.common.footerOnline}</Text>
            <Anchor
              c="inherit"
              href={siteConfig.sermonUrl}
              size="sm"
              target="_blank"
              rel="noreferrer"
              className={classes.link}
            >
              {content.sermonsLabel}
            </Anchor>
            <Anchor
              c="inherit"
              href={siteConfig.givingFormUrl}
              size="sm"
              target="_blank"
              rel="noreferrer"
              className={classes.link}
              onClick={() => trackGivingIntent(locale)}
            >
              {content.common.give}
            </Anchor>
          </Stack>

          <Stack gap="sm">
            <Text className={classes.sectionTitle}>{content.common.footerConnect}</Text>
            <Anchor
              c="inherit"
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.socialLink}
              aria-label={`${content.common.social.facebookCta} (${content.common.opensNewTab})`}
            >
              <ThemeIcon size={38} radius="xl" variant="light" color="blue">
                <IconBrandFacebook size={20} stroke={1.8} />
              </ThemeIcon>
              <span className={classes.socialLinkText}>
                <Text component="span" fw={700} size="sm">
                  {content.common.social.facebookTitle}
                </Text>
                <Text component="span" c="dimmed" size="xs">
                  {content.common.social.facebookCta}
                </Text>
              </span>
              <IconArrowUpRight className={classes.socialArrow} size={17} stroke={1.8} />
            </Anchor>
            <Anchor
              c="inherit"
              href={siteConfig.linktreeUrl}
              target="_blank"
              rel="noreferrer"
              className={classes.socialLink}
              aria-label={`${content.common.social.linktreeCta} (${content.common.opensNewTab})`}
            >
              <ThemeIcon size={38} radius="xl" variant="light" color="moss">
                <IconBrandLinktree size={20} stroke={1.8} />
              </ThemeIcon>
              <span className={classes.socialLinkText}>
                <Text component="span" fw={700} size="sm">
                  {content.common.social.linktreeTitle}
                </Text>
                <Text component="span" c="dimmed" size="xs">
                  {content.common.social.linktreeCta}
                </Text>
              </span>
              <IconArrowUpRight className={classes.socialArrow} size={17} stroke={1.8} />
            </Anchor>
          </Stack>
        </SimpleGrid>
      </Container>
    </div>
  );
}
