import { MemoryRouter } from 'react-router-dom';
import { axe, render } from '@/test-utils';
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
  });
});
