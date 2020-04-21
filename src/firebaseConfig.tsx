import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyABrLqUG3wIcAnelM5kv4MLJDnebu5kng8",
    authDomain: "gastos-432ba.firebaseapp.com",
    databaseURL: "https://gastos-432ba.firebaseio.com",
    projectId: "gastos-432ba",
    storageBucket: "gastos-432ba.appspot.com",
    messagingSenderId: "563903591657",
    appId: "1:563903591657:web:3a46c9efb2a3f862842c78"
  };

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()









