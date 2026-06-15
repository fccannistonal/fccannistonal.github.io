import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen } from '@/test-utils';
import { FooterSimple } from './FooterSimple';

describe('FooterSimple', () => {
  axe([
    <MemoryRouter key="router">
      <FooterSimple />
    </MemoryRouter>,
  ]);

  it('renders localized route and social links', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/es']}>
        <FooterSimple />
      </MemoryRouter>
    );

    expect(
      container.querySelector('source[srcset="/images/brand/fcc-logo-128.avif"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacidad/i })).toHaveAttribute(
      'href',
      '/es/privacidad'
    );
    expect(
      screen.getByRole('link', { name: /seguir en facebook \(se abre en una pestaña nueva\)/i })
    ).toHaveAttribute('href', 'https://www.facebook.com/FCCAnniston');
  });
});
