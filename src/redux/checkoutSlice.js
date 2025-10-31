import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    lastOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {
    checkoutStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    checkoutSuccess: (state, action) => {
      state.status = "success";
      state.lastOrder = action.payload;
      state.error = null;
    },
    checkoutFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { checkoutStart, checkoutSuccess, checkoutFailure } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
