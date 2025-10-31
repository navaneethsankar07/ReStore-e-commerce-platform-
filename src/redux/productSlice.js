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
        setProducts:(state,action)=>{
            state.items = action.payload;
            state.status = 'succeeded'
        },
        addProduct:(state,action)=>{
            state.items.push(action.payload)
        },
        updateProduct:(state,action)=>{
            const updated = action.payload;
      const index = state.items.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.items[index] = updated;
      }
        },
        removeProduct:(state,action)=>{
             const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
        },
    }
})

export const {setProducts,addProduct,updateProduct,removeProduct} = productSlice.actions
export default productSlice.reducer