import { IconArrowUpRight, IconBrandFacebook, IconBrandLinktree } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Anchor, Container, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
import { trackGivingIntent } from '../../lib/googleAnalytics';
import classes from './FooterSimple.module.css';

export function FooterSimple() {
  const navItems = siteConfig.navigation.map((link) => (
    <Anchor
      component={Link}
      c="inherit"
      key={link.label}
      to={link.href}
      size="sm"
      className={classes.link}
    >
      {link.label}
    </Anchor>
  ));

  const actionItems = siteConfig.homeActions.map((link) => (
    <Anchor<'a'>
      c="inherit"
      key={link.id}
      href={link.href}
      size="sm"
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
      className={classes.link}
      onClick={link.id === 'give' ? trackGivingIntent : undefined}
    >
      {link.title}
    </Anchor>
  ));

  const socialItems = siteConfig.socialLinks.map((link) => {
    const Icon = link.id === 'facebook' ? IconBrandFacebook : IconBrandLinktree;

    return (
      <Anchor<'a'>
        c="inherit"
        key={link.id}
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={classes.socialLink}
        aria-label={`${link.cta} (opens in a new tab)`}
      >
        <ThemeIcon
          size={38}
          radius="xl"
          variant="light"
          color={link.id === 'facebook' ? 'blue' : 'moss'}
        >
          <Icon size={20} stroke={1.8} />
        </ThemeIcon>
        <span className={classes.socialLinkText}>
          <Text component="span" fw={700} size="sm">
            {link.title}
          </Text>
          <Text component="span" c="dimmed" size="xs">
            {link.cta}
          </Text>
        </span>
        <IconArrowUpRight className={classes.socialArrow} size={17} stroke={1.8} />
      </Anchor>
    );
  });

  return (
    <div className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          <Stack gap="xs">
            <Link to="/" className={classes.brand}>
              <span className={classes.logoMark}>
                <img src={siteConfig.logoSrc} alt="" />
              </span>
              <span>
                <Text className={classes.kicker}>{siteConfig.denomination}</Text>
                <Text className={classes.wordmark}>{siteConfig.name}</Text>
              </span>
            </Link>
            <Text c="dimmed" size="sm" maw={320}>
              {siteConfig.contactSummary}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Text className={classes.sectionTitle}>Explore</Text>
            <Group gap="xs" className={classes.links}>
              {navItems}
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text className={classes.sectionTitle}>Online Links</Text>
            <Group gap="xs" className={classes.links}>
              {actionItems}
            </Group>
          </Stack>

          <Stack gap="sm">
            <Text className={classes.sectionTitle}>Connect</Text>
            <Stack gap="xs">{socialItems}</Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </div>
  );
}
