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
  clearIndexedDbPersistence,
  collection,
  collectionGroup,
  deleteField,
  doc,
  documentId,
  getDoc,
  getDocs,
  getFirestore,
  initializeFirestore,
  limit,
  orderBy,
  persistentLocalCache,
  persistentMultipleTabManager,
  query,
  serverTimestamp,
  startAfter,
  terminate,
  Timestamp,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type Firestore,
} from 'firebase/firestore';
import {
  clearAllPortalCaches,
  clearOtherPortalCaches,
  clearRegisteredPrivateCaches,
  getOrLoadPortalCache,
  invalidatePortalCache,
  writePortalCache,
} from './memberPortalCache';

export type MemberRole = 'member' | 'admin';
export type MemberStatus =
  | 'onboarding'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'deactivated'
  | 'banned'
  | 'deletionRequested'
  | 'deleted';
export type MemberConnection =
  | 'churchMember'
  | 'regularParticipant'
  | 'householdOrFamily'
  | 'ministryOrVolunteer'
  | 'other';
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
  connection?: MemberConnection;
  requestNote?: string;
  previousStatus?: MemberStatus;
  statusReason?: string;
  moderatedBy?: string;
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

export type DirectoryCursor = { displayName: string; uid: string };
export type PageResult<T> = { items: T[]; cursor: DirectoryCursor | null };

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

let cachedServices: { auth: ReturnType<typeof getAuth>; db: Firestore } | null = null;
let lastAuthenticatedUid = '';

function getServices() {
  if (cachedServices) {
    return cachedServices;
  }
  if (!isMemberPortalConfigured()) {
    throw new Error('Member portal Firebase configuration is incomplete.');
  }
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  let db: Firestore;
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch {
    db = getFirestore(app);
  }
  cachedServices = { auth: getAuth(app), db };
  return cachedServices;
}

const CACHE_TTL = {
  access: 30_000,
  profile: 10 * 60_000,
  directory: 15 * 60_000,
  groups: 10 * 60_000,
  groupMembers: 5 * 60_000,
  events: 10 * 60_000,
  updates: 5 * 60_000,
  admin: 60_000,
  audit: 5 * 60_000,
  migration: 365 * 24 * 60 * 60_000,
} as const;

function activeUid() {
  return getServices().auth.currentUser?.uid ?? '';
}

async function cachedRead<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
  forceRefresh = false,
  staleIfErrorMs = 24 * 60 * 60_000
) {
  const uid = activeUid();
  return uid
    ? getOrLoadPortalCache(uid, key, ttlMs, loader, forceRefresh, staleIfErrorMs)
    : loader();
}

function invalidateCurrent(prefixes: string[] = []) {
  const uid = activeUid();
  if (uid) {
    invalidatePortalCache(uid, prefixes);
  }
}

async function clearFirestoreCache() {
  const services = cachedServices;
  if (!services) {
    return;
  }
  cachedServices = null;
  await terminate(services.db).catch(() => undefined);
  await clearIndexedDbPersistence(services.db).catch(() => undefined);
}

export function getCurrentMemberUid() {
  return activeUid();
}

export function invalidateMemberPortalReads(prefixes: string[] = []) {
  invalidateCurrent(prefixes);
}

const dateValue = (value: unknown) => (value instanceof Timestamp ? value.toDate() : undefined);
const stringValue = (value: unknown) => (typeof value === 'string' ? value : '');

function normalizeStatus(value: unknown): MemberStatus {
  if (value === 'revoked') {
    return 'deactivated';
  }
  return [
    'onboarding',
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
  const connection = [
    'churchMember',
    'regularParticipant',
    'householdOrFamily',
    'ministryOrVolunteer',
    'other',
  ].includes(String(data.connection))
    ? (data.connection as MemberConnection)
    : undefined;
  return {
    uid,
    email: stringValue(data.email),
    displayName: stringValue(data.displayName),
    role: data.role === 'admin' ? 'admin' : 'member',
    status: normalizeStatus(data.status),
    connection,
    requestNote: stringValue(data.requestNote) || undefined,
    previousStatus: data.previousStatus ? normalizeStatus(data.previousStatus) : undefined,
    statusReason: stringValue(data.statusReason),
    moderatedBy: stringValue(data.moderatedBy) || undefined,
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
  return onAuthStateChanged(getServices().auth, (user) => {
    if (user) {
      if (lastAuthenticatedUid && lastAuthenticatedUid !== user.uid) {
        void clearFirestoreCache();
        void clearRegisteredPrivateCaches();
      }
      lastAuthenticatedUid = user.uid;
      clearOtherPortalCaches(user.uid);
    } else {
      clearAllPortalCaches();
      if (lastAuthenticatedUid) {
        lastAuthenticatedUid = '';
        void clearFirestoreCache();
        void clearRegisteredPrivateCaches();
      }
    }
    callback(user);
  });
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

export type EmailLinkCompletion = 'not-link' | 'needs-email' | 'complete';

export async function completeEmailLinkSignIn(
  href: string,
  suppliedEmail = ''
): Promise<EmailLinkCompletion> {
  const { auth } = getServices();
  if (!isSignInWithEmailLink(auth, href)) {
    return 'not-link';
  }
  const email =
    suppliedEmail.trim() || window.localStorage.getItem('fccanniston.member-email') || '';
  if (!email) {
    return 'needs-email';
  }
  await signInWithEmailLink(auth, email, href);
  window.localStorage.removeItem('fccanniston.member-email');
  const completedUrl = new URL(href);
  window.history.replaceState(window.history.state, '', completedUrl.pathname);
  return 'complete';
}

export async function signOutMember() {
  const { auth } = getServices();
  if (auth.currentUser) {
    invalidatePortalCache(auth.currentUser.uid);
  }
  await clearRegisteredPrivateCaches();
  await clearFirestoreCache();
  await signOut(auth);
}

export async function deleteCurrentAuthAccount() {
  const user = getServices().auth.currentUser;
  if (!user) {
    throw new Error('Authentication required.');
  }
  invalidatePortalCache(user.uid);
  await clearRegisteredPrivateCaches();
  await clearFirestoreCache();
  await deleteUser(user);
}

export async function loadMemberAccess(uid: string, forceRefresh = false) {
  return cachedRead(
    `access:${uid}`,
    CACHE_TTL.access,
    async () => {
      const snapshot = await getDoc(doc(getServices().db, 'memberAccess', uid));
      return snapshot.exists() ? mapAccess(uid, snapshot.data()) : null;
    },
    forceRefresh,
    0
  );
}

export async function ensureMemberOnboardingAccount(user: Pick<User, 'uid' | 'email'>) {
  const { db } = getServices();
  const accessRef = doc(db, 'memberAccess', user.uid);
  const existing = await getDoc(accessRef);
  if (existing.exists()) {
    return mapAccess(user.uid, existing.data());
  }
  const actor = { uid: user.uid, displayName: user.email ?? 'Member area user' };
  const audit = createAudit(
    db,
    actor,
    'member.accountCreated',
    'member',
    user.uid,
    'Member area account created'
  );
  const batch = writeBatch(db);
  batch.set(accessRef, {
    uid: user.uid,
    email: user.email ?? '',
    displayName: '',
    role: 'member',
    status: 'onboarding',
    schemaVersion: 2,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(
    doc(db, 'directoryProfiles', user.uid),
    {
      uid: user.uid,
      email: user.email ?? '',
      displayName: '',
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
  try {
    await batch.commit();
  } catch (error) {
    const raced = await getDoc(accessRef);
    if (raced.exists()) {
      return mapAccess(user.uid, raced.data());
    }
    throw error;
  }
  invalidateCurrent(['access:', 'profile:', 'admin:']);
  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: '',
    role: 'member' as const,
    status: 'onboarding' as const,
  };
}

export async function requestMemberAreaAccess(
  access: MemberAccess,
  profile: DirectoryProfile,
  connection: MemberConnection,
  requestNote: string
) {
  if (access.status !== 'onboarding') {
    throw new Error('A member area access request has already been submitted.');
  }
  const displayName = profile.displayName.trim();
  if (!displayName) {
    throw new Error('Please enter your full name before requesting access.');
  }
  const { db } = getServices();
  const audit = createAudit(
    db,
    { uid: access.uid, displayName },
    'member.accessRequested',
    'member',
    access.uid,
    'Member area access requested'
  );
  const batch = writeBatch(db);
  batch.set(
    doc(db, 'directoryProfiles', access.uid),
    {
      uid: access.uid,
      displayName,
      preferredName: profile.preferredName.trim(),
      email: profile.email,
      phone: profile.phone.trim(),
      pronouns: profile.pronouns.trim(),
      household: profile.household.trim(),
      ministryInterests: profile.ministryInterests.trim(),
      visibility: defaultVisibility(),
      schemaVersion: 2,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  batch.update(doc(db, 'memberAccess', access.uid), {
    displayName,
    status: 'pending',
    connection,
    requestNote: requestNote.trim().slice(0, 500),
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastAuditId: audit.ref.id,
  });
  batch.set(audit.ref, audit.data);
  await batch.commit();
  invalidateCurrent(['access:', 'profile:', 'admin:', 'audit:']);
}

export async function loadOwnProfile(uid: string, forceRefresh = false) {
  return cachedRead(
    `profile:${uid}`,
    CACHE_TTL.profile,
    async () => {
      const snapshot = await getDoc(doc(getServices().db, 'directoryProfiles', uid));
      return snapshot.exists() ? mapProfile(uid, snapshot.data()) : null;
    },
    forceRefresh
  );
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

export async function saveOwnProfile(profile: DirectoryProfile, directoryEnabled = true) {
  const { db } = getServices();
  const batch = writeBatch(db);
  const visibility = directoryEnabled ? profile.visibility : defaultVisibility();
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
      visibility,
      schemaVersion: 2,
      optIn: deleteField(),
      interests: deleteField(),
      approved: deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  const entryRef = doc(db, 'directoryEntries', profile.uid);
  if (directoryEnabled && profile.visibility.listed) {
    batch.set(entryRef, directoryProjection({ ...profile, visibility }));
  } else {
    batch.delete(entryRef);
  }
  await batch.commit();
  invalidateCurrent(['profile:', 'directory:']);
  writePortalCache(
    profile.uid,
    `profile:${profile.uid}`,
    { ...profile, visibility },
    CACHE_TTL.profile
  );
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
  invalidateCurrent(['profile:', 'directory:', 'admin:']);
}

export async function migrateLegacyDirectoryEntry(profile: DirectoryProfile) {
  if (!profile.visibility.listed) {
    return;
  }
  const uid = activeUid();
  await getOrLoadPortalCache(
    uid,
    `migration:directory:${profile.uid}`,
    CACHE_TTL.migration,
    async () => {
      const { db } = getServices();
      const ref = doc(db, 'directoryEntries', profile.uid);
      const existing = await getDoc(ref);
      if (!existing.exists()) {
        await saveOwnProfile(profile);
      }
      return true;
    }
  );
}

export async function loadDirectoryPage(
  cursor: DirectoryCursor | null = null,
  pageSize = 24
): Promise<PageResult<DirectoryEntry>> {
  const cacheKey = `directory:${pageSize}:${cursor ? `${cursor.displayName}:${cursor.uid}` : 'first'}`;
  return cachedRead(cacheKey, CACHE_TTL.directory, async () => {
    const { db } = getServices();
    const constraints = [
      where('listed', '==', true),
      orderBy('displayName'),
      orderBy(documentId()),
      limit(pageSize),
    ];
    const snapshots = await getDocs(
      cursor
        ? query(
            collection(db, 'directoryEntries'),
            ...constraints,
            startAfter(cursor.displayName, cursor.uid)
          )
        : query(collection(db, 'directoryEntries'), ...constraints)
    );
    const lastDocument = snapshots.docs.at(-1);
    return {
      items: snapshots.docs.map((item) => mapDirectoryEntry(item.id, item.data())),
      cursor: lastDocument
        ? { displayName: stringValue(lastDocument.data().displayName), uid: lastDocument.id }
        : null,
    };
  });
}

export async function loadMyGroups(uid: string) {
  const result = await cachedRead(`groups:member:${uid}`, CACHE_TTL.groups, async () => {
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
    memberships.docs.forEach((membership) => {
      const groupId = membership.ref.parent.parent?.id;
      if (!groupId) {
        return;
      }
      const data = membership.data();
      writePortalCache(
        uid,
        `group-membership:${groupId}:${uid}`,
        {
          uid,
          displayName: stringValue(data.displayName),
          roles: Array.isArray(data.roles) ? (data.roles as GroupRole[]) : [],
          joinedAt: dateValue(data.joinedAt),
        } satisfies GroupMembership,
        CACHE_TTL.groupMembers
      );
    });
    const missingIds = [
      ...new Set(
        memberships.docs
          .map((membership) => membership.ref.parent.parent?.id)
          .filter((groupId): groupId is string => typeof groupId === 'string')
          .filter((groupId) => !groups.has(groupId))
      ),
    ];
    const groupChunks: string[][] = [];
    for (let index = 0; index < missingIds.length; index += 30) {
      groupChunks.push(missingIds.slice(index, index + 30));
    }
    const memberGroups = await Promise.all(
      groupChunks.map((ids) =>
        getDocs(query(collection(db, 'groups'), where(documentId(), 'in', ids)))
      )
    );
    memberGroups.forEach((snapshot) => {
      snapshot.docs.forEach((item) => groups.set(item.id, mapGroup(item)));
    });
    return [...groups.values()].sort((left, right) => left.name.localeCompare(right.name));
  });
  result.forEach((group) => writePortalCache(uid, `group:${group.id}`, group, CACHE_TTL.groups));
  return result;
}

export async function loadAdminGroups() {
  const result = await cachedRead('groups:admin', CACHE_TTL.groups, async () => {
    const snapshots = await getDocs(
      query(collection(getServices().db, 'groups'), orderBy('name'), limit(100))
    );
    return snapshots.docs.map(mapGroup);
  });
  const uid = activeUid();
  result.forEach((group) => writePortalCache(uid, `group:${group.id}`, group, CACHE_TTL.groups));
  return result;
}

export async function loadGroup(groupId: string) {
  return cachedRead(`group:${groupId}`, CACHE_TTL.groups, async () => {
    const snapshot = await getDoc(doc(getServices().db, 'groups', groupId));
    return snapshot.exists() ? mapGroup(snapshot) : null;
  });
}

export async function loadGroupMembership(groupId: string, uid: string) {
  return cachedRead(`group-membership:${groupId}:${uid}`, CACHE_TTL.groupMembers, async () => {
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
  });
}

export async function loadGroupMembers(groupId: string) {
  return cachedRead(`group-members:${groupId}`, CACHE_TTL.groupMembers, async () => {
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
  });
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
  invalidateCurrent([
    'groups:',
    `group:${ref.id}`,
    `group-members:${ref.id}`,
    'events:',
    'updates:',
  ]);
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
  invalidateCurrent([
    'groups:',
    `group:${group.id}`,
    `group-members:${group.id}`,
    `group-membership:${group.id}:`,
    'events:',
    'updates:',
    'admin:',
  ]);
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
  invalidateCurrent([
    'groups:',
    `group:${group.id}`,
    `group-members:${group.id}`,
    `group-membership:${group.id}:`,
    'events:',
    'updates:',
    'admin:',
  ]);
}

export async function loadEvents(groupIds: string[], from: Date, to: Date) {
  if (groupIds.length === 0) {
    return [];
  }
  const cacheKey = `events:${[...groupIds].sort().join(',')}:${from.toISOString().slice(0, 10)}:${to.toISOString().slice(0, 10)}`;
  return cachedRead(cacheKey, CACHE_TTL.events, async () => {
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
  });
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
  invalidateCurrent(['events:', `group:${event.groupId}`, 'admin:', 'audit:']);
}

export async function loadUpdates(groupIds: string[]) {
  if (groupIds.length === 0) {
    return [];
  }
  const cacheKey = `updates:${[...groupIds].sort().join(',')}`;
  return cachedRead(cacheKey, CACHE_TTL.updates, async () => {
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
  });
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
  invalidateCurrent(['updates:', `group:${update.groupId}`, 'admin:', 'audit:']);
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
  invalidateCurrent(['access:', 'profile:', 'directory:', 'admin:', 'audit:']);
}

export async function loadMembersByStatus(status: MemberStatus, pageSize = 50) {
  return cachedRead(`admin:members:${status}:${pageSize}`, CACHE_TTL.admin, async () => {
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
  });
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
  invalidateCurrent(['admin:', 'directory:', `access:${member.uid}`, 'audit:']);
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
  invalidateCurrent(['admin:', `access:${member.uid}`, 'audit:']);
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
  invalidateCurrent([
    'admin:',
    'directory:',
    'groups:',
    'group:',
    'group-',
    'events:',
    'updates:',
    'audit:',
  ]);
}

export async function loadAvatarModeration() {
  return cachedRead('admin:avatar-moderation', CACHE_TTL.admin, async () => {
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
  });
}

export async function loadAuditLogs() {
  return cachedRead('audit:recent', CACHE_TTL.audit, async () => {
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
  });
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
