import { Link } from 'react-router-dom';
import { Anchor, Container, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { siteConfig } from '../../content/churchContent';
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
    >
      {link.title}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container size="xl" className={classes.inner}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
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
        </SimpleGrid>
      </Container>
    </div>
  );
}
