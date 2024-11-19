// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFkQhymW7lVQ4drYWB0CugxtgSaxVVYV4",
  authDomain: "fir-web-chat-2ea1c.firebaseapp.com",
  projectId: "fir-web-chat-2ea1c",
  storageBucket: "fir-web-chat-2ea1c.appspot.com",
  messagingSenderId: "1041521114968",
  appId: "1:1041521114968:web:0176662669c3a8943aaf2d",
  measurementId: "G-MFVNRKC93H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;