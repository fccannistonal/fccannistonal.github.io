import { useState } from 'react';
import { IconPhoto } from '@tabler/icons-react';
import { AspectRatio, Box, Center, Stack, Text, ThemeIcon } from '@mantine/core';
import classes from './ContentImage.module.css';

type Props = {
  src?: string;
  alt: string;
  label: string;
  description?: string;
  ratio?: number;
  className?: string;
};

export function ContentImage({ src, alt, label, description, ratio = 4 / 3, className }: Props) {
  const [hasError, setHasError] = useState(false);
  const showImage = Boolean(src) && !hasError;

  return (
    <Box className={[classes.frame, className].filter(Boolean).join(' ')}>
      <AspectRatio ratio={ratio}>
        {showImage ? (
          <Box
            component="img"
            src={src}
            alt={alt}
            className={classes.image}
            onError={() => setHasError(true)}
          />
        ) : (
          <Center className={classes.placeholder}>
            <Stack gap="xs" align="center">
              <ThemeIcon size={52} radius="xl" variant="light" color="brand">
                <IconPhoto size={26} stroke={1.6} />
              </ThemeIcon>
              <Text fw={700} ta="center">
                {label}
              </Text>
              {description ? (
                <Text size="sm" c="dimmed" ta="center" maw={260}>
                  {description}
                </Text>
              ) : null}
            </Stack>
          </Center>
        )}
      </AspectRatio>
    </Box>
  );
}
