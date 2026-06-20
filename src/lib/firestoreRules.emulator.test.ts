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
        uid: 'member',
        displayName: 'Member',
        preferredName: '',
        email: 'member@example.com',
        phone: '555-0100',
        pronouns: '',
        household: '',
        ministryInterests: '',
        visibility: {
          listed: true,
          email: false,
          phone: false,
          pronouns: false,
          household: false,
          photo: false,
        },
      }),
      setDoc(doc(db, 'directoryEntries/member'), {
        uid: 'member',
        displayName: 'Member',
        preferredName: '',
        email: '',
        phone: '',
        pronouns: '',
        household: '',
        ministryInterests: '',
        showPhoto: false,
        listed: true,
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
    create.set(doc(db, 'directoryProfiles/new-user'), {
      uid: 'new-user',
      displayName: '',
      preferredName: '',
      email: 'new@example.com',
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
      schemaVersion: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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
});
