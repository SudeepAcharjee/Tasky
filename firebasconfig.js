import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtlINREAlJH34DAIbGFc0pgNS1vL3svTE",
  authDomain: "blog-f4cda.firebaseapp.com",
  projectId: "blog-f4cda",
  storageBucket: "blog-f4cda.appspot.com",
  messagingSenderId: "605232530796",
  appId: "1:605232530796:web:a7cbb3853907ca6d13df49",
  measurementId: "G-8YFZV1BQGF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, app };
