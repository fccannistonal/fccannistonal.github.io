import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent, waitFor } from '@/test-utils';
import { StaffPage } from './Staff.page';

describe('StaffPage', () => {
  it('shows concise profiles with optional expanded biographies', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <StaffPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Rev. Laura Hutchinson' })).toBeInTheDocument();
    expect(
      screen.getByText(/has served first christian church anniston since 2012/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Connect with Rev. Laura Hutchinson')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/hutchinsonlaura/'
    );
    expect(screen.getByRole('link', { name: /finding jesus/i })).toHaveAttribute(
      'href',
      'https://www.amazon.com/Finding-Jesus-Rev-Laura-Hutchinson/dp/B0G64NCBBH'
    );
    expect(screen.getByRole('link', { name: /anniston star column/i })).toHaveAttribute(
      'href',
      'https://www.annistonstar.com/features/faith/religion_roundtable/voices-of-faith-advice-for-21-year-old-me/article_f089c79b-e298-4222-a81d-de7079bfafe1.html'
    );
    expect(screen.getByRole('link', { name: /untangling faith podcast/i })).toHaveAttribute(
      'href',
      'https://open.spotify.com/show/12RFx6M0ro8dj1r0q2j2ty'
    );
    expect(screen.queryByText(/mdiv from candler/i)).not.toBeVisible();

    await user.click(screen.getAllByText(/read full biography/i)[0]);
    await waitFor(() => expect(screen.getByText(/mdiv from candler/i)).toBeVisible());
  });
});
