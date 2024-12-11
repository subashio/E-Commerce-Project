import { createSlice } from "@reduxjs/toolkit";

interface orderProps {
  order: Array<any>;
}

const initialState: orderProps = {
  order: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    setOrder: (state, action) => {
      state.order = [...action.payload];
    },
  },
});

export const { setOrder } = orderSlice.actions;

export default orderSlice.reducer;
