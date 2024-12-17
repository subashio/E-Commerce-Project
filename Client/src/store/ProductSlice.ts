import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  _id: string;
  name: string;
  image: string;
  status: boolean;
}
interface SubCategoryProps {
  _id: string;
  name: string;
  categoryId: string;
}

interface Products {
  _id: string;
  name: string;
  image: Array<any>;
  categoryId: string;
  sub_categoryId: string;
  minQuantity: number;
  stock: number;
  status: boolean;
  price: number;
  brandName: string;
  salePrice: number;
  wholesalePrice: number;
  description: string;
}
interface Cart {
  _id: string;
  productId: string | Products;
  quantity: number;
  userId: string;
}

interface productSlice {
  category: Array<Category>;
  subcategory: Array<SubCategoryProps>;
  product: Array<Products>;
  cartList: Array<Cart>;
  viewedProduct: Array<Products>;
}

const initialState: productSlice = {
  category: [],
  subcategory: [],
  product: [],
  cartList: [],
  viewedProduct: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Array<Category>>) => {
      state.category = [...action.payload]; // Set categoryList to the payload directly
    },
    setSubCategory: (state, action: PayloadAction<Array<SubCategoryProps>>) => {
      state.subcategory = [...action.payload]; // set sub categoty to the payload  directly
    },
    setProduct: (state, action) => {
      state.product = [...action.payload];
    },
    setCart: (state, action) => {
      state.cartList = [...action.payload];
    },
    setViewedProduct: (state, action) => {
      state.viewedProduct = action.payload;
    },
    resetState: (state) => {
      state.cartList = [];
      state.viewedProduct = [];
      state.viewedProduct = [];
    },
  },
});

export const {
  setCategory,
  setSubCategory,
  setProduct,
  setCart,
  setViewedProduct,
  resetState,
} = productSlice.actions;

export default productSlice.reducer;
