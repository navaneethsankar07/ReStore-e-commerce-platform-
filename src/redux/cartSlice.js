import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const docRef = doc(db, "carts", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data().items || [];
  else return [];
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, userId }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);
      let updatedItems = [];
      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const exists = existingItems.some((item) => item.id === product.id);
        updatedItems = exists ? existingItems : [...existingItems, product];
      } else {
        updatedItems = [product];
      }
      await setDoc(docRef, { items: updatedItems });
      return updatedItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "carts", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingItems = docSnap.data().items || [];
        const updatedItems = existingItems.filter((item) => item.id !== id);
        await updateDoc(docRef, { items: updatedItems });
        return updatedItems;
      } else return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearFirestoreCart = createAsyncThunk(
  "cart/clearFirestoreCart",
  async (userId, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "carts", userId);
      await deleteDoc(docRef);
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce(
          (acc, item) => acc + item.price,
          0
        );
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce(
          (acc, item) => acc + item.price,
          0
        );
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce(
          (acc, item) => acc + item.price,
          0
        );
      })
      .addCase(clearFirestoreCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      });
  },
});

export default cartSlice.reducer;
