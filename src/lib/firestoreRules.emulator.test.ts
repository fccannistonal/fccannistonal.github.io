import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

const projectId = 'demo-fccanniston';
let environment: RulesTestEnvironment;

const profileDocument = (uid: string, email: string, displayName = '') => ({
  uid,
  displayName,
  preferredName: '',
  pronouns: '',
  addressingNote: '',
  birthday: null,
  email,
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
  schemaVersion: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const directoryDocument = (uid: string, displayName: string) => ({
  uid,
  displayName,
  preferredName: '',
  email: '',
  phone: '',
  pronouns: '',
  birthday: null,
  address: null,
  household: '',
  shareHousehold: false,
  shareRelationships: false,
  shareAnniversary: false,
  ministryInterests: [],
  otherMinistryInterest: '',
  churchStatus: null,
  churchRoles: [],
  showPhoto: false,
  listed: true,
  schemaVersion: 3,
  updatedAt: new Date(),
});

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

beforeEach(async () => environment.clearFirestore());
afterAll(async () => environment.cleanup());

async function seed() {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, 'memberAccess/admin'), {
        uid: 'admin',
        email: 'admin@example.com',
        displayName: 'Admin',
        role: 'admin',
        status: 'approved',
      }),
      setDoc(doc(db, 'memberAccess/member'), {
        uid: 'member',
        email: 'member@example.com',
        displayName: 'Member',
        role: 'member',
        status: 'approved',
      }),
      setDoc(doc(db, 'memberAccess/member-two'), {
        uid: 'member-two',
        email: 'two@example.com',
        displayName: 'Member Two',
        role: 'member',
        status: 'approved',
      }),
      setDoc(doc(db, 'memberAccess/outsider'), {
        uid: 'outsider',
        email: 'outsider@example.com',
        displayName: 'Outsider',
        role: 'member',
        status: 'approved',
      }),
      setDoc(doc(db, 'memberAccess/pending'), {
        uid: 'pending',
        email: 'pending@example.com',
        displayName: 'Pending',
        role: 'member',
        status: 'pending',
      }),
      setDoc(doc(db, 'memberAccess/banned'), {
        uid: 'banned',
        email: 'banned@example.com',
        displayName: 'Banned',
        role: 'member',
        status: 'banned',
      }),
      setDoc(doc(db, 'directoryProfiles/member'), {
        ...profileDocument('member', 'member@example.com', 'Member'),
        visibility: {
          ...profileDocument('member', '').visibility,
          listed: true,
          household: true,
          relationships: true,
          anniversary: true,
        },
      }),
      setDoc(doc(db, 'directoryProfiles/member-two'), {
        ...profileDocument('member-two', 'two@example.com', 'Member Two'),
        visibility: {
          ...profileDocument('member-two', '').visibility,
          listed: true,
          household: true,
          relationships: true,
          anniversary: true,
        },
      }),
      setDoc(doc(db, 'directoryEntries/member'), {
        ...directoryDocument('member', 'Member'),
        shareHousehold: true,
        shareRelationships: true,
        shareAnniversary: true,
      }),
      setDoc(doc(db, 'directoryEntries/member-two'), {
        ...directoryDocument('member-two', 'Member Two'),
        shareHousehold: true,
        shareRelationships: true,
        shareAnniversary: true,
      }),
      setDoc(doc(db, 'groups/group-one'), {
        id: 'group-one',
        name: 'Worship Team',
        description: '',
        category: 'worship',
        status: 'active',
        visibility: 'groupMembers',
        contactUid: 'member',
        contactDisplayName: 'Member',
        createdBy: 'admin',
        lastAuditId: 'seed',
      }),
      setDoc(doc(db, 'groups/group-one/members/member'), {
        uid: 'member',
        displayName: 'Member',
        roles: ['editor'],
      }),
    ]);
  });
}

describe('member portal Firestore rules in the emulator', () => {
  it('allows private onboarding and only the audited transition to pending', async () => {
    await seed();
    const db = environment
      .authenticatedContext('new-user', { email: 'new@example.com' })
      .firestore();
    const create = writeBatch(db);
    create.set(doc(db, 'auditLogs/account-created'), {
      actorUid: 'new-user',
      actorDisplayName: 'new@example.com',
      action: 'member.accountCreated',
      entityType: 'member',
      targetId: 'new-user',
      summary: 'Member area account created',
    });
    create.set(doc(db, 'memberAccess/new-user'), {
      uid: 'new-user',
      email: 'new@example.com',
      displayName: '',
      role: 'member',
      status: 'onboarding',
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAuditId: 'account-created',
    });
    create.set(
      doc(db, 'directoryProfiles/new-user'),
      profileDocument('new-user', 'new@example.com')
    );
    await assertSucceeds(create.commit());

    await assertSucceeds(getDoc(doc(db, 'directoryProfiles/new-user')));
    await assertFails(getDoc(doc(db, 'directoryEntries/member')));
    await assertFails(getDoc(doc(db, 'groups/group-one')));
    await assertFails(
      setDoc(doc(db, 'memberAccess/new-user'), { status: 'approved' }, { merge: true })
    );

    const request = writeBatch(db);
    request.set(doc(db, 'auditLogs/access-requested'), {
      actorUid: 'new-user',
      actorDisplayName: 'New User',
      action: 'member.accessRequested',
      entityType: 'member',
      targetId: 'new-user',
      summary: 'Member area access requested',
    });
    request.update(doc(db, 'directoryProfiles/new-user'), {
      displayName: 'New User',
      updatedAt: new Date(),
    });
    request.update(doc(db, 'memberAccess/new-user'), {
      displayName: 'New User',
      status: 'pending',
      connection: 'regularParticipant',
      requestNote: '',
      requestedAt: new Date(),
      updatedAt: new Date(),
      lastAuditId: 'access-requested',
    });
    await assertSucceeds(request.commit());
    await assertSucceeds(getDoc(doc(db, 'directoryProfiles/new-user')));
    await assertFails(getDoc(doc(db, 'directoryEntries/member')));
    await assertFails(
      setDoc(
        doc(db, 'memberAccess/new-user'),
        { requestNote: 'Duplicate request', updatedAt: new Date() },
        { merge: true }
      )
    );
  });

  it('blocks logged-out, pending, and banned users from directory data', async () => {
    await seed();
    await assertFails(
      getDoc(doc(environment.unauthenticatedContext().firestore(), 'directoryEntries/member'))
    );
    await assertFails(
      getDoc(
        doc(
          environment.authenticatedContext('pending', { email: 'pending@example.com' }).firestore(),
          'directoryEntries/member'
        )
      )
    );
    await assertFails(
      getDoc(
        doc(
          environment.authenticatedContext('banned', { email: 'banned@example.com' }).firestore(),
          'directoryEntries/member'
        )
      )
    );
  });

  it('allows approved users to read only the redacted directory projection', async () => {
    await seed();
    const db = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    await assertSucceeds(getDoc(doc(db, 'directoryEntries/member')));
    await assertFails(getDoc(doc(db, 'directoryProfiles/admin')));
  });

  it('prevents members from changing protected access fields', async () => {
    await seed();
    const db = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    await assertFails(
      setDoc(doc(db, 'memberAccess/member'), { role: 'admin', status: 'approved' }, { merge: true })
    );
  });

  it('requires an immutable audit entry for administrator status changes', async () => {
    await seed();
    const db = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    await assertFails(
      setDoc(doc(db, 'memberAccess/member'), { status: 'deactivated' }, { merge: true })
    );

    const batch = writeBatch(db);
    batch.set(doc(db, 'auditLogs/action-one'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'member.deactivated',
      entityType: 'member',
      targetId: 'member',
      summary: 'Deactivated',
      createdAt: new Date(),
    });
    batch.set(doc(db, 'memberAccess/member'), {
      uid: 'member',
      email: 'member@example.com',
      displayName: 'Member',
      role: 'member',
      status: 'deactivated',
      lastAuditId: 'action-one',
    });
    await assertSucceeds(batch.commit());
  });

  it('requires administrators to give a requester-visible rejection reason', async () => {
    await seed();
    const db = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const rejected = (reason?: string) => ({
      uid: 'pending',
      email: 'pending@example.com',
      displayName: 'Pending',
      role: 'member',
      status: 'rejected',
      ...(reason ? { statusReason: reason } : {}),
      lastAuditId: 'rejection',
    });
    const withoutReason = writeBatch(db);
    withoutReason.set(doc(db, 'auditLogs/rejection'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'member.rejected',
      entityType: 'member',
      targetId: 'pending',
      summary: 'Rejected',
    });
    withoutReason.set(doc(db, 'memberAccess/pending'), rejected());
    await assertFails(withoutReason.commit());

    const withReason = writeBatch(db);
    withReason.set(doc(db, 'auditLogs/rejection'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'member.rejected',
      entityType: 'member',
      targetId: 'pending',
      summary: 'Rejected',
    });
    withReason.set(doc(db, 'memberAccess/pending'), rejected('Please contact the church office.'));
    await assertSucceeds(withReason.commit());
  });

  it('separates group editor permissions from calendar and membership management', async () => {
    await seed();
    const db = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    const updateBatch = writeBatch(db);
    updateBatch.set(doc(db, 'auditLogs/update-one'), {
      actorUid: 'member',
      actorDisplayName: 'Member',
      action: 'update.created',
      entityType: 'groupUpdate',
      targetId: 'update-one',
      summary: 'Posted',
      createdAt: new Date(),
    });
    updateBatch.set(doc(db, 'groupUpdates/update-one'), {
      groupId: 'group-one',
      groupName: 'Worship Team',
      title: 'Practice',
      summary: '',
      body: 'Thursday',
      visibility: 'groupMembers',
      status: 'published',
      pinned: false,
      important: false,
      createdBy: 'member',
      lastAuditId: 'update-one',
    });
    await assertSucceeds(updateBatch.commit());

    await assertFails(
      setDoc(doc(db, 'groups/group-one/members/pending'), {
        uid: 'pending',
        displayName: 'Pending',
        roles: [],
      })
    );
  });

  it('allows audited membership changes by a portal administrator', async () => {
    await seed();
    const db = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, 'auditLogs/membership-one'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'group.membershipChanged',
      entityType: 'groupMembership',
      targetId: 'group-one:pending',
      summary: 'Added pending member',
      createdAt: new Date(),
    });
    batch.set(
      doc(db, 'groups/group-one'),
      { lastAuditId: 'membership-one', updatedAt: new Date() },
      { merge: true }
    );
    batch.set(doc(db, 'groups/group-one/members/pending'), {
      uid: 'pending',
      displayName: 'Pending',
      roles: ['calendarManager'],
    });

    await assertSucceeds(batch.commit());
  });

  it('separates self-readable church metadata from admin-only notes', async () => {
    await seed();
    const adminDb = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'auditLogs/church-record'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'member.churchMetadataUpdated',
      entityType: 'member',
      targetId: 'member',
      summary: 'Church record updated',
    });
    batch.set(doc(adminDb, 'memberChurchMetadata/member'), {
      uid: 'member',
      churchStatus: 'member',
      churchRoles: ['staff'],
      dateJoined: '2020-01-01',
      schemaVersion: 3,
      updatedAt: new Date(),
      lastAuditId: 'church-record',
    });
    batch.set(doc(adminDb, 'memberAdminNotes/member'), {
      uid: 'member',
      membershipNotes: 'Received into membership.',
      internalNotes: 'Private staff note.',
      lastReviewedByUid: 'admin',
      lastReviewedByName: 'Admin',
      schemaVersion: 3,
      updatedAt: new Date(),
      lastAuditId: 'church-record',
    });
    await assertSucceeds(batch.commit());

    const memberDb = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    await assertSucceeds(getDoc(doc(memberDb, 'memberChurchMetadata/member')));
    await assertFails(getDoc(doc(memberDb, 'memberAdminNotes/member')));
    await assertFails(
      setDoc(
        doc(memberDb, 'memberChurchMetadata/member'),
        { churchRoles: ['elder'] },
        { merge: true }
      )
    );
  });

  it('rejects directory entries that leak fields hidden by the private profile', async () => {
    await seed();
    const db = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    await assertFails(
      setDoc(doc(db, 'directoryEntries/member'), {
        ...directoryDocument('member', 'Member'),
        email: 'member@example.com',
      })
    );
    await assertSucceeds(
      setDoc(doc(db, 'directoryEntries/member'), {
        ...directoryDocument('member', 'Member'),
        shareHousehold: true,
        shareRelationships: true,
        shareAnniversary: true,
      })
    );
  });

  it('protects canonical households while allowing consented directory projections', async () => {
    await seed();
    const adminDb = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'auditLogs/household-one'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'household.created',
      entityType: 'household',
      targetId: 'household-one',
      summary: 'Member household',
    });
    batch.set(doc(adminDb, 'households/household-one'), {
      id: 'household-one',
      name: 'Member household',
      memberUids: ['member', 'member-two'],
      memberNames: ['Member', 'Member Two'],
      status: 'active',
      createdBy: 'admin',
      lastAuditId: 'household-one',
    });
    batch.set(doc(adminDb, 'householdDirectoryEntries/member'), {
      uid: 'member',
      displayName: 'Member',
      householdId: 'household-one',
      updatedAt: new Date(),
    });
    await assertSucceeds(batch.commit());

    const memberDb = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    const outsiderDb = environment
      .authenticatedContext('outsider', { email: 'outsider@example.com' })
      .firestore();
    await assertSucceeds(getDoc(doc(memberDb, 'households/household-one')));
    await assertFails(getDoc(doc(outsiderDb, 'households/household-one')));
    await assertSucceeds(getDoc(doc(outsiderDb, 'householdDirectoryEntries/member')));
  });

  it('publishes relationships and anniversaries only through the consented projection', async () => {
    await seed();
    const adminDb = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'auditLogs/relationship-one'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'relationship.created',
      entityType: 'relationship',
      targetId: 'relationship-one',
      summary: 'Member and Member Two',
    });
    batch.set(doc(adminDb, 'memberRelationships/relationship-one'), {
      id: 'relationship-one',
      memberUids: ['member', 'member-two'],
      memberNames: ['Member', 'Member Two'],
      typeAtoB: 'spouse',
      typeBtoA: 'spouse',
      householdId: '',
      audience: 'allApproved',
      anniversary: { month: 6, day: 20 },
      status: 'active',
      createdBy: 'admin',
      lastAuditId: 'relationship-one',
    });
    batch.set(doc(adminDb, 'relationshipDirectoryEntries/relationship-one'), {
      id: 'relationship-one',
      memberUids: ['member', 'member-two'],
      memberNames: ['Member', 'Member Two'],
      typeAtoB: 'spouse',
      typeBtoA: 'spouse',
      audience: 'allApproved',
      anniversary: { month: 6, day: 20 },
      updatedAt: new Date(),
    });
    await assertSucceeds(batch.commit());

    const outsiderDb = environment
      .authenticatedContext('outsider', { email: 'outsider@example.com' })
      .firestore();
    await assertFails(getDoc(doc(outsiderDb, 'memberRelationships/relationship-one')));
    await assertSucceeds(getDoc(doc(outsiderDb, 'relationshipDirectoryEntries/relationship-one')));
  });

  it('allows audited church-wide events and denies content under a deleted group', async () => {
    await seed();
    const adminDb = environment
      .authenticatedContext('admin', { email: 'admin@example.com' })
      .firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'auditLogs/church-event'), {
      actorUid: 'admin',
      actorDisplayName: 'Admin',
      action: 'event.created',
      entityType: 'groupEvent',
      targetId: 'church-event',
      summary: 'Church event',
    });
    batch.set(doc(adminDb, 'groupEvents/church-event'), {
      id: 'church-event',
      groupId: '',
      groupName: '',
      title: 'Church event',
      description: '',
      location: '',
      startsAt: new Date('2026-07-01T15:00:00Z'),
      endsAt: new Date('2026-07-01T16:00:00Z'),
      allDay: false,
      visibility: 'allApproved',
      status: 'scheduled',
      createdBy: 'admin',
      lastAuditId: 'church-event',
    });
    await assertSucceeds(batch.commit());

    await environment.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore();
      await setDoc(doc(db, 'groups/group-one'), { status: 'deleted' }, { merge: true });
      await setDoc(doc(db, 'groupEvents/deleted-group-event'), {
        id: 'deleted-group-event',
        groupId: 'group-one',
        groupName: 'Worship Team',
        title: 'Hidden event',
        description: '',
        location: '',
        startsAt: new Date('2026-07-01T15:00:00Z'),
        endsAt: new Date('2026-07-01T16:00:00Z'),
        allDay: false,
        visibility: 'groupMembers',
        status: 'scheduled',
        createdBy: 'admin',
      });
    });
    const memberDb = environment
      .authenticatedContext('member', { email: 'member@example.com' })
      .firestore();
    await assertSucceeds(getDoc(doc(memberDb, 'groupEvents/church-event')));
    await assertFails(getDoc(doc(memberDb, 'groupEvents/deleted-group-event')));
  });
});
