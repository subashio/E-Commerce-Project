import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
  address_details?: Array<any>;
  shopping_cart?: Array<any>;
  orderHistory?: Array<any>;
  role?: string;
  isWholesaler?: boolean;
  isApprovedWholsale?: boolean;
  companyName?: string;
  officeAddress?: string;
  officePhone?: string;
  GSTIN?: string;
}

interface userSlice {
  users: Array<users>;
  currentUser: users | null; // Logged-in user
  error: string | null;
  warning: string | null;
}

const initialState: userSlice = {
  users: [],
  currentUser: null,
  error: null,
  warning: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<users>) => {
      state.currentUser = action.payload; // Dynamically update all fields in state
    },
    setAllUsers: (state, action: PayloadAction<users[]>) => {
      state.users = action.payload; // Set the list of users
    },
    logout: (state) => {
      state.currentUser = null; // Reset logged-in user
      state.error = null;
      state.warning = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload; // Set the error message
    },
    setWarning: (state, action: PayloadAction<string>) => {
      state.warning = action.payload; // Set the warning message
    },
  },
});

export type UserState = userSlice & PersistPartial;

export const { setUserDetails, setAllUsers, logout, setError, setWarning } =
  userSlice.actions;

export default userSlice.reducer;
