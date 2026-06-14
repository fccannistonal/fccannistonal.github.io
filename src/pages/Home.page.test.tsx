import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { HomePage } from './Home.page';

describe('HomePage', () => {
  it('renders the WordPress homepage content, carousel controls, and map', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /all are welcome/i })).toBeInTheDocument();
    expect(screen.getByText('Sunday School')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.getByText('11:30 AM')).toBeInTheDocument();
    expect(
      screen.getByTitle(/uplifting sermons by pastor laura hutchinson on spotify/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^give$/i })).toHaveAttribute(
      'data-form',
      'c23cd1bd-eeab-4311-a159-15b079e46baf'
    );
    expect(screen.getByRole('heading', { name: /come check us out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
    expect(screen.getByTitle("Map showing the church's Anniston location")).toBeInTheDocument();
  });
});
