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

  it('keeps analytics off until the visitor chooses and saves the decision', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ConsentBanner />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /your privacy choices/i })).toBeInTheDocument();
    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBeNull();

    await user.click(screen.getByRole('button', { name: /necessary only/i }));

    expect(window.localStorage.getItem(ANALYTICS_CONSENT_KEY)).toBe('denied');
    expect(
      screen.queryByRole('heading', { name: /your privacy choices/i })
    ).not.toBeInTheDocument();
  });

  it('tracks the current route once after the visitor allows analytics', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/visit?source=banner']}>
        <AnalyticsRouteTracker />
        <ConsentBanner />
      </MemoryRouter>
    );

    expect(trackPageViewMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /allow analytics/i }));

    await waitFor(() => {
      expect(trackPageViewMock).toHaveBeenCalledTimes(1);
    });
    expect(trackPageViewMock).toHaveBeenCalledWith('/visit?source=banner', 'en');
  });
});
