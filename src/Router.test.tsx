import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { getRedirectPathKey, restoreRedirectPath } from './lib/githubPages';
import { Router, routes } from './Router';

describe('Router', () => {
  it.each([
    ['/', /all are welcome/i],
    ['/staff', /meet the staff/i],
    ['/outreach', /community outreach/i],
    ['/contact', /contact us/i],
    ['/missing', /page not found/i],
  ])('renders %s', (pathname, heading) => {
    const router = createMemoryRouter(routes, { initialEntries: [pathname] });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('renders a path restored by the GitHub Pages fallback on first load', () => {
    window.history.replaceState(null, '', '/');
    window.sessionStorage.setItem(getRedirectPathKey(), '/staff');

    restoreRedirectPath();
    render(<Router />);

    expect(window.location.pathname).toBe('/staff');
    expect(screen.getByRole('heading', { name: /meet the staff/i })).toBeInTheDocument();
  });
});
