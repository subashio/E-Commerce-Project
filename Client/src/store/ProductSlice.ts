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
  image: Array<any> | undefined;
  categoryId: string;
  sub_categoryId: string;
  unit: string;
  stock: number;
  status: boolean;
  price: number;
  salePrice: number;
  discount: number;
  description: string;
}
interface Cart {
  _id: string;
  productId: string;
  userId: string;
}

interface productSlice {
  categoryList: Array<Category>;
  subcategoryList: Array<SubCategoryProps>;
  productList: Array<Products>;
  cartList: Array<Cart>;
}

const initialState: productSlice = {
  categoryList: [],
  subcategoryList: [],
  productList: [],
  cartList: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Array<Category>>) => {
      state.categoryList = [...action.payload]; // Set categoryList to the payload directly
    },
    setSubCategory: (state, action: PayloadAction<Array<SubCategoryProps>>) => {
      state.subcategoryList = [...action.payload]; // set sub categoty to the payload  directly
    },
    setProduct: (state, action) => {
      state.productList = [...action.payload];
    },
    setCart: (state, action) => {
      state.cartList = [...action.payload];
    },
  },
});

export const { setCategory, setSubCategory, setProduct, setCart } =
  productSlice.actions;

export default productSlice.reducer;
