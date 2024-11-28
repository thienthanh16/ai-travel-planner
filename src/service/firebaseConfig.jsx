// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOAIIj7WKgJvzpcBQCv4aAi3f8O4p0wH8",
  authDomain: "ai-planner-travel.firebaseapp.com",
  projectId: "ai-planner-travel",
  storageBucket: "ai-planner-travel.appspot.com",
  messagingSenderId: "353555434558",
  appId: "1:353555434558:web:9669d3c311b52a4366556f",
  measurementId: "G-06Y37TPX1W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);