import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { handleAddAddress } from "@/store/addressSlice";
import { setOrder } from "@/store/orderSlice";
import { setCart, setProduct } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define type for the context
type GlobleContextType = {
  fetchAddress: () => Promise<void>;
  fetchCartItem: () => Promise<void>;
  fetchAllProduct: () => Promise<void>;
  fetchOrder: () => Promise<void>;
  addToCart: (product: any) => void;
  updateCartItem: (id: string, qty: any) => Promise<void>;
  deleteCartItem: (cartId: string) => Promise<void>;
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
  const { toast } = useToast();

  const addToCart = (product: any) => {
    if (user) {
      const CartItem = [...product];
      dispatch(setCart(CartItem));
      toast({
        variant: "default",
        description: "Product Added to cart successfully!",
      });
    } else {
      toast({
        variant: "default",
        description: "login to add products to cart",
        action: (
          <ToastAction altText="Goto schedule to undo">
            <Button> Login </Button>
          </ToastAction>
        ),
      });
    }
  };

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
        console.log("this is products:", response.data);
      }
    } catch (error) {
      console.error(error);
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

  const updateCartItem = async (id: string, qty: any) => {
    try {
      const response = await Axios({
        ...SummaryApi.update_cart,
        data: {
          _id: id,
          qty: qty,
        },
      });
      const { data: responseData } = response;

      if (responseData) {
        fetchCartItem();
        return responseData;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteCartItem = async (cartId: string) => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_cart,
        data: {
          _id: cartId,
        },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setCart([]));
        fetchCartItem();
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchAddress();
    fetchCartItem();
    fetchOrder();
    fetchAllProduct();
  }, [user]);

  const value = {
    fetchCartItem,
    fetchAddress,
    fetchAllProduct,
    updateCartItem,
    deleteCartItem,
    fetchOrder,
    addToCart,
  };

  return (
    <GlobleContext.Provider value={value}>{children}</GlobleContext.Provider>
  );
};

export default GlobleProvider;
