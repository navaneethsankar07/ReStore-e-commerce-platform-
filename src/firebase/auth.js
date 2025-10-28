 import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import {useEffect} from 'react'
export async function signup(email, password) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error;
  }
}

 export function signin(email,password){
    return signInWithEmailAndPassword(auth,email,password)
}

export async function doGooglesignIn(){
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth,provider)
    return result.user;
}

export function signout(){
    return auth.signOut()
}


