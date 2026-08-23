// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHE7XfW_p3hFIIQB1OeUyE-N9_yacH6n0",
  authDomain: "storzengarage.firebaseapp.com",
  projectId: "storzengarage",
  storageBucket: "storzengarage.firebasestorage.app",
  messagingSenderId: "829076965759",
  appId: "1:829076965759:web:d94ce41e4ad5feff19b24a",
  measurementId: "G-XT1TZKHR9V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
