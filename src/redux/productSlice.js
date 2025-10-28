import {createSlice} from '@reduxjs/toolkit'


const productSlice = createSlice({
    name:'products',
    initialState:{
        items: [],
        status:' idle',
        loading:false,
        error:null
    },
    reducers:{
        setProducts:(state,action)=>{},
        addProduct:(state,action)=>{},
        updateProduct:(state,action)=>{},
        removeProduct:(state,action)=>{},
    }
})

export const {setProducts,addProduct,updateProduct,removeProduct} = productSlice.actions
export default productSlice.reducer