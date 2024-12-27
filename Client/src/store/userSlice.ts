import { createSlice } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";

interface users {
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
  isWholesaler?: boolean;
  isApprovedWholsale?: boolean;
}

interface userSlice {
  users: Array<users>;
  currentUser: users | null; // Logged-in user
}

const initialState: userSlice = {
  users: [],
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.currentUser = action.payload; // Dynamically update all fields in state
    },
    setAllUsers: (state, action) => {
      state.users = action.payload; // Set the list of users
    },
    logout: (state) => {
      state.currentUser = null; // Reset logged-in user
    },
  },
});

export type UserState = userSlice & PersistPartial;

export const { setUserDetails, setAllUsers, logout } = userSlice.actions;

export default userSlice.reducer;
