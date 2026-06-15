import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen, userEvent } from '@/test-utils';
import attributes from './attributes.json';
import { HeaderSimple } from './HeaderSimple';

describe('HeaderSimple', () => {
  axe([
    <MemoryRouter key="router">
      <HeaderSimple {...(attributes as any)} />
    </MemoryRouter>,
  ]);

  it('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <HeaderSimple {...(attributes as any)} />
      </MemoryRouter>
    );

    expect(container.querySelector('img[src="/images/brand/fcc-logo.png"]')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /give online/i })).toHaveAttribute(
      'href',
      'https://give.tithe.ly/?formId=c23cd1bd-eeab-4311-a159-15b079e46baf'
    );
  });

  it('shows social links in the mobile navigation drawer', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HeaderSimple {...(attributes as any)} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /toggle navigation/i }));

    expect(screen.getByRole('link', { name: /follow on facebook/i })).toHaveAttribute(
      'href',
      'https://www.facebook.com/FCCAnniston'
    );
    expect(screen.getByRole('link', { name: /explore our linktree/i })).toHaveAttribute(
      'href',
      'https://linktr.ee/fccanniston'
    );
  });
});
