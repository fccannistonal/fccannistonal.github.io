import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent } from '@/test-utils';
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
    expect(screen.queryByText(/mdiv from candler/i)).not.toBeVisible();

    await user.click(screen.getAllByText(/read full biography/i)[0]);
    expect(screen.getByText(/mdiv from candler/i)).toBeVisible();
  });
});
