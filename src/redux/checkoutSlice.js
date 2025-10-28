import {createSlice} from '@reduxjs/toolkit'


const checkoutSlice = createSlice({
    name:'checkout',
    initialState:{
        lastOrder:null,
        status:'idle',
        error:null
    },
    reducers:{
        chekoutStart:(state,action)=>{

        },
        checkoutSuccess:(state,action)=>{
            state.status = 'success'
            state.error = null
            state.lastOrder = action.payload
        },
        checkOutFailure:(state,action)=>{
            state.status = 'failed'
            state.error = action.payload
        }

    }
})

export const {chekoutStart,checkoutSuccess,checkOutFailure} = checkoutSlice.actions
export default checkoutSlice.reducer