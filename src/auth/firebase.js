import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2sa3XQcZcrdYO5FbZOAR7agHsi9YyisY",
  authDomain: "law-system-5ecbc.firebaseapp.com",
  projectId: "law-system-5ecbc",
  storageBucket: "law-system-5ecbc.firebasestorage.app",
  messagingSenderId: "33639626350",
  appId: "1:33639626350:web:d77fc5ac8320695608187f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
