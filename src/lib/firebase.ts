import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  arrayUnion,
  increment,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, CitizenClaimSubmission, DprAppraisalRecord } from '../types';

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// Initialize Firestore with specific databaseId if specified in config
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Save or update user profile in Firestore
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore profile save warning (fallback to local state):', err);
  }
}

// Fetch user profile from Firestore
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('Firestore profile fetch warning:', err);
  }
  return null;
}

// Create a new citizen infrastructure claim
export async function submitCitizenClaim(
  claimData: Omit<CitizenClaimSubmission, 'id' | 'createdAt' | 'upvoteCount' | 'status'>
): Promise<string> {
  const newClaim: Omit<CitizenClaimSubmission, 'id'> = {
    ...claimData,
    createdAt: new Date().toISOString(),
    status: 'SUBMITTED',
    upvoteCount: 1,
    upvotedByUsers: [claimData.userId],
    officialComments: [],
  };

  try {
    const docRef = await addDoc(collection(db, 'citizenClaims'), newClaim);
    return docRef.id;
  } catch (err) {
    console.error('Error submitting citizen claim to Firestore:', err);
    throw err;
  }
}

// Upvote an existing citizen claim
export async function upvoteClaim(claimId: string, userId: string): Promise<void> {
  try {
    const claimRef = doc(db, 'citizenClaims', claimId);
    await updateDoc(claimRef, {
      upvoteCount: increment(1),
      upvotedByUsers: arrayUnion(userId),
    });
  } catch (err) {
    console.error('Error upvoting claim:', err);
  }
}

// Official appraisal / status update on a claim
export async function addOfficialCommentToClaim(
  claimId: string,
  comment: {
    officialName: string;
    officialDesignation: string;
    comment: string;
    statusUpdate?: CitizenClaimSubmission['status'];
  }
): Promise<void> {
  try {
    const claimRef = doc(db, 'citizenClaims', claimId);
    const payload: Record<string, any> = {
      officialComments: arrayUnion({
        ...comment,
        timestamp: new Date().toISOString(),
      }),
    };
    if (comment.statusUpdate) {
      payload.status = comment.statusUpdate;
    }
    await updateDoc(claimRef, payload);
  } catch (err) {
    console.error('Error updating official comment:', err);
    throw err;
  }
}

// Official sanction & budget allocation of a DPR
export async function recordDprAppraisal(appraisal: Omit<DprAppraisalRecord, 'id' | 'sanctionTimestamp' | 'sanctionOrderNumber'>): Promise<string> {
  const record: Omit<DprAppraisalRecord, 'id'> = {
    ...appraisal,
    sanctionTimestamp: new Date().toISOString(),
    sanctionOrderNumber: `CP/SANCTION/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
  };

  try {
    const docRef = await addDoc(collection(db, 'dprAppraisals'), record);
    return docRef.id;
  } catch (err) {
    console.error('Error saving DPR appraisal:', err);
    throw err;
  }
}
