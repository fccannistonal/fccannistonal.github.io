import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import './index.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Router />
    </MantineProvider>
  );
}
