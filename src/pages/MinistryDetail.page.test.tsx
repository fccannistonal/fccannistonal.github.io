import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import {
  HispanicMinistryPage,
  ServiceAndOutreachPage,
  WonderAndWorshipPage,
  WorshipAndMusicPage,
} from './MinistryDetail.page';

describe('MinistryDetailPage', () => {
  it('renders worship content, leadership, and primary actions', () => {
    render(
      <MemoryRouter>
        <WorshipAndMusicPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /sunday worship/i })).toBeInTheDocument();
    expect(screen.getByText(/primarily in English/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /a multilingual welcome/i })).toBeInTheDocument();
    expect(screen.getByText(/All are welcome at Christ’s table/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gerald Roberts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Jason Wright' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /plan your visit/i })).toHaveAttribute(
      'href',
      '/visit'
    );
    expect(screen.getByRole('link', { name: /listen to sermons/i })).toHaveAttribute(
      'href',
      'https://open.spotify.com/show/7BOIacUOhCI3jN6PcfLPUc'
    );
  });

  it('renders children’s ministry without unsupported age or check-in details', () => {
    render(
      <MemoryRouter>
        <WonderAndWorshipPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /children’s ministry/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/having a very normal hard morning/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /we adapt to the needs/i })).toBeInTheDocument();
    expect(screen.getByText(/sensory needs, accessibility needs/i)).toBeInTheDocument();
    expect(screen.queryByText(/check-in/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ages? \d/i)).not.toBeInTheDocument();
  });

  it('renders Spanish worship detail', () => {
    render(
      <MemoryRouter initialEntries={['/es/comunidad/adoracion-dominical']}>
        <WorshipAndMusicPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /adoración dominical/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/incluimos español con regularidad/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Todas las personas son bienvenidas a la mesa/i).length
    ).toBeGreaterThan(0);
  });

  it('renders Hispanic ministry leadership and Spanish-route content', () => {
    render(
      <MemoryRouter initialEntries={['/es/comunidad/ministerio-hispano']}>
        <HispanicMinistryPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /ministerio hispano/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rev. Maria Zamarripa' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /capellanía comunitaria/i })).toBeInTheDocument();
  });

  it('renders all current outreach programs and omits Makers Market', () => {
    render(
      <MemoryRouter>
        <ServiceAndOutreachPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /service and outreach/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/oxfordfest/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/jacksonville state university/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/older adults/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/church space|space for community groups/i).length).toBeGreaterThan(
      0
    );
    expect(screen.queryByText(/maker'?s market/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ask about volunteering/i })).toHaveAttribute(
      'href',
      '/contact?source=serviceAndOutreach&interest=volunteer'
    );
    expect(screen.getByRole('link', { name: /request church space/i })).toHaveAttribute(
      'href',
      '/contact?source=serviceAndOutreach&interest=space-request'
    );
  });
});
