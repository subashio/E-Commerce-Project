import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { Loader, Minus, Plus, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import React from "react";

interface ProductCartProps {
  id: string;
}

export default function AddToCartButton({ id }: ProductCartProps) {
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { toast } = useToast();
  const [isAvailableCart, setIsAvailableCart] = React.useState(false);
  const { updateCartItem, deleteCartItem, fetchCartItem } = useGlobleContext();
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(null);
  const [qty, setQty] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const AddtoCart = async () => {
    setIsLoading(true);
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
          title: "Product added to cart",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      await updateCartItem(cartItemDetails._id, qty + 1);
      setQty(qty + 1);
      toast({
        variant: "default",
        title: "Product added to cart",
      });
    } catch (error) {
      console.error("Error increasing quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const decreaseQty = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      if (qty <= 1) {
        await deleteCartItem(cartItemDetails._id);
        setIsAvailableCart(false);
        setCartItemsDetails(null);
        toast({
          variant: "default",
          title: "Item removed from cart",
        });
      } else {
        await updateCartItem(cartItemDetails._id, qty - 1);
        setQty(qty - 1);
        toast({
          variant: "default",
          title: "Quantity decreased",
        });
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    } finally {
      setIsLoading(false);
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
      {isAvailableCart ? (
        <div className="flex items-center">
          <Minus
            className={`h-7 w-7 p-2 ${isLoading ? "opacity-50" : ""}`}
            onClick={!isLoading ? decreaseQty : undefined}
          />
          <p className="border px-3 py-1 text-sm font-medium">{qty}</p>
          <Plus
            className={`h-7 w-7 p-2 ${isLoading ? "opacity-50" : ""}`}
            onClick={!isLoading ? increaseQty : undefined}
          />
        </div>
      ) : (
        <Button
          className="mr-auto"
          size="sm"
          onClick={!isLoading ? AddtoCart : undefined}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin" /> : "Cart"}
          <ShoppingBag />
        </Button>
      )}
    </div>
  );
}
