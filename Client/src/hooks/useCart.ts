import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import Axios from "@/lib/Axios";
import { setCart } from "@/store/ProductSlice";
import { useDispatch } from "react-redux";

export function useCart() {
  const dispatch = useDispatch();
  const { fetchCartItem } = useGlobleContext();

  const addToCart = async (id: string | undefined, qty: number) => {
    try {
      const response = await Axios({
        ...SummaryApi.add_cart,
        data: {
          productId: id,
          qty: qty,
        },
      });

      if (response && response.data) {
        console.log("cart is added to the database", response.data);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCartItem = async (id: string | undefined, qty: number) => {
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

  const deleteCartItem = async (cartId: string | undefined) => {
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
  return { addToCart, deleteCartItem, updateCartItem };
}
