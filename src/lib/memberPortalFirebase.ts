import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  deleteUser,
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import {
  collection,
  collectionGroup,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  Timestamp,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

export type MemberRole = 'member' | 'admin';
export type MemberStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'deactivated'
  | 'banned'
  | 'deletionRequested'
  | 'deleted';
export type DirectoryVisibility = {
  listed: boolean;
  email: boolean;
  phone: boolean;
  pronouns: boolean;
  household: boolean;
  photo: boolean;
};
export type GroupRole = 'owner' | 'leader' | 'groupAdmin' | 'editor' | 'calendarManager';
export type GroupStatus = 'draft' | 'active' | 'hidden' | 'archived';
export type GroupVisibility = 'allApproved' | 'groupMembers' | 'adminOnly';
export type GroupCategory =
  | 'staff'
  | 'leadership'
  | 'elders'
  | 'deacons'
  | 'worship'
  | 'volunteer'
  | 'smallGroup'
  | 'eventTeam'
  | 'committee'
  | 'ministry'
  | 'other';
export type EventStatus = 'scheduled' | 'canceled' | 'archived';
export type UpdateStatus = 'draft' | 'published' | 'archived' | 'removed';

export type MemberAccess = {
  uid: string;
  email: string;
  displayName: string;
  role: MemberRole;
  status: MemberStatus;
  previousStatus?: MemberStatus;
  statusReason?: string;
  requestedAt?: Date;
  updatedAt?: Date;
};

export type DirectoryProfile = {
  uid: string;
  displayName: string;
  preferredName: string;
  email: string;
  phone: string;
  pronouns: string;
  household: string;
  ministryInterests: string;
  visibility: DirectoryVisibility;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DirectoryEntry = {
  uid: string;
  displayName: string;
  preferredName: string;
  email: string;
  phone: string;
  pronouns: string;
  household: string;
  ministryInterests: string;
  showPhoto: boolean;
};

export type PortalGroup = {
  id: string;
  name: string;
  description: string;
  category: GroupCategory;
  status: GroupStatus;
  visibility: GroupVisibility;
  contactUid: string;
  contactDisplayName: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GroupMembership = {
  uid: string;
  displayName: string;
  roles: GroupRole[];
  joinedAt?: Date;
};

export type GroupEvent = {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  endsAt: Date;
  allDay: boolean;
  visibility: GroupVisibility;
  status: EventStatus;
  createdBy: string;
};

export type GroupUpdate = {
  id: string;
  groupId: string;
  groupName: string;
  title: string;
  body: string;
  visibility: GroupVisibility;
  status: UpdateStatus;
  pinned: boolean;
  important: boolean;
  createdBy: string;
  publishedAt?: Date;
  updatedAt?: Date;
};

export type AvatarMetadata = {
  uid: string;
  status: 'none' | 'pending' | 'approved' | 'rejected';
  pendingKey?: string;
  approvedKey?: string;
  updatedAt?: Date;
};

export type AuditLog = {
  id: string;
  actorUid: string;
  actorDisplayName: string;
  action: string;
  entityType: string;
  targetId: string;
  summary: string;
  createdAt?: Date;
};

export type PageResult<T> = { items: T[]; cursor: QueryDocumentSnapshot<DocumentData> | null };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredFirebaseConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'messagingSenderId',
  'appId',
] as const;

export function getMissingFirebaseConfigKeys() {
  return requiredFirebaseConfigKeys.filter((key) => {
    const value = firebaseConfig[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });
}

export function isMemberPortalConfigured() {
  return getMissingFirebaseConfigKeys().length === 0;
}

function getServices() {
  if (!isMemberPortalConfigured()) {
    throw new Error('Member portal Firebase configuration is incomplete.');
  }
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return { auth: getAuth(app), db: getFirestore(app) };
}

const dateValue = (value: unknown) => (value instanceof Timestamp ? value.toDate() : undefined);
const stringValue = (value: unknown) => (typeof value === 'string' ? value : '');

function normalizeStatus(value: unknown): MemberStatus {
  if (value === 'revoked') {
    return 'deactivated';
  }
  return [
    'pending',
    'approved',
    'rejected',
    'deactivated',
    'banned',
    'deletionRequested',
    'deleted',
  ].includes(String(value))
    ? (value as MemberStatus)
    : 'pending';
}

function mapAccess(uid: string, data: DocumentData): MemberAccess {
  return {
    uid,
    email: stringValue(data.email),
    displayName: stringValue(data.displayName),
    role: data.role === 'admin' ? 'admin' : 'member',
    status: normalizeStatus(data.status),
    previousStatus: data.previousStatus ? normalizeStatus(data.previousStatus) : undefined,
    statusReason: stringValue(data.statusReason),
    requestedAt: dateValue(data.requestedAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

const defaultVisibility = (): DirectoryVisibility => ({
  listed: false,
  email: false,
  phone: false,
  pronouns: false,
  household: false,
  photo: false,
});

function mapProfile(uid: string, data: DocumentData): DirectoryProfile {
  const visibility = data.visibility && typeof data.visibility === 'object' ? data.visibility : {};
  return {
    uid,
    displayName: stringValue(data.displayName),
    preferredName: stringValue(data.preferredName),
    email: stringValue(data.email),
    phone: stringValue(data.phone),
    pronouns: stringValue(data.pronouns),
    household: stringValue(data.household),
    ministryInterests: stringValue(data.ministryInterests || data.interests),
    visibility: {
      listed: visibility.listed === true || data.optIn === true,
      email: visibility.email === true,
      phone: visibility.phone === true,
      pronouns: visibility.pronouns === true,
      household: visibility.household === true,
      photo: visibility.photo === true,
    },
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function mapDirectoryEntry(uid: string, data: DocumentData): DirectoryEntry {
  return {
    uid,
    displayName: stringValue(data.displayName),
    preferredName: stringValue(data.preferredName),
    email: stringValue(data.email),
    phone: stringValue(data.phone),
    pronouns: stringValue(data.pronouns),
    household: stringValue(data.household),
    ministryInterests: stringValue(data.ministryInterests),
    showPhoto: data.showPhoto === true,
  };
}

function mapGroup(snapshot: DocumentSnapshot<DocumentData>): PortalGroup {
  const data = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    name: stringValue(data.name),
    description: stringValue(data.description),
    category: (data.category || 'other') as GroupCategory,
    status: (data.status || 'draft') as GroupStatus,
    visibility: (data.visibility || 'groupMembers') as GroupVisibility,
    contactUid: stringValue(data.contactUid),
    contactDisplayName: stringValue(data.contactDisplayName),
    createdBy: stringValue(data.createdBy),
    createdAt: dateValue(data.createdAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function mapEvent(snapshot: DocumentSnapshot<DocumentData>): GroupEvent {
  const data = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    groupId: stringValue(data.groupId),
    groupName: stringValue(data.groupName),
    title: stringValue(data.title),
    description: stringValue(data.description),
    location: stringValue(data.location),
    startsAt: dateValue(data.startsAt) ?? new Date(),
    endsAt: dateValue(data.endsAt) ?? new Date(),
    allDay: data.allDay === true,
    visibility: (data.visibility || 'groupMembers') as GroupVisibility,
    status: (data.status || 'scheduled') as EventStatus,
    createdBy: stringValue(data.createdBy),
  };
}

function mapUpdate(snapshot: DocumentSnapshot<DocumentData>): GroupUpdate {
  const data = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    groupId: stringValue(data.groupId),
    groupName: stringValue(data.groupName),
    title: stringValue(data.title),
    body: stringValue(data.body),
    visibility: (data.visibility || 'groupMembers') as GroupVisibility,
    status: (data.status || 'published') as UpdateStatus,
    pinned: data.pinned === true,
    important: data.important === true,
    createdBy: stringValue(data.createdBy),
    publishedAt: dateValue(data.publishedAt),
    updatedAt: dateValue(data.updatedAt),
  };
}

function createAudit(
  db: Firestore,
  actor: Pick<MemberAccess, 'uid' | 'displayName'>,
  action: string,
  entityType: string,
  targetId: string,
  summary: string
) {
  const ref = doc(collection(db, 'auditLogs'));
  return {
    ref,
    data: {
      actorUid: actor.uid,
      actorDisplayName: actor.displayName,
      action,
      entityType,
      targetId,
      summary,
      createdAt: serverTimestamp(),
    },
  };
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getServices().auth, callback);
}

export async function getMemberIdToken(forceRefresh = false) {
  const user = getServices().auth.currentUser;
  if (!user) {
    throw new Error('Authentication required.');
  }
  return user.getIdToken(forceRefresh);
}

export async function sendMemberSignInLink(email: string, redirectUrl: string) {
  await sendSignInLinkToEmail(getServices().auth, email, {
    url: redirectUrl,
    handleCodeInApp: true,
  });
  window.localStorage.setItem('fccanniston.member-email', email);
}

export async function completeEmailLinkSignIn(href: string) {
  const { auth } = getServices();
  if (!isSignInWithEmailLink(auth, href)) {
    return false;
  }
  const email = window.localStorage.getItem('fccanniston.member-email') ?? '';
  if (!email) {
    return false;
  }
  await signInWithEmailLink(auth, email, href);
  window.localStorage.removeItem('fccanniston.member-email');
  return true;
}

export async function signOutMember() {
  await signOut(getServices().auth);
}

export async function deleteCurrentAuthAccount() {
  const user = getServices().auth.currentUser;
  if (!user) {
    throw new Error('Authentication required.');
  }
  await deleteUser(user);
}

export async function loadMemberAccess(uid: string) {
  const snapshot = await getDoc(doc(getServices().db, 'memberAccess', uid));
  return snapshot.exists() ? mapAccess(uid, snapshot.data()) : null;
}

export async function requestMemberAccess(user: Pick<User, 'uid' | 'email'>, displayName: string) {
  const { db } = getServices();
  const name = displayName.trim() || user.email || 'Member';
  const actor = { uid: user.uid, displayName: name };
  const audit = createAudit(
    db,
    actor,
    'member.accessRequested',
    'member',
    user.uid,
    'Access requested'
  );
  const batch = writeBatch(db);
  batch.set(doc(db, 'memberAccess', user.uid), {
    uid: user.uid,
    email: user.email ?? '',
    displayName: name,
    role: 'member',
    status: 'pending',
    schemaVersion: 2,
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(
    doc(db, 'directoryProfiles', user.uid),
    {
      uid: user.uid,
      email: user.email ?? '',
      displayName: name,
      preferredName: '',
      phone: '',
      pronouns: '',
      household: '',
      ministryInterests: '',
      visibility: defaultVisibility(),
      schemaVersion: 2,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function loadOwnProfile(uid: string) {
  const snapshot = await getDoc(doc(getServices().db, 'directoryProfiles', uid));
  return snapshot.exists() ? mapProfile(uid, snapshot.data()) : null;
}

function directoryProjection(profile: DirectoryProfile) {
  return {
    uid: profile.uid,
    displayName: profile.displayName,
    preferredName: profile.preferredName,
    email: profile.visibility.email ? profile.email : '',
    phone: profile.visibility.phone ? profile.phone : '',
    pronouns: profile.visibility.pronouns ? profile.pronouns : '',
    household: profile.visibility.household ? profile.household : '',
    ministryInterests: profile.ministryInterests,
    showPhoto: profile.visibility.photo,
    listed: true,
    updatedAt: serverTimestamp(),
  };
}

export async function saveOwnProfile(profile: DirectoryProfile) {
  const { db } = getServices();
  const batch = writeBatch(db);
  batch.set(
    doc(db, 'directoryProfiles', profile.uid),
    {
      uid: profile.uid,
      displayName: profile.displayName.trim(),
      preferredName: profile.preferredName.trim(),
      email: profile.email,
      phone: profile.phone.trim(),
      pronouns: profile.pronouns.trim(),
      household: profile.household.trim(),
      ministryInterests: profile.ministryInterests.trim(),
      visibility: profile.visibility,
      schemaVersion: 2,
      optIn: deleteField(),
      interests: deleteField(),
      approved: deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  const entryRef = doc(db, 'directoryEntries', profile.uid);
  if (profile.visibility.listed) {
    batch.set(entryRef, directoryProjection(profile));
  } else {
    batch.delete(entryRef);
  }
  await batch.commit();
}

export async function saveMemberProfile(actor: MemberAccess, profile: DirectoryProfile) {
  const { db } = getServices();
  const audit = createAudit(
    db,
    actor,
    'member.profileUpdated',
    'member',
    profile.uid,
    `${profile.displayName}: profile updated`
  );
  const batch = writeBatch(db);
  batch.set(
    doc(db, 'directoryProfiles', profile.uid),
    {
      uid: profile.uid,
      displayName: profile.displayName.trim(),
      preferredName: profile.preferredName.trim(),
      email: profile.email,
      phone: profile.phone.trim(),
      pronouns: profile.pronouns.trim(),
      household: profile.household.trim(),
      ministryInterests: profile.ministryInterests.trim(),
      visibility: profile.visibility,
      schemaVersion: 2,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  const entryRef = doc(db, 'directoryEntries', profile.uid);
  if (profile.visibility.listed) {
    batch.set(entryRef, directoryProjection(profile));
  } else {
    batch.delete(entryRef);
  }
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function migrateLegacyDirectoryEntry(profile: DirectoryProfile) {
  if (!profile.visibility.listed) {
    return;
  }
  const { db } = getServices();
  const ref = doc(db, 'directoryEntries', profile.uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    await saveOwnProfile(profile);
  }
}

export async function loadDirectoryPage(
  cursor: QueryDocumentSnapshot<DocumentData> | null = null,
  pageSize = 24
): Promise<PageResult<DirectoryEntry>> {
  const { db } = getServices();
  const constraints = [where('listed', '==', true), orderBy('displayName'), limit(pageSize)];
  const snapshots = await getDocs(
    cursor
      ? query(collection(db, 'directoryEntries'), ...constraints, startAfter(cursor))
      : query(collection(db, 'directoryEntries'), ...constraints)
  );
  return {
    items: snapshots.docs.map((item) => mapDirectoryEntry(item.id, item.data())),
    cursor: snapshots.docs.at(-1) ?? null,
  };
}

export async function loadMyGroups(uid: string) {
  const { db } = getServices();
  const [visible, memberships] = await Promise.all([
    getDocs(
      query(
        collection(db, 'groups'),
        where('status', '==', 'active'),
        where('visibility', '==', 'allApproved'),
        orderBy('name'),
        limit(30)
      )
    ),
    getDocs(query(collectionGroup(db, 'members'), where('uid', '==', uid), limit(50))),
  ]);
  const groups = new Map(visible.docs.map((item) => [item.id, mapGroup(item)]));
  await Promise.all(
    memberships.docs.map(async (membership) => {
      const groupRef = membership.ref.parent.parent;
      if (!groupRef || groups.has(groupRef.id)) {
        return;
      }
      const snapshot = await getDoc(groupRef);
      if (snapshot.exists()) {
        groups.set(snapshot.id, mapGroup(snapshot));
      }
    })
  );
  return [...groups.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export async function loadAdminGroups() {
  const snapshots = await getDocs(
    query(collection(getServices().db, 'groups'), orderBy('name'), limit(100))
  );
  return snapshots.docs.map(mapGroup);
}

export async function loadGroup(groupId: string) {
  const snapshot = await getDoc(doc(getServices().db, 'groups', groupId));
  return snapshot.exists() ? mapGroup(snapshot) : null;
}

export async function loadGroupMembership(groupId: string, uid: string) {
  const snapshot = await getDoc(doc(getServices().db, 'groups', groupId, 'members', uid));
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data();
  return {
    uid,
    displayName: stringValue(data.displayName),
    roles: Array.isArray(data.roles) ? (data.roles as GroupRole[]) : [],
    joinedAt: dateValue(data.joinedAt),
  } satisfies GroupMembership;
}

export async function loadGroupMembers(groupId: string) {
  const snapshots = await getDocs(
    query(
      collection(getServices().db, 'groups', groupId, 'members'),
      orderBy('displayName'),
      limit(100)
    )
  );
  return snapshots.docs.map((item) => ({
    uid: item.id,
    displayName: stringValue(item.data().displayName),
    roles: Array.isArray(item.data().roles) ? (item.data().roles as GroupRole[]) : [],
    joinedAt: dateValue(item.data().joinedAt),
  }));
}

export async function saveGroup(
  actor: MemberAccess,
  group: Omit<PortalGroup, 'createdBy' | 'createdAt' | 'updatedAt'>,
  owner?: Pick<MemberAccess, 'uid' | 'displayName'>
) {
  const { db } = getServices();
  const ref = group.id ? doc(db, 'groups', group.id) : doc(collection(db, 'groups'));
  const action = group.id ? 'group.updated' : 'group.created';
  const audit = createAudit(db, actor, action, 'group', ref.id, group.name);
  const batch = writeBatch(db);
  batch.set(
    ref,
    {
      id: ref.id,
      name: group.name,
      description: group.description,
      category: group.category,
      status: group.status,
      visibility: group.visibility,
      contactUid: group.contactUid,
      contactDisplayName: group.contactDisplayName,
      createdBy: actor.uid,
      ...(!group.id ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
      lastAuditId: audit.ref.id,
      schemaVersion: 2,
    },
    { merge: true }
  );
  if (!group.id && owner) {
    batch.set(doc(db, 'groups', ref.id, 'members', owner.uid), {
      uid: owner.uid,
      displayName: owner.displayName,
      roles: ['owner'],
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  batch.set(audit.ref, audit.data);
  await batch.commit();
  return ref.id;
}

export async function saveGroupMembership(
  actor: MemberAccess,
  group: PortalGroup,
  member: Pick<MemberAccess, 'uid' | 'displayName'>,
  roles: GroupRole[]
) {
  const { db } = getServices();
  const audit = createAudit(
    db,
    actor,
    'group.membershipChanged',
    'groupMembership',
    `${group.id}:${member.uid}`,
    `${member.displayName} in ${group.name}`
  );
  const batch = writeBatch(db);
  batch.set(
    doc(db, 'groups', group.id, 'members', member.uid),
    {
      uid: member.uid,
      displayName: member.displayName,
      roles,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  batch.update(doc(db, 'groups', group.id), {
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function removeGroupMembership(
  actor: MemberAccess,
  group: PortalGroup,
  memberUid: string
) {
  const { db } = getServices();
  const audit = createAudit(
    db,
    actor,
    'group.membershipRemoved',
    'groupMembership',
    `${group.id}:${memberUid}`,
    group.name
  );
  const batch = writeBatch(db);
  batch.delete(doc(db, 'groups', group.id, 'members', memberUid));
  batch.update(doc(db, 'groups', group.id), {
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function loadEvents(groupIds: string[], from: Date, to: Date) {
  if (groupIds.length === 0) {
    return [];
  }
  const chunks: string[][] = [];
  for (let index = 0; index < groupIds.length; index += 30) {
    chunks.push(groupIds.slice(index, index + 30));
  }
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(
        query(
          collection(getServices().db, 'groupEvents'),
          where('groupId', 'in', ids),
          where('startsAt', '>=', Timestamp.fromDate(from)),
          where('startsAt', '<', Timestamp.fromDate(to)),
          orderBy('startsAt'),
          limit(100)
        )
      )
    )
  );
  return snapshots
    .flatMap((snapshot) => snapshot.docs.map(mapEvent))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export async function saveEvent(
  actor: MemberAccess,
  event: Omit<GroupEvent, 'id' | 'createdBy'> & { id?: string }
) {
  const { db } = getServices();
  const ref = event.id ? doc(db, 'groupEvents', event.id) : doc(collection(db, 'groupEvents'));
  const audit = createAudit(
    db,
    actor,
    event.id ? 'event.updated' : 'event.created',
    'groupEvent',
    ref.id,
    event.title
  );
  const batch = writeBatch(db);
  batch.set(
    ref,
    {
      ...event,
      id: ref.id,
      startsAt: Timestamp.fromDate(event.startsAt),
      endsAt: Timestamp.fromDate(event.endsAt),
      timeZone: 'America/Chicago',
      createdBy: actor.uid,
      ...(!event.id ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
      lastAuditId: audit.ref.id,
    },
    { merge: true }
  );
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function loadUpdates(groupIds: string[]) {
  if (groupIds.length === 0) {
    return [];
  }
  const chunks: string[][] = [];
  for (let index = 0; index < groupIds.length; index += 30) {
    chunks.push(groupIds.slice(index, index + 30));
  }
  const snapshots = await Promise.all(
    chunks.map((ids) =>
      getDocs(
        query(
          collection(getServices().db, 'groupUpdates'),
          where('groupId', 'in', ids),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(30)
        )
      )
    )
  );
  return snapshots
    .flatMap((snapshot) => snapshot.docs.map(mapUpdate))
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
}

export async function saveUpdate(
  actor: MemberAccess,
  update: Omit<GroupUpdate, 'id' | 'createdBy' | 'publishedAt' | 'updatedAt'> & { id?: string }
) {
  const { db } = getServices();
  const ref = update.id ? doc(db, 'groupUpdates', update.id) : doc(collection(db, 'groupUpdates'));
  const audit = createAudit(
    db,
    actor,
    update.id ? 'update.updated' : 'update.created',
    'groupUpdate',
    ref.id,
    update.title
  );
  const batch = writeBatch(db);
  batch.set(
    ref,
    {
      ...update,
      id: ref.id,
      createdBy: actor.uid,
      publishedAt: update.status === 'published' ? serverTimestamp() : null,
      ...(!update.id ? { createdAt: serverTimestamp() } : {}),
      updatedAt: serverTimestamp(),
      lastAuditId: audit.ref.id,
    },
    { merge: true }
  );
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function requestProfileDeletion(access: MemberAccess) {
  const { db } = getServices();
  const audit = createAudit(
    db,
    access,
    'member.deletionRequested',
    'member',
    access.uid,
    'Deletion requested'
  );
  const batch = writeBatch(db);
  batch.set(doc(db, 'deletionRequests', access.uid), {
    uid: access.uid,
    status: 'open',
    previousStatus: access.status,
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.update(doc(db, 'memberAccess', access.uid), {
    previousStatus: access.status,
    status: 'deletionRequested',
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function loadMembersByStatus(status: MemberStatus, pageSize = 50) {
  const statuses = status === 'deactivated' ? ['deactivated', 'revoked'] : [status];
  const snapshots = await getDocs(
    query(
      collection(getServices().db, 'memberAccess'),
      where('status', 'in', statuses),
      orderBy('displayName'),
      limit(pageSize)
    )
  );
  return snapshots.docs.map((item) => mapAccess(item.id, item.data()));
}

export async function changeMemberStatus(
  actor: MemberAccess,
  member: MemberAccess,
  status: MemberStatus,
  reason = ''
) {
  const { db } = getServices();
  const action = `member.${status}`;
  const audit = createAudit(
    db,
    actor,
    action,
    'member',
    member.uid,
    `${member.displayName}: ${status}`
  );
  const batch = writeBatch(db);
  batch.update(doc(db, 'memberAccess', member.uid), {
    status,
    previousStatus:
      status === 'banned' || status === 'deletionRequested' ? member.status : deleteField(),
    statusReason: reason.trim().slice(0, 300),
    updatedAt: serverTimestamp(),
    moderatedBy: actor.uid,
    lastAuditId: audit.ref.id,
  });
  if (status !== 'approved') {
    batch.delete(doc(db, 'directoryEntries', member.uid));
  }
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function changeMemberRole(
  actor: MemberAccess,
  member: MemberAccess,
  role: MemberRole
) {
  const { db } = getServices();
  const audit = createAudit(
    db,
    actor,
    'member.roleChanged',
    'member',
    member.uid,
    `${member.displayName}: ${role}`
  );
  const batch = writeBatch(db);
  batch.update(doc(db, 'memberAccess', member.uid), {
    role,
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function processDeletion(actor: MemberAccess, member: MemberAccess) {
  const { db } = getServices();
  const memberships = await getDocs(
    query(collectionGroup(db, 'members'), where('uid', '==', member.uid), limit(200))
  );
  const audit = createAudit(
    db,
    actor,
    'member.deleted',
    'member',
    member.uid,
    'Member data removed'
  );
  const batch = writeBatch(db);
  memberships.docs.forEach((membership) => batch.delete(membership.ref));
  batch.delete(doc(db, 'directoryProfiles', member.uid));
  batch.delete(doc(db, 'directoryEntries', member.uid));
  batch.delete(doc(db, 'avatarMetadata', member.uid));
  batch.delete(doc(db, 'avatarDirectory', member.uid));
  batch.set(
    doc(db, 'deletionRequests', member.uid),
    {
      uid: member.uid,
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastAuditId: audit.ref.id,
    },
    { merge: true }
  );
  batch.set(doc(db, 'memberAccess', member.uid), {
    uid: member.uid,
    email: '',
    displayName: 'Deleted member',
    role: 'member',
    status: 'deleted',
    schemaVersion: 2,
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
}

export async function loadAvatarModeration() {
  const snapshots = await getDocs(
    query(
      collection(getServices().db, 'avatarMetadata'),
      where('status', '==', 'pending'),
      orderBy('updatedAt'),
      limit(50)
    )
  );
  return snapshots.docs.map(
    (item) =>
      ({
        uid: item.id,
        status: item.data().status,
        pendingKey: stringValue(item.data().pendingKey) || undefined,
        approvedKey: stringValue(item.data().approvedKey) || undefined,
        updatedAt: dateValue(item.data().updatedAt),
      }) as AvatarMetadata
  );
}

export async function loadAuditLogs() {
  const snapshots = await getDocs(
    query(collection(getServices().db, 'auditLogs'), orderBy('createdAt', 'desc'), limit(100))
  );
  return snapshots.docs.map((item) => ({
    id: item.id,
    actorUid: stringValue(item.data().actorUid),
    actorDisplayName: stringValue(item.data().actorDisplayName),
    action: stringValue(item.data().action),
    entityType: stringValue(item.data().entityType),
    targetId: stringValue(item.data().targetId),
    summary: stringValue(item.data().summary),
    createdAt: dateValue(item.data().createdAt),
  }));
}

export function createIcs(event: GroupEvent) {
  const escape = (value: string) =>
    value
      .replaceAll('\\', '\\\\')
      .replaceAll(';', '\\;')
      .replaceAll(',', '\\,')
      .replaceAll('\n', '\\n');
  const stamp = (date: Date) =>
    date
      .toISOString()
      .replaceAll('-', '')
      .replaceAll(':', '')
      .replace(/\.\d{3}Z$/, 'Z');
  const dateStamp = (date: Date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
      .toISOString()
      .slice(0, 10)
      .replaceAll('-', '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FCC Anniston//Member Portal//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@fccanniston.com`,
    `DTSTAMP:${stamp(new Date())}`,
    event.allDay
      ? `DTSTART;VALUE=DATE:${dateStamp(event.startsAt)}`
      : `DTSTART:${stamp(event.startsAt)}`,
    event.allDay ? `DTEND;VALUE=DATE:${dateStamp(event.endsAt)}` : `DTEND:${stamp(event.endsAt)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
