import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

interface ProductCartProps {
  id: string | undefined;
  className?: string;
}

export default function AddToCartButton({ id, className }: ProductCartProps) {
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { toast } = useToast();
  const [isAvailableCart, setIsAvailableCart] = React.useState(false);
  const { fetchCartItem, handleToast } = useGlobleContext();
  const { updateCartItem } = useCart();
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(null);
  const [qty, setQty] = React.useState<number>(0);

  const AddtoCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAvailableCart) {
      const maxQuantity = cartItemDetails.productId.maxQuantity || Infinity;
      if (qty + 1 <= maxQuantity) {
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
        toast({
          variant: "default",
          title: "Maximum quantity reached!❌",
        });
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
    const productInCart = cartList.find((item: any) => {
      if (typeof item.productId === "string") {
        return item.productId === id;
      } else if (item.productId && typeof item.productId === "object") {
        return item.productId._id === id;
      }
      return false;
    });

    if (productInCart) {
      const maxQuantity =
        typeof productInCart.productId === "object"
          ? productInCart.productId.maxQuantity || 0
          : 0;
      setQty(Math.max(productInCart.quantity, maxQuantity));
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
      <Button
        className={cn("h-8 w-full gap-1 rounded-lg p-2 capitalize", className)}
        onClick={AddtoCart}
      >
        {/* <Plus /> */}
        Add to Cart
      </Button>
    </div>
  );
}
