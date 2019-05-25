import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firestorePlugin } from 'vuefire';

Vue.use(firestorePlugin);

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.VUE_APP_FIREBASE_URL,
});

export default firebase.firestore();
