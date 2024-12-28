import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductDetails {
  image: string[];
  name: string;
  price: number;
  quantity: number;
  status: boolean;
}
export interface users {
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
interface orders {
  _id: string;
  userId: users | undefined;
  orderId: string;
  productId: string;
  paymentId: string;
  payment_status: string;
  delivery_address: string;
  product_details: ProductDetails;
  subTotalAmt: number;
  totalAmt: number;
}
interface orderProps {
  order: Array<orders>;
  allOrders: Array<orders>;
  isSheetOpen: boolean | undefined;
}

const initialState: orderProps = {
  order: [],
  allOrders: [],
  isSheetOpen: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Array<orders>>) => {
      state.order = [...action.payload];
    },
    setallOrders: (state, action: PayloadAction<Array<orders>>) => {
      state.allOrders = [...action.payload];
    },
    toggleSheetOpen: (state, action: PayloadAction<boolean | undefined>) => {
      state.isSheetOpen = action.payload || !state.isSheetOpen;
    },
  },
});

export const { setOrder, setallOrders, toggleSheetOpen } = orderSlice.actions;

export default orderSlice.reducer;
