// Import required Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbXQrmAE0_ML59Ub1Bs4r1KKHM-MPD_L0",
  authDomain: "questioner-db50f.firebaseapp.com",
  projectId: "questioner-db50f",
  storageBucket: "questioner-db50f.firebasestorage.app",
                  
  messagingSenderId: "547999483651",
  appId: "1:547999483651:web:a2cd8e5d8d754056488b36",
  measurementId: "G-277REJ0GR6"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const projectFireStore = getFirestore(app);

// Firestore timestamp
const timestamp = serverTimestamp;

export { projectFireStore, timestamp };
