import { createSlice } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";

interface userSlice {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  mobile?: string;
  verify_email?: string;
  last_login_date?: string;
  status?: string;
  address_details?: Array<Object>;
  shopping_cart?: Array<Object>;
  orderHistory?: Array<Object>;
  role?: string;
}

const initialState: userSlice = {
  _id: "",
  name: "",
  email: "",
  avatar: "",
  mobile: "",
  verify_email: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  orderHistory: [],
  role: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      Object.assign(state, action.payload); // Dynamically update all fields in state
    },
    logout: (state) => {
      Object.assign(state, initialState); //reseting the state to the initial state
    },
  },
});

export type UserState = userSlice & PersistPartial;

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
