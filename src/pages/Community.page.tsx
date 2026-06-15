import type { ComponentType } from 'react';
import {
  IconArrowRight,
  IconBell,
  IconHeartHandshake,
  IconLanguage,
  IconMusic,
  IconSparkles,
  IconTheater,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Paper, SimpleGrid, Text, ThemeIcon, Title } from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';
import { getLocalizedPath } from '../lib/routing';
import classes from './Community.page.module.css';

const CARD_ICONS: Record<string, ComponentType<{ size?: number; stroke?: number }>> = {
  worship: IconMusic,
  children: IconSparkles,
  hispanic: IconLanguage,
  theater: IconTheater,
  outreach: IconHeartHandshake,
  updates: IconBell,
};

export function CommunityPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.community.eyebrow}
        title={content.community.title}
        description={content.community.description}
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
        {content.community.cards.map((card) => {
          const Icon = CARD_ICONS[card.id] ?? IconSparkles;
          const href = card.routeId ? getLocalizedPath(card.routeId, locale) : card.href;

          return (
            <Paper
              key={card.id}
              component={Link}
              to={href ?? getLocalizedPath('contact', locale)}
              withBorder
              p="lg"
              className={classes.card}
            >
              <ThemeIcon size={48} radius="xl" variant="light" color="brand">
                <Icon size={25} stroke={1.7} />
              </ThemeIcon>
              <Title order={2} mt="lg">
                {card.title}
              </Title>
              <Text c="dimmed" mt="sm">
                {card.description}
              </Text>
              <Text className={classes.cardCta}>
                {content.common.learnMore} <IconArrowRight size={16} aria-hidden="true" />
              </Text>
            </Paper>
          );
        })}
      </SimpleGrid>

      <Paper
        withBorder
        p={{ base: 'lg', md: 'xl' }}
        mt={{ base: '3rem', md: '5rem' }}
        className={classes.invitation}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <div>
            <Title order={2}>{content.community.invitationTitle}</Title>
            <Text c="dimmed" size="lg" mt="md">
              {content.community.invitationCopy}
            </Text>
          </div>
          <Group align="center" justify="center">
            <Button
              component={Link}
              to={getLocalizedPath('contact', locale)}
              size="lg"
              rightSection={<IconArrowRight size={18} />}
            >
              {content.community.invitationCta}
            </Button>
          </Group>
        </SimpleGrid>
      </Paper>
    </Container>
  );
}
