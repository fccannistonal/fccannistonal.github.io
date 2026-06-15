import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { CommunityPage } from './Community.page';
import { DiversityTheaterPage } from './DiversityTheater.page';

describe('Community pages', () => {
  it('renders a broad church-life landing page', () => {
    render(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /faith takes shape in community/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /diversity theater company/i })).toHaveAttribute(
      'href',
      '/community/diversity-theater'
    );
    expect(screen.getByRole('link', { name: /current announcements/i })).toHaveAttribute(
      'href',
      '/updates'
    );
  });

  it('renders the localized Diversity Theater story and founder profile', () => {
    render(
      <MemoryRouter initialEntries={['/es/comunidad/teatro-diversidad']}>
        <DiversityTheaterPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /compañía de teatro diversidad/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Maury Evans' })).toBeInTheDocument();
    expect(screen.getByAltText(/el elenco de una producción del oeste/i)).toBeInTheDocument();
  });
});
