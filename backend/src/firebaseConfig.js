import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjdUKO9YP4IN__Cw607rg6yGM9hWy0I4E",
  authDomain: "oopcw-bd585.firebaseapp.com",
  databaseURL: "https://oopcw-bd585-default-rtdb.firebaseio.com",
  projectId: "oopcw-bd585",
  storageBucket: "oopcw-bd585.firebasestorage.app",
  messagingSenderId: "549732330077",
  appId: "1:549732330077:web:22ad521acbd1a9fae6fbb4"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
