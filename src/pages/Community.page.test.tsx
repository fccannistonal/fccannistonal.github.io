import { MemoryRouter } from 'react-router-dom';
import { axe, render, screen } from '@/test-utils';
import { diversityTheater } from '../content/churchContent';
import { CommunityPage } from './Community.page';

describe('CommunityPage', () => {
  axe([
    <MemoryRouter key="router">
      <CommunityPage />
    </MemoryRouter>,
  ]);

  it('renders the Diversity Theater story and founder profile', () => {
    render(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /diversity theater company/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: diversityTheater.founderName })).toBeInTheDocument();
    expect(screen.getByText(diversityTheater.introduction[0])).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: /facebook/i })
        .every((link) => link.getAttribute('href')?.includes('facebook.com'))
    ).toBe(true);
  });

  it('renders accessible production photography', () => {
    render(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>
    );

    expect(screen.getByAltText(diversityTheater.heroImage.alt)).toBeInTheDocument();
    diversityTheater.galleryImages.forEach((image) => {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    });
    expect(screen.getByAltText(diversityTheater.founderPortrait.alt)).toBeInTheDocument();
  });
});
