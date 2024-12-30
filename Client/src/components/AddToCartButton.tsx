import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { toggleSheetOpen } from "@/store/orderSlice";
import { setVariantSheet } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(cartList);
  const [qty, setQty] = React.useState<number>(1);

  const dispatch = useDispatch();

  const product = useSelector((state: RootState) => state.product.product);

  const selectedProduct = product.find((product: any) => {
    return product._id === id;
  });

  const AddtoCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAvailableCart) {
      const maxQuantity = selectedProduct?.maxQuantity;
      const stockLimit = selectedProduct?.stock;

      if (maxQuantity != null && qty >= maxQuantity) {
        toast({
          variant: "default",
          title: `Maximum quantity of ${maxQuantity} reached.`,
        });
        return;
      }

      if (stockLimit != null && qty >= stockLimit) {
        toast({
          variant: "default",
          title: "Out of Stock ❌",
        });
        return;
      }

      try {
        if (isAvailableCart) {
          await updateCartItem(cartItemDetails._id, qty + 1);
        }
        setQty((prev) => prev + 1);
        toast({
          variant: "default",
          title: "Quantity Increased!✅",
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error updating cart",
        });
      }
    } else {
      try {
        const response = await Axios({
          ...SummaryApi.add_cart,
          data: {
            productId: id,
            quantity: qty,
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
        return item.productId === selectedProduct?._id;
      } else if (item.productId && typeof item.productId === "object") {
        return item.productId._id === selectedProduct?._id;
      }
      return false;
    });

    if (productInCart) {
      setQty(productInCart.quantity);
      setIsAvailableCart(true);
      setCartItemsDetails(productInCart);
    } else {
      setQty(selectedProduct?.minQuantity ?? 1);
      setIsAvailableCart(false);
      setCartItemsDetails(null);
    }
  }, [id, cartList]);

  const handleAddVariant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(setVariantSheet(true));
  };

  return (
    <div>
      {!selectedProduct?.variantId ? (
        <Button
          className={cn(
            "h-8 w-full gap-1 rounded-lg p-2 capitalize",
            className,
          )}
          onClick={(e: React.MouseEvent) => {
            AddtoCart(e);
            dispatch(toggleSheetOpen(true));
          }}
        >
          Add to Cart
        </Button>
      ) : (
        <Button
          className={cn(
            "h-8 w-full gap-1 rounded-lg p-2 capitalize",
            className,
          )}
          onClick={handleAddVariant}
        >
          Add to Cart
        </Button>
      )}
    </div>
  );
}
