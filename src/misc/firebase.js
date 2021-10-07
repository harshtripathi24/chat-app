/* eslint-disable prefer-destructuring */
import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyB5lrmxnFgk-JdUTPbHDYmxms5Z7QWL4Ok',
  authDomain: 'chat-web--app.firebaseapp.com',
  projectId: 'chat-web--app',
  storageBucket: 'chat-web--app.appspot.com',
  messagingSenderId: '318965033751',
  appId: '1:318965033751:web:a94fcbc8b04f4f1d0be552',
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const database = app.database();
