import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';

export type MemberRole = 'member' | 'admin';
export type MemberStatus = 'pending' | 'approved' | 'revoked';

export type MemberAccess = {
  uid: string;
  email: string;
  displayName: string;
  role: MemberRole;
  status: MemberStatus;
};

export type DirectoryProfile = {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  household: string;
  interests: string;
  optIn: boolean;
  approved: boolean;
  visibility: {
    email: boolean;
    phone: boolean;
    household: boolean;
  };
};

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
  'storageBucket',
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

  return {
    auth: getAuth(app),
    db: getFirestore(app),
  };
}

function mapAccess(uid: string, data: DocumentData): MemberAccess {
  return {
    uid,
    email: String(data.email ?? ''),
    displayName: String(data.displayName ?? ''),
    role: data.role === 'admin' ? 'admin' : 'member',
    status:
      data.status === 'approved' || data.status === 'revoked' ? data.status : ('pending' as const),
  };
}

function mapProfile(uid: string, data: DocumentData): DirectoryProfile {
  const visibility = data.visibility && typeof data.visibility === 'object' ? data.visibility : {};

  return {
    uid,
    displayName: String(data.displayName ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    household: String(data.household ?? ''),
    interests: String(data.interests ?? ''),
    optIn: data.optIn === true,
    approved: data.approved === true,
    visibility: {
      email: visibility.email === true,
      phone: visibility.phone === true,
      household: visibility.household === true,
    },
  };
}

async function writeAudit(db: Firestore, actorUid: string, action: string, targetUid: string) {
  await addDoc(collection(db, 'directoryAudit'), {
    actorUid,
    action,
    targetUid,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(getServices().auth, callback);
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

export async function loadMemberAccess(uid: string) {
  const { db } = getServices();
  const snapshot = await getDoc(doc(db, 'memberAccess', uid));

  return snapshot.exists() ? mapAccess(uid, snapshot.data()) : null;
}

export async function requestMemberAccess(user: Pick<User, 'uid' | 'email'>, displayName: string) {
  const { db } = getServices();
  const accessRef = doc(db, 'memberAccess', user.uid);
  const profileRef = doc(db, 'directoryProfiles', user.uid);
  const name = displayName.trim() || user.email || 'Member';

  await setDoc(accessRef, {
    uid: user.uid,
    email: user.email ?? '',
    displayName: name,
    role: 'member',
    status: 'pending',
    requestedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await setDoc(
    profileRef,
    {
      uid: user.uid,
      email: user.email ?? '',
      displayName: name,
      phone: '',
      household: '',
      interests: '',
      optIn: false,
      approved: false,
      visibility: { email: false, phone: false, household: false },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await writeAudit(db, user.uid, 'access-requested', user.uid);
}

export async function loadOwnProfile(uid: string) {
  const snapshot = await getDoc(doc(getServices().db, 'directoryProfiles', uid));

  return snapshot.exists() ? mapProfile(uid, snapshot.data()) : null;
}

export async function saveOwnProfile(
  user: Pick<User, 'uid' | 'email'>,
  profile: Omit<DirectoryProfile, 'uid' | 'approved'>
) {
  const { db } = getServices();

  await setDoc(
    doc(db, 'directoryProfiles', user.uid),
    {
      ...profile,
      uid: user.uid,
      email: profile.email || user.email || '',
      approved: false,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
  await writeAudit(db, user.uid, 'profile-updated', user.uid);
}

export async function loadApprovedDirectory() {
  const { db } = getServices();
  const snapshots = await getDocs(
    query(
      collection(db, 'directoryProfiles'),
      where('optIn', '==', true),
      where('approved', '==', true)
    )
  );

  return snapshots.docs
    .map((snapshot) => mapProfile(snapshot.id, snapshot.data()))
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

export async function loadPendingAccessRequests() {
  const { db } = getServices();
  const snapshots = await getDocs(
    query(collection(db, 'memberAccess'), where('status', '==', 'pending'))
  );

  return snapshots.docs
    .map((snapshot) => mapAccess(snapshot.id, snapshot.data()))
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

export async function updateMemberAccess(adminUid: string, uid: string, status: MemberStatus) {
  const { db } = getServices();

  await updateDoc(doc(db, 'memberAccess', uid), {
    status,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'directoryProfiles', uid), {
    approved: status === 'approved',
    updatedAt: serverTimestamp(),
  }).catch(() => undefined);
  await writeAudit(db, adminUid, `access-${status}`, uid);
}
