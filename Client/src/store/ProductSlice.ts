import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  _id: string;
  name: string;
  image: string;
  status: boolean;
  product: Array<Products>;
}
interface SubCategoryProps {
  _id: string;
  name: string;
  categoryId: string;
}

interface Products {
  _id: string;
  name: string;
  image: string[];
  categoryId: string;
  sub_categoryId: string;
  maxQuantity: number;
  minQuantity: number;
  stock: number;
  status: boolean;
  specifications: Array<any>;
  filterOptions: Array<any>;
  searchTags: Array<any>;
  price: number;
  brandName: string;
  salePrice: number;
  wholesalePrice: number;
  description: string | TrustedHTML | undefined;
  productType: string;
  variantId: string;
}
interface Variant {
  _id: string;
  variant_name: string;
  brand_name: string[];
  material_type: string[];
}
interface Cart {
  _id: string;
  productId: string | Products;
  quantity: number;
  variantQty: Array<object>;
  userId: string;
  variantTotal: number;
}

interface productSlice {
  category: Array<Category>;
  variant: Array<Variant>;
  subcategory: Array<SubCategoryProps>;
  product: Array<Products>;
  cartList: Array<Cart>;
  viewedProduct: Array<Products>;
  wishlist: Array<Products>;
  variantSheet: boolean;
  dialogOpen: boolean;
}

const initialState: productSlice = {
  category: [],
  variant: [],
  subcategory: [],
  product: [],
  cartList: [],
  viewedProduct: [],
  wishlist: [],
  variantSheet: false,
  dialogOpen: false,
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
    setProduct: (state, action: PayloadAction<Array<Products>>) => {
      state.product = [...action.payload];
    },
    setCart: (state, action: PayloadAction<Array<Cart>>) => {
      state.cartList = [...action.payload];
    },
    setViewedProduct: (state, action: PayloadAction<Array<Products>>) => {
      state.viewedProduct = action.payload;
    },
    setWishlist: (state, action: PayloadAction<Array<Products>>) => {
      state.wishlist = action.payload;
    },
    setVariant: (state, action: PayloadAction<Array<Variant>>) => {
      state.variant = action.payload;
    },
    setVariantSheet: (state, action: PayloadAction<boolean>) => {
      state.variantSheet = action.payload;
    },
    setDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.dialogOpen = action.payload;
    },
    resetState: (state) => {
      state.cartList = [];
      state.viewedProduct = [];
      state.wishlist = [];
    },
  },
});

export const {
  setCategory,
  setSubCategory,
  setProduct,
  setCart,
  setViewedProduct,
  setWishlist,
  resetState,
  setVariant,
  setVariantSheet,
  setDialogOpen,
} = productSlice.actions;

export default productSlice.reducer;
