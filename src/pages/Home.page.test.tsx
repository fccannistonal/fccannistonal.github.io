import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent } from '@/test-utils';
import { HomePage } from './Home.page';

describe('HomePage', () => {
  it('prioritizes visit information and defers third-party embeds', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/worship sundays at 11:30 am/i)).toBeInTheDocument();
    expect(screen.getAllByText(/1327 leighton ave\., anniston/i).length).toBeGreaterThan(0);
    expect(
      screen
        .getAllByRole('link', { name: /plan your visit/i })
        .every((link) => link.getAttribute('href') === '/visit')
    ).toBe(true);
    expect(screen.getByRole('heading', { name: /all are welcome/i })).toBeInTheDocument();
    expect(
      screen.getByRole('region', {
        name: /life at first christian church photo gallery/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByTitle(/uplifting sermons by pastor laura hutchinson/i)
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /load spotify sermons/i }));
    expect(screen.getByTitle(/uplifting sermons by pastor laura hutchinson/i)).toBeInTheDocument();

    expect(
      screen.queryByTitle(/map showing first christian church anniston/i)
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /load google map/i }));
    expect(screen.getByTitle(/map showing first christian church anniston/i)).toBeInTheDocument();
  });

  it('renders Spanish-owned content on the Spanish route', () => {
    render(
      <MemoryRouter initialEntries={['/es']}>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/adoración los domingos a las 11:30 am/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /todas las personas son bienvenidas/i })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('link', { name: /planifique su visita/i })
        .every((link) => link.getAttribute('href') === '/es/visita')
    ).toBe(true);
  });
});
