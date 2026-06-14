import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { HomePage } from './Home.page';

describe('HomePage', () => {
  it('renders the online links, carousel controls, and map', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /listen to the podcast/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /join on zoom/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /give through tithe\.ly/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next slide/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous slide/i })).toBeInTheDocument();
    expect(screen.getByTitle("Map showing the church's Anniston location")).toBeInTheDocument();
  });
});
