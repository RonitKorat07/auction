// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtarzDxhNy0-S5QYelVKjXNHQtcbB0R3A",
  authDomain: "circketauction.firebaseapp.com",
  projectId: "circketauction",
  storageBucket: "circketauction.firebasestorage.app",
  messagingSenderId: "549898113773",
  appId: "1:549898113773:web:4ce8857a8c4581ade9b2e4",
  measurementId: "G-866KN2N2V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);