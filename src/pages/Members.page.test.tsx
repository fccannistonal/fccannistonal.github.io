import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent, waitFor, within } from '@/test-utils';
import { MembersPage } from './Members.page';

const memberMocks = vi.hoisted(() => ({
  authenticated: false,
  requestProfileDeletion: vi.fn(),
  saveOwnProfile: vi.fn(),
}));

vi.mock('../lib/memberPortalFirebase', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/memberPortalFirebase')>();
  return {
    ...actual,
    completeEmailLinkSignIn: vi.fn().mockResolvedValue(false),
    isMemberPortalConfigured: vi.fn(() => true),
    loadMemberAccess: vi.fn().mockResolvedValue({
      uid: 'member-1',
      email: 'alex@example.com',
      displayName: 'Alex Morgan',
      role: 'member',
      status: 'approved',
    }),
    loadOwnProfile: vi.fn().mockResolvedValue({
      uid: 'member-1',
      displayName: 'Alex Morgan',
      preferredName: 'Alex',
      email: 'alex@example.com',
      phone: '',
      pronouns: '',
      household: '',
      ministryInterests: '',
      visibility: {
        listed: false,
        email: false,
        phone: false,
        pronouns: false,
        household: false,
        photo: false,
      },
    }),
    requestProfileDeletion: memberMocks.requestProfileDeletion,
    saveOwnProfile: memberMocks.saveOwnProfile,
    subscribeToAuth: vi.fn((callback: (user: null | { uid: string; email: string }) => void) => {
      callback(memberMocks.authenticated ? { uid: 'member-1', email: 'alex@example.com' } : null);
      return vi.fn();
    }),
  };
});

describe('MembersPage', () => {
  beforeEach(() => {
    memberMocks.authenticated = false;
    memberMocks.requestProfileDeletion.mockReset();
    memberMocks.saveOwnProfile.mockReset();
  });

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

  it('provides contextual privacy settings and guards profile deletion', async () => {
    memberMocks.authenticated = true;
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/members/profile']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('switch', { name: /show my email/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: /include me in the member directory/i }));

    expect(screen.getByRole('switch', { name: /show my email/i })).toBeInTheDocument();
    expect(screen.getAllByText(/you have unsaved changes/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled();

    const accountOptions = screen.getByText('Account options').closest('details');
    expect(accountOptions).not.toHaveAttribute('open');
    await user.click(screen.getByText('Account options'));
    expect(accountOptions).toHaveAttribute('open');
    await user.click(screen.getByRole('button', { name: /request deletion/i }));

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', { name: /request deletion/i });
    expect(confirmButton).toBeDisabled();
    await user.type(screen.getByLabelText(/type delete to confirm/i), 'DELETE');
    expect(confirmButton).toBeEnabled();
    expect(memberMocks.requestProfileDeletion).not.toHaveBeenCalled();
  });
});
