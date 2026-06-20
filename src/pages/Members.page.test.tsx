import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@/test-utils';
import { MembersPage } from './Members.page';

vi.mock('../lib/memberPortalFirebase', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/memberPortalFirebase')>();
  return {
    ...actual,
    completeEmailLinkSignIn: vi.fn().mockResolvedValue(false),
    isMemberPortalConfigured: vi.fn(() => true),
    subscribeToAuth: vi.fn((callback: (user: null) => void) => {
      callback(null);
      return vi.fn();
    }),
  };
});

describe('MembersPage', () => {
  it('shows the passwordless sign-in gate without exposing private portal content', async () => {
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /member portal/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/email address/i)).toBeInTheDocument());
    expect(screen.queryByRole('tab', { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/audit history/i)).not.toBeInTheDocument();
  });
});
