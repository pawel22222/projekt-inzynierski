import firebase from 'firebase/app';
import fire from 'firebase';
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyBLKURqo4UlLg1l9_wZ-QCtqog-KLIZhw4',
  authDomain: 'fir-inzynierka.firebaseapp.com',
  projectId: 'fir-inzynierka',
  storageBucket: 'fir-inzynierka.appspot.com',
  messagingSenderId: '916155399076',
  appId: '1:916155399076:web:eb354b999c58d018e4df31',
});
// Stary projekt fb
// const app = firebase.initializeApp({
//     apiKey: "AIzaSyASeIjGYROh3a7NkwBE7lSluEkMn6Mnepc",
//     authDomain: "basicapp-849e2.firebaseapp.com",
//     projectId: "basicapp-849e2",
//     storageBucket: "basicapp-849e2.appspot.com",
//     messagingSenderId: "927513664772",
//     appId: "1:927513664772:web:cfbb9297764967c20fc451"
// })
export const auth = app.auth();

export const db = fire.firestore();

export default app;
