import { act } from 'react';
import { axe as jestAxe } from 'jest-axe';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@/test-utils';
import { ANALYTICS_CONSENT_KEY } from '../lib/googleAnalytics';
import { localizedRoutes } from '../lib/routing';
import { routes } from '../Router';

describe('localized route accessibility', () => {
  beforeEach(() => {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, 'denied');
  });

  it.each(localizedRoutes.map((route) => [route.path]))(
    '%s has no automated accessibility violations',
    async (pathname) => {
      const router = createMemoryRouter(routes, { initialEntries: [pathname] });
      const { container, unmount } = render(<RouterProvider router={router} />);

      await screen.findByRole('heading', { level: 1 });
      await act(async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 0));
      });
      const results = await jestAxe(container);

      expect(results.violations).toHaveLength(0);
      unmount();
    }
  );
});
