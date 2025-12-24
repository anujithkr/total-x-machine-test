import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTkaWnYR7Mg0nbORd-9sn4fcyzyHQeZ1w",
  authDomain: "totalx-machine-test-e8f3f.firebaseapp.com",
  projectId: "totalx-machine-test-e8f3f",
  storageBucket: "totalx-machine-test-e8f3f.appspot.com", // ✅ FIXED
  messagingSenderId: "752336768690",
  appId: "1:752336768690:web:68c31fe1f01e10995f03ab",
};

const app = initializeApp(firebaseConfig);

// ✅ THESE EXPORTS ARE REQUIRED
export const auth = getAuth(app);
export const db = getFirestore(app);
