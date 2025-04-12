// Import required Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
                  
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const projectFireStore = getFirestore(app);

// Firestore timestamp
const timestamp = serverTimestamp;

const projectAuth = getAuth(app);


export { projectFireStore, timestamp, projectAuth};