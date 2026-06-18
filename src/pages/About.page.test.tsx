import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { AboutPage } from './About.page';
import { MembershipPage } from './Membership.page';
import { RecommendedReadingPage } from './RecommendedReading.page';

describe('About pages', () => {
  it('renders the expanded welcome, mission, and Disciples identity copy', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /welcome to first christian church/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/unity without requiring uniformity/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /our mission/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our denominational home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /membership and baptism/i })).toHaveAttribute(
      'href',
      '/about/membership-and-baptism'
    );
    expect(screen.getByRole('link', { name: /recommended reading/i })).toHaveAttribute(
      'href',
      '/about/recommended-reading'
    );
  });

  it('renders membership and baptism guidance', () => {
    render(
      <MemoryRouter>
        <MembershipPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /membership and baptism/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/confession of faith in Jesus Christ/i)).toBeInTheDocument();
    expect(screen.getByText(/baptism by immersion/i)).toBeInTheDocument();
    expect(screen.getByText(/associate membership may also be available/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact the church/i })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('renders recommended reading categories', () => {
    render(
      <MemoryRouter>
        <RecommendedReadingPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /recommended reading/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /spiritual growth/i })).toBeInTheDocument();
    expect(screen.getByText(/An Altar in the World/i)).toBeInTheDocument();
    expect(screen.getByText(/The Stone-Campbell Movement/i)).toBeInTheDocument();
    expect(screen.getByText(/not a required reading list/i)).toBeInTheDocument();
  });
});
