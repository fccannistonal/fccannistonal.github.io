import { MemoryRouter } from 'react-router-dom';
import { axe, render } from '@/test-utils';
import attributes from './attributes.json';
import { FooterSimple } from './FooterSimple';

describe('FooterSimple', () => {
  axe([
    <MemoryRouter key="router">
      <FooterSimple {...(attributes as any)} />
    </MemoryRouter>,
  ]);

  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <FooterSimple {...(attributes as any)} />
      </MemoryRouter>
    );
  });
});
