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
      screen.getByRole('img', {
        name: /stone exterior of first christian church anniston framed by a large tree at sunset/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByTitle(/uplifting sermons by pastor laura hutchinson on spotify/i)
    ).toHaveAttribute('height', '152');
    expect(screen.getByRole('link', { name: /^give$/i })).toHaveAttribute(
      'href',
      'https://give.tithe.ly/?formId=c23cd1bd-eeab-4311-a159-15b079e46baf'
    );
    expect(
      screen.queryByRole('link', { name: /open secure giving form/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /come check us out/i })).toBeInTheDocument();
    expect(
      screen.getByRole('region', {
        name: /life at first christian church photo gallery/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /church leader sharing a children’s moment with two children/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /communion table arranged with breads, cups, candles/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: /five first christian church staff members laughing together/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/swipe or drag to explore/i)).toBeInTheDocument();
    expect(screen.getByText(/photo 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next photos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous photos/i })).toBeDisabled();
    expect(
      screen.getByRole('link', { name: /follow on facebook \(opens in a new tab\)/i })
    ).toHaveAttribute('href', 'https://www.facebook.com/FCCAnniston');
    expect(
      screen.getByRole('link', { name: /explore our linktree \(opens in a new tab\)/i })
    ).toHaveAttribute('href', 'https://linktr.ee/fccanniston');
    expect(screen.getByTitle("Map showing the church's Anniston location")).toBeInTheDocument();
  });
});
