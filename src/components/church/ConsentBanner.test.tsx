import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent, waitFor } from '@/test-utils';
import { ANALYTICS_CONSENT_KEY } from '../../lib/googleAnalytics';
import { AnalyticsRouteTracker } from './AnalyticsRouteTracker';
import { ConsentBanner } from './ConsentBanner';

const trackPageViewMock = vi.hoisted(() => vi.fn());

vi.mock('../../lib/googleAnalytics', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/googleAnalytics')>();

  return {
    ...actual,
    trackPageView: trackPageViewMock,
  };
});

describe('ConsentBanner', () => {
  beforeEach(() => {
    trackPageViewMock.mockClear();
    window.localStorage.clear();
  });

  it('keeps analytics cookies off when the visitor declines and saves the decision', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ConsentBanner />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /your privacy choices/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBeNull();

    await user.click(screen.getByRole('button', { name: /keep analytics cookies off/i }));

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('denied');
    expect(
      screen.queryByRole('heading', { name: /your privacy choices/i })
    ).not.toBeInTheDocument();
  });

  it('tracks the current route once through consent mode before the visitor chooses', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/visit?source=banner']}>
        <AnalyticsRouteTracker />
        <ConsentBanner />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(trackPageViewMock).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByRole('button', { name: /allow analytics/i }));

    expect(trackPageViewMock).toHaveBeenCalledWith('/visit?source=banner', 'en');
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('granted');
  });
});
