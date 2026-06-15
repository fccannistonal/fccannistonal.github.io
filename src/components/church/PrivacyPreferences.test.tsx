import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent } from '@/test-utils';
import { EMBED_CONSENT_KEY } from '../../lib/embedConsent';
import { PrivacyPreferences } from './PrivacyPreferences';

describe('PrivacyPreferences', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows and clears saved embed provider choices', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(EMBED_CONSENT_KEY, '["google-maps","facebook"]');

    render(
      <MemoryRouter>
        <PrivacyPreferences />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /saved embed choices/i })).toBeInTheDocument();
    expect(screen.getByText('Google Maps')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /clear/i })[0]);

    expect(window.localStorage.getItem(EMBED_CONSENT_KEY)).toBe('["facebook"]');
    expect(screen.queryByText('Google Maps')).not.toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear all embed choices/i }));

    expect(window.localStorage.getItem(EMBED_CONSENT_KEY)).toBe('[]');
    expect(screen.getByText(/no embed choices have been saved/i)).toBeInTheDocument();
  });
});
