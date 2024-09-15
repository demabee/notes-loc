import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJbdWvUywoTdsfdoTOVEQWW49pnHvjuFQ",
  authDomain: "notes-location.firebaseapp.com",
  projectId: "notes-location",
  storageBucket: "notes-location.appspot.com",
  messagingSenderId: "592968788344",
  appId: "1:592968788344:web:7b8d24e3d8dceef88d808d",
  measurementId: "G-0F9W9W7NR9"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
