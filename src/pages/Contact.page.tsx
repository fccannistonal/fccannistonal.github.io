import { IconArrowUpRight, IconMapPin, IconSparkles } from '@tabler/icons-react';
import {
  Badge,
  Button,
  Container,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ContactForm } from '../components/church/ContactForm';
import { PageHeader } from '../components/church/PageHeader';
import { siteConfig } from '../content/churchContent';

export function ContactPage() {
  return (
    <Container size="xl" py={{ base: 'xl', md: '4rem' }}>
      <PageHeader
        eyebrow={siteConfig.denomination}
        title="Contact us"
        description="Combine clear contact information with a simple message form so first-time visitors have an easy next step."
      />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mt="xl">
        <Stack gap="xl">
          <Paper withBorder p={{ base: 'lg', md: 'xl' }}>
            <Badge variant="light" color="brand">
              Visit and connect
            </Badge>
            <Title order={2} mt="md">
              Contact details and visit planning
            </Title>
            <Text c="dimmed" mt="sm">
              Keep the essentials in one place, then replace placeholder values in the content file
              as the final church information is confirmed.
            </Text>

            <Stack gap="md" mt="xl">
              {siteConfig.contactDetails.map((detail) => (
                <div key={detail.label}>
                  <Text fw={700}>{detail.label}</Text>
                  <Text>{detail.value}</Text>
                  {detail.helper ? (
                    <Text size="sm" c="dimmed" mt={4}>
                      {detail.helper}
                    </Text>
                  ) : null}
                </div>
              ))}
            </Stack>

            <List
              mt="xl"
              spacing="sm"
              icon={
                <ThemeIcon color="moss" variant="light" radius="xl" size={28}>
                  <IconSparkles size={16} stroke={1.7} />
                </ThemeIcon>
              }
            >
              {siteConfig.serviceNotes.map((note) => (
                <List.Item key={note}>
                  <Text c="dimmed">{note}</Text>
                </List.Item>
              ))}
            </List>

            <Group mt="xl">
              {siteConfig.homeActions.map((action) => (
                <Button
                  key={action.id}
                  component="a"
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noreferrer' : undefined}
                  variant="light"
                  rightSection={<IconArrowUpRight size={16} />}
                >
                  {action.title}
                </Button>
              ))}
            </Group>
          </Paper>

          <Paper withBorder p={0} radius="xl" style={{ overflow: 'hidden', minHeight: 360 }}>
            <iframe
              src={siteConfig.mapEmbedUrl}
              title="Contact page map showing the church's Anniston location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', minHeight: 360 }}
            />
          </Paper>

          <Paper withBorder p="lg">
            <Group gap="sm">
              <ThemeIcon color="brand" variant="light" radius="xl" size={38}>
                <IconMapPin size={18} stroke={1.7} />
              </ThemeIcon>
              <div>
                <Title order={3}>Location placeholder</Title>
                <Text c="dimmed">{siteConfig.addressLines.join(' • ')}</Text>
              </div>
            </Group>
          </Paper>
        </Stack>

        <ContactForm />
      </SimpleGrid>
    </Container>
  );
}
