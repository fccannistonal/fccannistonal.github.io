import { MemoryRouter, useLocation } from 'react-router-dom';
import { axe, render, screen, userEvent } from '@/test-utils';
import { HeaderSimple } from './HeaderSimple';

function CurrentPath() {
  return <output>{useLocation().pathname}</output>;
}

describe('HeaderSimple', () => {
  axe([
    <MemoryRouter key="router">
      <HeaderSimple />
    </MemoryRouter>,
  ]);

  it('renders localized primary navigation and giving', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/es']}>
        <HeaderSimple />
      </MemoryRouter>
    );

    expect(
      container.querySelector('source[srcset="/images/brand/fcc-logo-128.avif"]')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visita/i })).toHaveAttribute('href', '/es/visita');
    expect(screen.getByRole('link', { name: /donar en línea/i })).toHaveAttribute(
      'href',
      'https://give.tithe.ly/?formId=c23cd1bd-eeab-4311-a159-15b079e46baf'
    );
  });

  it('shows social links in the mobile navigation drawer without act warnings', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HeaderSimple />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    expect(await screen.findByRole('link', { name: /follow on facebook/i })).toHaveAttribute(
      'href',
      'https://www.facebook.com/FCCAnniston'
    );
    expect(screen.getByRole('link', { name: /explore our linktree/i })).toHaveAttribute(
      'href',
      'https://linktr.ee/fccanniston'
    );
  });

  it('preserves the equivalent route when switching language', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/community/hispanic-ministry']}>
        <HeaderSimple />
        <CurrentPath />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('link', { name: /ver el sitio en español/i }));
    expect(screen.getByText('/es/comunidad/ministerio-hispano')).toBeInTheDocument();
  });
});
