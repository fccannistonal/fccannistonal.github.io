import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  defaultRadius: 'lg',
  fontFamily: '"Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif',
  headings: {
    fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
    sizes: {
      h1: { fontSize: 'clamp(2.8rem, 7vw, 5.25rem)', lineHeight: '1.02', fontWeight: '700' },
      h2: { fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: '1.08', fontWeight: '700' },
      h3: { fontSize: 'clamp(1.35rem, 3vw, 1.9rem)', lineHeight: '1.15', fontWeight: '700' },
    },
  },
  colors: {
    brand: [
      '#fdf3e7',
      '#f9e3cb',
      '#f2c89f',
      '#ebac72',
      '#e5944d',
      '#de8136',
      '#c9702b',
      '#a85d21',
      '#874816',
      '#66340b',
    ],
    moss: [
      '#eef4ea',
      '#dce7d4',
      '#b8cba9',
      '#92b07d',
      '#74995b',
      '#638b49',
      '#54793b',
      '#44642f',
      '#344e23',
      '#243917',
    ],
  },
  white: '#fffdf9',
  black: '#241a12',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'xl',
      },
    },
  },
});
