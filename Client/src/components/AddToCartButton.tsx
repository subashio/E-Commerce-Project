import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { ShoppingBag } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

interface ProductCartProps {
  id: string;
}

export default function AddToCartButton({ id }: ProductCartProps) {
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { toast } = useToast();
  const [isAvailableCart, setIsAvailableCart] = React.useState(false);
  const { fetchCartItem, handleToast, updateCartItem } = useGlobleContext();
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(null);
  const [qty, setQty] = React.useState<number>(0);

  const AddtoCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAvailableCart) {
      try {
        await updateCartItem(cartItemDetails._id, qty + 1);
        toast({
          variant: "default",
          title: "Quantity Increased!✅",
        });
      } catch (error) {
        console.error(error);
        handleToast();
      }
    } else {
      try {
        const response = await Axios({
          ...SummaryApi.add_cart,
          data: {
            productId: id,
          },
        });

        if (response.data) {
          fetchCartItem(); // Fetch the latest cart items
          toast({
            variant: "default",
            title: "Product added to cart ✅",
          });
        }
      } catch (error) {
        console.error(error);
        handleToast();
      }
    }
  };

  React.useEffect(() => {
    const productInCart = cartList.find((item) => {
      if (typeof item.productId === "string") {
        return item.productId === id;
      } else if (item.productId && typeof item.productId === "object") {
        return item.productId._id === id;
      }
      return false;
    });

    if (productInCart) {
      setQty(productInCart.quantity);
      setIsAvailableCart(true);
      setCartItemsDetails(productInCart);
    } else {
      setQty(0);
      setIsAvailableCart(false);
      setCartItemsDetails(null);
    }
  }, [id, cartList]);

  return (
    <div>
      <Button className="mr-auto" size="sm" onClick={AddtoCart}>
        <ShoppingBag />
        Cart
        {/* {isLoading ? <Loader className="animate-spin" /> : "Cart"} */}
      </Button>
      {/* )} */}
    </div>
  );
}
