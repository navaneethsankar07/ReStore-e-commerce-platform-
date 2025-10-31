import { onAuthStateChanged } from 'firebase/auth'
import React,{useEffect} from 'react'
import {useDispatch} from 'react-redux'
import { loginSuccess, logout, setLoading } from '../redux/authSlice'
import { auth } from '../firebase/firebase'
function AuthListener() {
    const dispatch = useDispatch()
    useEffect(()=>{
         dispatch(setLoading(true));

        const unsubscribe = onAuthStateChanged(auth,user=>{
            if(user){
                const userData = {
                    userId:user.uid,
                    fullname:user.displayName,
                    email:user.email,
                    profileImg:user.photoURL 
                }
                dispatch(loginSuccess(userData))
                console.log("User from listener:", userData)

            }
            else{
                dispatch(logout())
            }
            dispatch(setLoading(false));
        })
        return ()=> unsubscribe()
    },[dispatch])
    return null
}

export default AuthListener