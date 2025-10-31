import {createSlice} from '@reduxjs/toolkit'
//Auth-Slice

const authSlice = createSlice({
    name:'auth',
    initialState:{
        currentUser:'null',
        isLoggedIn:false,
        loading:false,
        error:null,
    },
    reducers:{
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
        },
        setLoading: (state, action) => {
      state.loading = action.payload;
    },

    }
})

export const {loginSuccess,loginFailure,logout,setLoading} = authSlice.actions
export default authSlice.reducer




