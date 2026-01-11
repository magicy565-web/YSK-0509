// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk96iH90RKGAQLKTRjHOlZzqrNkBQpXgk",
  authDomain: "b2bclient-ec4ce.firebaseapp.com",
  projectId: "b2bclient-ec4ce",
  storageBucket: "b2bclient-ec4ce.appspot.com",
  messagingSenderId: "20673258081",
  appId: "1:20673258081:web:232c2c5d436802652c8020",
  measurementId: "G-92VP12NWGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
