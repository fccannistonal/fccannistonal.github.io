import { Box, Paper, Text, Title } from '@mantine/core';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: Props) {
  return (
    <Paper
      p={{ base: 'xl', md: '3rem' }}
      radius="xl"
      withBorder
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255, 249, 240, 0.98), rgba(240, 228, 211, 0.94))',
        borderColor: 'rgba(83, 59, 39, 0.08)',
      }}
    >
      <Box
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 'auto -40px -40px auto',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(222, 129, 54, 0.12)',
          filter: 'blur(2px)',
        }}
      />
      <Box
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-40px auto auto -40px',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(99, 139, 73, 0.12)',
        }}
      />

      <Text
        size="sm"
        fw={700}
        tt="uppercase"
        c="#8c633d"
        style={{ letterSpacing: '0.18em', position: 'relative' }}
      >
        {eyebrow}
      </Text>
      <Title order={1} mt="sm" maw={760} style={{ position: 'relative' }}>
        {title}
      </Title>
      <Text c="dimmed" mt="md" maw={700} size="lg" style={{ position: 'relative' }}>
        {description}
      </Text>
    </Paper>
  );
}
