import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

export const saveVerifiedEmailToDB = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return false;

  try {
    const emailRef = doc(db, "verifiedEmails", normalizedEmail);
    await setDoc(emailRef, {
      email: normalizedEmail,
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving email to Firebase database:", error);
    return false;
  }
};

export const checkEmailExistsInDB = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return false;

  try {
    const emailRef = doc(db, "verifiedEmails", normalizedEmail);
    const emailSnap = await getDoc(emailRef);
    return emailSnap.exists();
  } catch (error) {
    console.error("Error checking email in Firebase database:", error);
    return false;
  }
};

export const saveVoterRecordToDB = async (walletAddress, email) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedWallet = (walletAddress || "").trim().toLowerCase();

  if (!normalizedEmail || !normalizedWallet) return false;

  try {
    const voterRef = doc(db, "voters", normalizedWallet);
    await setDoc(voterRef, {
      email: normalizedEmail,
      walletAddress: normalizedWallet,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving voter to Firebase database:", error);
    return false;
  }
};

export const checkVoterExistsInDB = async (walletAddress, email) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedWallet = (walletAddress || "").trim().toLowerCase();

  if (!normalizedEmail || !normalizedWallet) return false;

  try {
    const voterRef = doc(db, "voters", normalizedWallet);
    const voterSnap = await getDoc(voterRef);

    if (!voterSnap.exists()) return false;

    const voterData = voterSnap.data();
    return voterData?.email === normalizedEmail;
  } catch (error) {
    console.error("Error checking voter in Firebase database:", error);
    return false;
  }
};