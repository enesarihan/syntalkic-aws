import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
// Build-time'da dummy değerlerle initialize et (hata vermemesi için)
// Runtime'da gerçek değerler kullanılacak
let app;
try {
  app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  // Build-time'da hata olursa yok say
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "dummy-build-time-api-key") {
    // Dummy değerlerle minimal init
    app = !getApps.length 
      ? initializeApp({ projectId: "dummy-build-time" })
      : getApp();
  } else {
    throw error;
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
