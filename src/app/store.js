import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../redux/authSlice'
import productReducer from '../redux/productSlice'
import cartReducer from '../redux/cartSlice'
import checkoutReducer from'../redux/checkoutSlice'

const store = configureStore({
    reducer:{
        auth:authReducer,
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
    }
})

export default store
