import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { routes } from './Router';

describe('Router', () => {
  it.each([
    ['/', /welcome to first christian church anniston/i],
    ['/staff', /meet the staff/i],
    ['/outreach', /community outreach/i],
    ['/contact', /contact us/i],
    ['/missing', /page not found/i],
  ])('renders %s', (pathname, heading) => {
    const router = createMemoryRouter(routes, { initialEntries: [pathname] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
