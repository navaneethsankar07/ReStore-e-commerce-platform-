import { createSlice } from "@reduxjs/toolkit";


const calcSlice = createSlice({
    name:'calc',
    initialState:{
        result:0
    },
    reducers:{
        add:(state,action)=>{
            const {num1=0,num2=0} = action.payload
            state.result = num1 + num2
        },
        sub:(state,action)=>{
                        const {num1=0,num2=0} = action.payload
            state.result = num1 - num2
        }
    }

})

export const {add,sub} = calcSlice.actions
export default calcSlice.reducer