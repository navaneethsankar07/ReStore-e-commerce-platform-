//Auth-Slice
import {createSlice} from '@reduxjs/toolkit'


const authSlice = createSlice({
    name:'auth',
    initialState:{
        currentUser:null,
        isLoggedIn:false,
        loading:false,
        error:null,
    },
    reducers:{
        loginStart:(state,action )=>{
            state.error = null
            state.loading = true
            state.isLoggedIn = false
        },
        loginSuccess:(state,action)=>{
            state.loading = false
            state.isLoggedIn = true
            state.currentUser = action.payload
        },
        loginFailure:(state,action) =>{
            state.error = action.payload
            state.isLoggedIn = false
        },
        logout:(state,action)=>{
            state.currentUser=null
            state.isLoggedIn = false
        }

    }
})

export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions
export default authSlice.reducer




