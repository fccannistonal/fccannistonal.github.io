import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen } from '@/test-utils';
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
});
