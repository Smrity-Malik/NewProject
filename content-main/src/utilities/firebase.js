// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseApp = {
  app: null,
};

const firebaseConfig = {
  apiKey: 'AIzaSyB38jl8m7Ava8LZH83qqsQ8LoJxw5bIBR0',
  authDomain: 'truecounsel.firebaseapp.com',
  databaseURL: 'https://truecounsel-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'truecounsel',
  storageBucket: 'truecounsel.appspot.com',
  messagingSenderId: '303250175875',
  appId: '1:303250175875:web:ae8d1e0fa8745a58e468b6',
  measurementId: 'G-NTZJ6Y2Q5Y',
};

// Initialize Firebase
export const firebaseInit = () => {
  const app = initializeApp(firebaseConfig);
  firebaseApp.app = app;
};
