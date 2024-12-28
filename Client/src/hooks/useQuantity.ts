import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { useGlobleContext } from "@/context/GlobleContextProvider";

export const useQuantity = (
  selectedProduct: any,
  cartItemDetails: any,
  isAvailableCart: boolean,
) => {
  const [quantity, setQuantity] = useState(1);
  const { updateCartItem } = useCart();
  const { toast } = useToast();
  const { handleToast, fetchCartItem } = useGlobleContext();

  const handleAddToCart = async (productId: string) => {
    if (!isAvailableCart) {
      try {
        const response = await Axios({
          ...SummaryApi.add_cart,
          data: {
            productId: productId,
            quantity: quantity,
          },
        });

        if (response.data) {
          fetchCartItem(); // Fetch the latest cart items
          toast({
            variant: "default",
            title: `Product added to cart with quantity ${quantity} ✅`,
          });
        }
      } catch (error) {
        console.error(error);
        handleToast();
      }
    }
  };

  const handleIncreaseQty = async () => {
    const maxQuantity = selectedProduct?.maxQuantity;
    const stockLimit = selectedProduct?.stock;

    if (maxQuantity != null && quantity >= maxQuantity) {
      toast({
        variant: "default",
        title: `Maximum quantity of ${maxQuantity} reached.`,
      });
      return;
    }

    if (quantity >= stockLimit) {
      toast({
        variant: "default",
        title: "Out of Stock ❌",
      });
      return;
    }

    try {
      if (isAvailableCart) {
        await updateCartItem(cartItemDetails._id, quantity + 1);
      }
      setQuantity((prev) => prev + 1);
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
  };

  const handleDecreaseQty = async () => {
    const minQuantity = selectedProduct?.minQuantity || 1;

    if (quantity > minQuantity) {
      try {
        if (isAvailableCart) {
          await updateCartItem(cartItemDetails._id, quantity - 1);
        }
        setQuantity((prev) => prev - 1);
        toast({
          variant: "default",
          title: "Quantity Decreased!✅",
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error updating cart",
        });
      }
    } else {
      toast({
        variant: "default",
        title: `Minimum quantity of ${minQuantity} reached.`,
      });
    }
  };

  return {
    quantity,
    handleIncreaseQty,
    handleDecreaseQty,
    handleAddToCart,
    setQuantity,
  };
};
