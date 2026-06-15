import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent } from '@/test-utils';
import { ANALYTICS_CONSENT_KEY } from '../../lib/googleAnalytics';
import { ConsentBanner } from './ConsentBanner';

describe('ConsentBanner', () => {
  beforeEach(() => {
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
});
