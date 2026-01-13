// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEiqJTKa2Zu974C27ywBD_c3c9L1i6a1k",
  authDomain: "magicyang-c19c8.firebaseapp.com",
  projectId: "magicyang-c19c8",
  storageBucket: "magicyang-c19c8.firebasestorage.app",
  messagingSenderId: "459113800692",
  appId: "1:459113800692:web:2fe9b379c70403bfc8cfa1",
  measurementId: "G-PSJGCBSJB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);