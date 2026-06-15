import { Container, Paper, Stack, Text, Title } from '@mantine/core';
import { PageHeader } from '../components/church/PageHeader';
import { PrivacyPreferences } from '../components/church/PrivacyPreferences';
import { getContent } from '../content/localizedContent';
import { useLocale } from '../lib/i18n';

export function PrivacyPage() {
  const locale = useLocale();
  const content = getContent(locale);

  return (
    <Container size="lg" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={content.privacy.eyebrow}
        title={content.privacy.title}
        description={content.privacy.description}
      />

      <Stack gap="lg" mt="xl">
        {content.privacy.sections.map((section) => (
          <Paper key={section.title} withBorder p={{ base: 'lg', md: 'xl' }}>
            <Title order={2}>{section.title}</Title>
            <Stack gap="md" mt="md">
              {section.paragraphs.map((paragraph) => (
                <Text key={paragraph} c="dimmed" size="lg">
                  {paragraph}
                </Text>
              ))}
            </Stack>
          </Paper>
        ))}
        <PrivacyPreferences />
      </Stack>
    </Container>
  );
}
