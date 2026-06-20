import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent, waitFor, within } from '@/test-utils';
import { MemberAdminPage, MembersPage } from './Members.page';

const memberMocks = vi.hoisted(() => ({
  authenticated: false,
  accessStatus: 'approved',
  accessRole: 'member',
  emailLinkResult: 'not-link',
  requestProfileDeletion: vi.fn(),
  requestMemberAreaAccess: vi.fn(),
  changeMemberStatus: vi.fn(),
  saveOwnProfile: vi.fn(),
}));

const notifyMemberAccessRequest = vi.hoisted(() => vi.fn());

vi.mock('../lib/formConfig', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/formConfig')>()),
  notifyMemberAccessRequest,
}));

vi.mock('../lib/memberPortalFirebase', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/memberPortalFirebase')>();
  return {
    ...actual,
    completeEmailLinkSignIn: vi.fn(() =>
      memberMocks.emailLinkResult === 'error'
        ? Promise.reject(new Error('Invalid email link'))
        : Promise.resolve(memberMocks.emailLinkResult)
    ),
    ensureMemberOnboardingAccount: vi.fn().mockResolvedValue(null),
    isMemberPortalConfigured: vi.fn(() => true),
    loadMemberAccess: vi.fn(() =>
      Promise.resolve({
        uid: 'member-1',
        email: 'alex@example.com',
        displayName: 'Alex Morgan',
        role: memberMocks.accessRole,
        status: memberMocks.accessStatus,
      })
    ),
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
    requestMemberAreaAccess: memberMocks.requestMemberAreaAccess,
    changeMemberStatus: memberMocks.changeMemberStatus,
    loadMembersByStatus: vi.fn().mockResolvedValue([
      {
        uid: 'requester',
        email: 'requester@example.com',
        displayName: 'Requesting Person',
        role: 'member',
        status: 'pending',
        connection: 'regularParticipant',
        requestNote: 'I attend worship regularly.',
      },
    ]),
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
    memberMocks.accessStatus = 'approved';
    memberMocks.accessRole = 'member';
    memberMocks.emailLinkResult = 'not-link';
    memberMocks.requestProfileDeletion.mockReset();
    memberMocks.requestMemberAreaAccess.mockReset();
    memberMocks.changeMemberStatus.mockReset();
    memberMocks.saveOwnProfile.mockReset();
    notifyMemberAccessRequest.mockReset();
    notifyMemberAccessRequest.mockResolvedValue(undefined);
  });

  it('shows the passwordless sign-in gate without exposing private portal content', async () => {
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /member area/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/email address/i)).toBeInTheDocument());
    expect(screen.queryByRole('tab', { name: /admin/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/audit history/i)).not.toBeInTheDocument();
  });

  it('asks for the original address when an email link opens in another browser', async () => {
    memberMocks.emailLinkResult = 'needs-email';
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', { name: /confirm your email to finish signing in/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finish signing in/i })).toBeInTheDocument();
  });

  it('offers a fresh sign-in link when the current link is invalid or expired', async () => {
    memberMocks.emailLinkResult = 'error';
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send sign-in link/i })).toBeInTheDocument();
  });

  it('lets onboarding users edit a private profile and request member area access', async () => {
    memberMocks.authenticated = true;
    memberMocks.accessStatus = 'onboarding';
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/profile']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/private profile setup/i)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /request member area access/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('switch', { name: /include me in the member directory/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/member resources/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('textbox', { name: /connection to the congregation/i }));
    await user.click(screen.getByText(/regularly attend or participate/i));
    await user.click(screen.getByRole('button', { name: /submit request/i }));

    await waitFor(() => expect(memberMocks.requestMemberAreaAccess).toHaveBeenCalledTimes(1));
    expect(memberMocks.requestMemberAreaAccess).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'onboarding' }),
      expect.objectContaining({ displayName: 'Alex Morgan' }),
      'regularParticipant',
      ''
    );
  });

  it('keeps pending users in their private profile without another request action', async () => {
    memberMocks.authenticated = true;
    memberMocks.accessStatus = 'pending';
    render(
      <MemoryRouter initialEntries={['/members/directory']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/waiting for staff review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check access status/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /request member area access/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /directory/i })).not.toBeInTheDocument();
  });

  it('requires an administrator to provide a reason when rejecting access', async () => {
    memberMocks.authenticated = true;
    memberMocks.accessStatus = 'approved';
    memberMocks.accessRole = 'admin';
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/admin']}>
        <MemberAdminPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /review request/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/attend worship regularly/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: /reject access request/i }));
    const finalReject = within(dialog).getByRole('button', { name: /reject access request/i });
    expect(finalReject).toBeDisabled();
    await user.type(
      within(dialog).getByLabelText(/reason shown to the requester/i),
      'Please contact the church office.'
    );
    expect(finalReject).toBeEnabled();
    await user.click(finalReject);

    await waitFor(() =>
      expect(memberMocks.changeMemberStatus).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' }),
        expect.objectContaining({ uid: 'requester' }),
        'rejected',
        'Please contact the church office.'
      )
    );
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

  it('shows portal failures in an immediately visible toast', async () => {
    memberMocks.authenticated = true;
    memberMocks.saveOwnProfile.mockRejectedValue(new Error('The profile could not be saved.'));
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/profile']}>
        <MembersPage />
      </MemoryRouter>
    );

    await user.click(
      await screen.findByRole('switch', { name: /include me in the member directory/i })
    );
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    const toast = await screen.findByTestId('portal-toast');
    expect(toast).toHaveTextContent('The profile could not be saved.');
    expect(toast).toHaveTextContent(/something went wrong/i);
  });
});
