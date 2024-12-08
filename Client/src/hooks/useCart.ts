import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import Axios from "@/lib/Axios";

export function useCart() {
  const addToCart = async (id: string) => {
    const { fetchCartItem } = useGlobleContext();
    try {
      const response = await Axios({
        ...SummaryApi.add_cart,
        data: {
          productId: id,
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
  return { addToCart };
}
