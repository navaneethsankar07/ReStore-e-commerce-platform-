import {createSlice} from '@reduxjs/toolkit'


const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items:[],
        total:0
    },
    reducers:{
        addToCart:(state,action) => {},
        removeFromCart:(state,action) => {},
        updateQuantity:(state,action) => {},
        clearCart:(state) => {},
    }
})


export const {addToCart,removeFromCart,updateQuantity,clearCart} = cartSlice.actions
export default cartSlice.reducer