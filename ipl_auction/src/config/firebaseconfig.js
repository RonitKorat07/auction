// firebaseConfig.js or a similar file

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWa9eTD4YKd8rSesf_DCPjav3ujjes69g",
  authDomain: "auction-e4ba4.firebaseapp.com",
  databaseURL: "https://auction-e4ba4-default-rtdb.firebaseio.com",
  projectId: "auction-e4ba4",
  storageBucket: "auction-e4ba4.firebasestorage.app",
  messagingSenderId: "915884332048",
  appId: "1:915884332048:web:6712f942b7c8a392272695",
  measurementId: "G-YCYXJ6FZ6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firestore database
export const db = getFirestore(app);
