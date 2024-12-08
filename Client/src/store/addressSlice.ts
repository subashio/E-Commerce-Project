import { createSlice } from "@reduxjs/toolkit";

interface Address {
  _id: string;
  address_title: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  mobile: string;
  pincode: string;
  status?: boolean;
}

interface addressSlice {
  addressList: Array<Address>;
}

const initialState: addressSlice = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState: initialState,
  reducers: {
    handleAddAddress: (state, action) => {
      state.addressList = [...action.payload];
    },
    deleteAddress: (state) => {
      Object.assign(state, initialState);
    },
    updateAddressStatus: (state, action) => {
      const { _id, status } = action.payload;

      // Ensure only the selected address has `status: true`
      state.addressList = state.addressList.map((address) => ({
        ...address,
        status: address._id === _id ? status : false,
      }));
    },
  },
});

export const { handleAddAddress, updateAddressStatus, deleteAddress } =
  addressSlice.actions;

export default addressSlice.reducer;
