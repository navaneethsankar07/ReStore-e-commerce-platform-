import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDwUdhZsa0xfK0dDvDJHUUUaK_8Svcpjz0",
  authDomain: "restore-13032.firebaseapp.com",
  projectId: "restore-13032",
  storageBucket: "restore-13032.firebasestorage.app",
  messagingSenderId: "595332337061",
  appId: "1:595332337061:web:9154ba5581043dc34aec4c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)