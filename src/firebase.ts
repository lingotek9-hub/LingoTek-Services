import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, onSnapshot, addDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Auth Helpers
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Firestore Helpers
export const saveQuizResult = async (uid: string, result: any) => {
  try {
    const resultsRef = collection(db, 'users', uid, 'quizResults');
    await addDoc(resultsRef, {
      ...result,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
};

export const saveScholarship = async (uid: string, scholarship: any) => {
  try {
    const savedRef = doc(db, 'users', uid, 'savedScholarships', scholarship.id);
    await setDoc(savedRef, {
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error saving scholarship:", error);
    throw error;
  }
};

export const deleteSavedScholarship = async (uid: string, scholarshipId: string) => {
  try {
    const savedRef = doc(db, 'users', uid, 'savedScholarships', scholarshipId);
    await deleteDoc(savedRef);
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    throw error;
  }
};

// Storage & Firestore Document Helpers
export const uploadUserDocument = async (uid: string, file: File) => {
  try {
    const storageRef = ref(storage, `users/${uid}/documents/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    const docsRef = collection(db, 'users', uid, 'documents');
    await addDoc(docsRef, {
      fileName: file.name,
      fileUrl: downloadURL,
      fileType: file.type,
      storagePath: storageRef.fullPath,
      uploadDate: serverTimestamp()
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

export const deleteUserDocument = async (uid: string, docId: string, storagePath?: string) => {
  try {
    // Delete from Firestore
    const docRef = doc(db, 'users', uid, 'documents', docId);
    await deleteDoc(docRef);
    
    // Delete from Storage if path provided
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const syncUserProfile = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error syncing user profile:", error);
  }
};

// Scholarship Fetching
export const getScholarships = async () => {
  try {
    const scholarshipsRef = collection(db, 'scholarships');
    const q = query(scholarshipsRef, orderBy('deadline', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return [];
  }
};
