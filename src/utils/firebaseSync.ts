import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { DayRecord } from '../types';

export async function saveDayRecordToFirestore(userId: string, record: DayRecord): Promise<void> {
  const path = `users/${userId}/dayRecords/${record.date}`;
  try {
    const docRef = doc(db, 'users', userId, 'dayRecords', record.date);
    await setDoc(docRef, {
      ...record,
      userId,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadDayRecordFromFirestore(userId: string, dateStr: string): Promise<DayRecord | null> {
  const path = `users/${userId}/dayRecords/${dateStr}`;
  try {
    const docRef = doc(db, 'users', userId, 'dayRecords', dateStr);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as DayRecord;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfileToFirestore(userId: string, profile: { displayName: string; email: string; photoURL?: string }): Promise<void> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      uid: userId,
      displayName: profile.displayName,
      email: profile.email,
      photoURL: profile.photoURL || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToDayRecord(
  userId: string,
  dateStr: string,
  onUpdate: (record: DayRecord | null) => void
): () => void {
  const path = `users/${userId}/dayRecords/${dateStr}`;
  const docRef = doc(db, 'users', userId, 'dayRecords', dateStr);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as DayRecord);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}
