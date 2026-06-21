import { MemoryRouter } from 'react-router-dom';
import { render, screen, userEvent, waitFor, within } from '@/test-utils';
import { MemberAdminPage, MemberProfilePage, MembersPage } from './Members.page';

const memberMocks = vi.hoisted(() => ({
  authenticated: false,
  accessStatus: 'approved',
  accessRole: 'member',
  emailLinkResult: 'not-link',
  requestProfileDeletion: vi.fn(),
  requestMemberAreaAccess: vi.fn(),
  changePortalAccessStatus: vi.fn(),
  saveOwnProfile: vi.fn(),
  loadAccessibleEvents: vi.fn(),
  loadAccessibleUpdates: vi.fn(),
  loadUpcomingBirthdays: vi.fn(),
  loadUpcomingAnniversaries: vi.fn(),
  loadMyMembershipGroups: vi.fn(),
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
      pronouns: '',
      addressingNote: '',
      birthday: null,
      email: 'alex@example.com',
      alternateEmail: '',
      phone: '',
      communicationChannels: [],
      preferredContactMethod: 'none',
      address: {
        line1: '',
        line2: '',
        city: '',
        region: '',
        postalCode: '',
        country: 'United States',
      },
      household: '',
      ministryInterests: [],
      otherMinistryInterest: '',
      visibility: {
        listed: false,
        preferredName: true,
        email: false,
        phone: false,
        pronouns: false,
        address: false,
        birthday: false,
        household: false,
        relationships: false,
        anniversary: false,
        ministryInterests: false,
        photo: false,
        churchStatus: true,
        churchRoles: true,
      },
    }),
    loadOwnChurchMetadata: vi.fn().mockResolvedValue({
      uid: 'member-1',
      churchStatus: 'member',
      churchRoles: ['staff'],
      dateJoined: '2020-01-01',
    }),
    loadHouseholdForMember: vi.fn().mockResolvedValue(null),
    loadRelationshipsForMember: vi.fn().mockResolvedValue([]),
    loadAdminHouseholds: vi.fn().mockResolvedValue([]),
    loadAdminRelationships: vi.fn().mockResolvedValue([]),
    loadMembershipGroupIds: vi.fn().mockResolvedValue([]),
    loadMyMembershipGroups: memberMocks.loadMyMembershipGroups,
    loadAccessibleEvents: memberMocks.loadAccessibleEvents,
    loadAccessibleUpdates: memberMocks.loadAccessibleUpdates,
    loadUpcomingBirthdays: memberMocks.loadUpcomingBirthdays,
    loadUpcomingAnniversaries: memberMocks.loadUpcomingAnniversaries,
    requestProfileDeletion: memberMocks.requestProfileDeletion,
    requestMemberAreaAccess: memberMocks.requestMemberAreaAccess,
    changePortalAccessStatus: memberMocks.changePortalAccessStatus,
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
    loadAdminMemberRecords: vi.fn().mockResolvedValue([
      {
        access: {
          uid: 'requester',
          email: 'requester@example.com',
          displayName: 'Requesting Person',
          role: 'member',
          status: 'pending',
          connection: 'regularParticipant',
          requestNote: 'I attend worship regularly.',
        },
        profile: {
          uid: 'requester',
          displayName: 'Requesting Person',
          preferredName: '',
          pronouns: '',
          addressingNote: '',
          birthday: null,
          email: 'requester@example.com',
          alternateEmail: '',
          phone: '',
          communicationChannels: [],
          preferredContactMethod: 'none',
          address: {
            line1: '',
            line2: '',
            city: '',
            region: '',
            postalCode: '',
            country: 'United States',
          },
          household: '',
          ministryInterests: [],
          otherMinistryInterest: '',
          visibility: {
            listed: false,
            preferredName: true,
            email: false,
            phone: false,
            pronouns: false,
            address: false,
            birthday: false,
            household: false,
            relationships: false,
            anniversary: false,
            ministryInterests: false,
            photo: false,
            churchStatus: true,
            churchRoles: true,
          },
        },
        church: { uid: 'requester', churchStatus: null, churchRoles: [], dateJoined: '' },
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
    memberMocks.changePortalAccessStatus.mockReset();
    memberMocks.saveOwnProfile.mockReset();
    memberMocks.loadAccessibleEvents.mockReset().mockResolvedValue([]);
    memberMocks.loadAccessibleUpdates.mockReset().mockResolvedValue([]);
    memberMocks.loadUpcomingBirthdays.mockReset().mockResolvedValue([]);
    memberMocks.loadUpcomingAnniversaries.mockReset().mockResolvedValue([]);
    memberMocks.loadMyMembershipGroups.mockReset().mockResolvedValue([]);
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

  it('shows a useful signed-in home and hides empty summary sections', async () => {
    memberMocks.authenticated = true;
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /welcome, alex/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /announcements/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /upcoming events/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /celebrations/i })).not.toBeInTheDocument();
  });

  it('renders bounded home events, announcements, and visible celebrations', async () => {
    memberMocks.authenticated = true;
    const now = new Date();
    memberMocks.loadAccessibleEvents.mockResolvedValue([
      {
        id: 'event-1',
        groupId: '',
        groupName: '',
        title: 'Sunday worship',
        description: '',
        location: 'Sanctuary',
        startsAt: now,
        endsAt: new Date(now.getTime() + 3600000),
        allDay: false,
        visibility: 'allApproved',
        status: 'scheduled',
        createdBy: 'admin',
      },
    ]);
    memberMocks.loadAccessibleUpdates.mockResolvedValue([
      {
        id: 'update-1',
        groupId: '',
        groupName: '',
        title: 'Church supper',
        summary: 'Wednesday evening',
        body: 'Details',
        visibility: 'allApproved',
        status: 'published',
        pinned: false,
        important: true,
        createdBy: 'admin',
        publishedAt: now,
      },
    ]);
    memberMocks.loadUpcomingBirthdays.mockResolvedValue([
      {
        uid: 'member-2',
        displayName: 'Jamie Lee',
        preferredName: 'Jamie',
        birthday: { month: 6, day: 22 },
        nextDate: now,
      },
    ]);
    memberMocks.loadUpcomingAnniversaries.mockResolvedValue([
      {
        id: 'relationship-1',
        memberUids: ['a', 'b'],
        memberNames: ['Pat', 'Sam'],
        typeAtoB: 'spouse',
        typeBtoA: 'spouse',
        audience: 'allApproved',
        anniversary: { month: 6, day: 25 },
        nextDate: now,
      },
    ]);
    render(
      <MemoryRouter initialEntries={['/members']}>
        <MembersPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Sunday worship')).toBeInTheDocument();
    expect(screen.getByText('Church supper')).toBeInTheDocument();
    expect(screen.getByText(/Jamie · June 22/)).toBeInTheDocument();
    expect(screen.getByText(/Pat & Sam · June 25/)).toBeInTheDocument();
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
        <MemberProfilePage />
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
      expect(memberMocks.changePortalAccessStatus).toHaveBeenCalledWith(
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
        <MemberProfilePage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mailing address/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /official church record/i })).toBeInTheDocument();
    expect(screen.queryByRole('switch', { name: /show my email/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('switch', { name: /include me in the member directory/i }));

    expect(screen.getByRole('switch', { name: /show my email/i })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: /show my church status/i })).toBeChecked();
    expect(screen.getByRole('switch', { name: /show my church roles/i })).toBeChecked();
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

  it('requires a phone number before allowing SMS contact', async () => {
    memberMocks.authenticated = true;
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/profile']}>
        <MemberProfilePage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('checkbox', { name: /text message \(sms\)/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(/add a valid phone number/i)).toBeInTheDocument();
    expect(memberMocks.saveOwnProfile).not.toHaveBeenCalled();
  });

  it('searches the combined administrator member records', async () => {
    memberMocks.authenticated = true;
    memberMocks.accessRole = 'admin';
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/admin']}>
        <MemberAdminPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: /review request/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/search member records/i), 'not present');
    expect(screen.queryByRole('button', { name: /review request/i })).not.toBeInTheDocument();
    await user.clear(screen.getByLabelText(/search member records/i));
    expect(screen.getByRole('button', { name: /review request/i })).toBeInTheDocument();
  });

  it('shows portal failures in an immediately visible toast', async () => {
    memberMocks.authenticated = true;
    memberMocks.saveOwnProfile.mockRejectedValue(new Error('The profile could not be saved.'));
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/members/profile']}>
        <MemberProfilePage />
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
