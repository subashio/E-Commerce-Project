import { buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { handleAddAddress } from "@/store/addressSlice";
import { setOrder } from "@/store/orderSlice";
import {
  setCart,
  setCategory,
  setProduct,
  setSubCategory,
  setViewedProduct,
  setWishlist,
} from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Define type for the context
type GlobleContextType = {
  fetchAddress: () => Promise<void>;
  fetchCartItem: () => Promise<void>;
  fetchAllProduct: () => Promise<void>;
  handleToast: () => void;
  fetchOrder: () => Promise<void>;
  // addToCart: (product: any) => void;
  fetchAllCategory: () => Promise<void>;
  fetchAllSubCategory: () => Promise<void>;
  fetchAllViewedProduct: () => Promise<void>;
  fetchAllWishlist: () => Promise<void>;
  // updateCartItem: (id: string, qty: any) => Promise<void>;
  // deleteCartItem: (cartId: string) => Promise<void>;
  // fetchProductByCategory: (id: string, setProduct?: any) => Promise<void>;
};

// Creating the context
export const GlobleContext = React.createContext<GlobleContextType | undefined>(
  undefined,
);

// Custom hook to use the context
export const useGlobleContext = () => {
  const context = React.useContext(GlobleContext);
  if (!context) {
    throw new Error("useGlobleContext must be used within a GlobleProvider");
  }
  return context;
};

const GlobleProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = React.useMemo(() => !!user?._id, [user]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_cart,
      });
      const { data: responseData } = response;
      if (responseData) {
        dispatch(setCart(responseData.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
  // //fetching products by category
  // const fetchProductByCategory = async (id: string, setProduct?: any) => {
  //   try {
  //     const response = await Axios({
  //       ...SummaryApi.filter_product_by_category,
  //       params: {
  //         id: id, // Make sure this is correctly passed
  //       },
  //     });

  //     if (response.data?.data) {
  //       setProduct(response.data.data);
  //       console.log("this is the filter data : ", response.data);
  //     }
  //   } catch (error) {
  //     console.error("error fetching product by categoryId");
  //   }
  // };

  // fetching the all the product
  const fetchAllProduct = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_product,
      });

      if (response.data.data) {
        dispatch(setProduct(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
    }
  };
  //fecth all category
  const fetchAllCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_Category,
      });

      if (response.data.data) {
        dispatch(setCategory(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching Category data: ", error);
    }
  };
  //fetch all subCategorys
  const fetchAllSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_SubCategory,
      });
      if (response.data.data) {
        dispatch(setSubCategory(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching Sub-category: ", error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_orderDetails,
      });
      const { data: responseData } = response;
      if (responseData) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
  //fetching the address
  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_address,
      });
      const { data: responseData } = response;

      if (responseData.data) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // const updateCartItem = async (id: string, qty: any) => {
  //   try {
  //     const response = await Axios({
  //       ...SummaryApi.update_cart,
  //       data: {
  //         _id: id,
  //         qty: qty,
  //       },
  //     });
  //     const { data: responseData } = response;

  //     if (responseData) {
  //       fetchCartItem();
  //       return responseData;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const deleteCartItem = async (cartId: string) => {
  //   try {
  //     const response = await Axios({
  //       ...SummaryApi.delete_cart,
  //       data: {
  //         _id: cartId,
  //       },
  //     });
  //     const { data: responseData } = response;
  //     if (responseData.success) {
  //       dispatch(setCart([]));
  //       fetchCartItem();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleToast = () => {
    if (!isLoggedIn) {
      toast({
        variant: "default",
        title: "Login",
        description: "login to add products to cart",
        action: (
          <ToastAction
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            onClick={() => navigate("/login")}
            altText="Goto schedule to undo"
          >
            Login
          </ToastAction>
        ),
      });
    }
  };
  const fetchAllViewedProduct = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_viewed_products,
      });
      if (response.data.data) {
        const setData = response.data.data.map((item: any) => item.productId);
        dispatch(setViewedProduct(setData));
        // console.log(setData);
      }
    } catch (error) {
      console.error("Error fetching ViewedProducts: ", error);
    }
  };
  const fetchAllWishlist = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_wishlist,
      });
      if (response.data.data) {
        const getWishlist = response.data.data.map(
          (item: any) => item.productId,
        );
        dispatch(setWishlist(getWishlist));
      }
    } catch (error) {
      console.error("Error fetching ViewedProducts: ", error);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchAddress();
      fetchCartItem();
      fetchOrder();
      fetchAllViewedProduct();
      fetchAllWishlist();
    }
    fetchAllProduct();
    fetchAllCategory();
    fetchAllSubCategory();
  }, [user]);

  const value = {
    fetchCartItem,
    fetchAddress,
    handleToast,
    fetchAllProduct,
    // updateCartItem,
    // deleteCartItem,
    fetchOrder,
    fetchAllCategory,
    fetchAllSubCategory,
    fetchAllWishlist,
    fetchAllViewedProduct,
    // addToCart,
  };

  return (
    <GlobleContext.Provider value={value}>{children}</GlobleContext.Provider>
  );
};

export default GlobleProvider;
