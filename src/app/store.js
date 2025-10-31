import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/authSlice'
import productReducer from '../redux/productSlice'
import cartReducer from '../redux/cartSlice'
import checkoutReducer from'../redux/checkoutSlice'
import calcReducer from '../redux/calcSlice'

const store = configureStore({
    reducer:{
        auth:authReducer,
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        calc:calcReducer,
    }
})

export default store
