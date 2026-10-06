import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore: Client is offline or checking connection.');
    }
  }
}
testFirestoreConnection();

export interface SignInResult {
  user: User | null;
  error?: {
    code: string;
    message: string;
    domain?: string;
  };
}

// Check redirect result on initialization
export async function checkRedirectAuth(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error: any) {
    console.warn('Redirect auth check:', error);
    return null;
  }
}

export async function signInWithGoogle(): Promise<SignInResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.error('Sign in error details:', error);
    const errorCode = error?.code || 'unknown';
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';

    // If popup was blocked or mobile browser, try redirect flow
    if (errorCode === 'auth/popup-blocked') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null };
      } catch (redirectErr: any) {
        return {
          user: null,
          error: {
            code: redirectErr?.code || errorCode,
            message: redirectErr?.message || error?.message,
            domain: currentDomain,
          },
        };
      }
    }

    return {
      user: null,
      error: {
        code: errorCode,
        message: error?.message || 'ไม่สามารถเข้าสู่ระบบได้',
        domain: currentDomain,
      },
    };
  }
}

export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

