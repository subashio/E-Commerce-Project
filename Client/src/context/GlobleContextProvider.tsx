import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { handleAddAddress } from "@/store/addressSlice";
import { setCart } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React, { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define type for the context
type GlobleContextType = {
  fetchAddress: () => Promise<void>;
  fetchCartItem: () => Promise<void>;
  addToCart: (product: any) => void;
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
        console.log(response.data);
        console.log(responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  React.useEffect(() => {
    fetchAddress();
    fetchCartItem();
  }, [user]);

  const value = {
    fetchCartItem,
    fetchAddress,
    addToCart,
  };

  return (
    <GlobleContext.Provider value={value}>{children}</GlobleContext.Provider>
  );
};

export default GlobleProvider;
