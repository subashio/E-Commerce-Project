import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { useToast } from "@/hooks/use-toast";

interface ProductCartProps {
  data?: Products;
  id: string;
}
export default function AddToCartButton({ id }: ProductCartProps) {
  const [isCartAvailable, setIsCartAvialable] = React.useState<boolean>(false);
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { fetchCartItem } = useGlobleContext();
  const { toast } = useToast();

  async function AddtoCart() {
    try {
      const response = await Axios({
        ...SummaryApi.add_cart,
        data: {
          productId: id,
        },
      });

      if (response && response.data) {
        console.log("cart is added to the database", response.data);
        toast({
          variant: "default",
          title: "Product added to cart",
        });
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  const cart = cartList.map((item) => console.log(item.productId));

  React.useEffect(() => {
    const checkCartItem = cartList.some((item) => item.productId === id);
    console.log("Checking if item is in cart:", {
      id,
      cartList,
      checkCartItem,
    });
    setIsCartAvialable(checkCartItem);
  }, [cartList, id]);
  return (
    <>
      {isCartAvailable ? (
        <div className="flex items-center">
          <Minus className="h-7 w-7 p-2" />

          <p className="border px-3 py-1 text-sm font-medium">1</p>
          <Plus className="h-7 w-7 p-2" />
        </div>
      ) : (
        <Button size="sm" onClick={() => AddtoCart()}>
          Add
          <Plus />
        </Button>
      )}
    </>
  );
}
