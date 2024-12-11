import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { ShoppingBag, Trash2 } from "lucide-react";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { Badge } from "./ui/badge";

export default function CartSheet({ button }: { button: ReactNode }) {
  const [isSheetOpen, isSetSheetOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.user);
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { toast } = useToast();
  const [totalPrice, setTotalPrice] = React.useState(0);
  const { updateCartItem, deleteCartItem, fetchCartItem } = useGlobleContext();
  const [itemQuantities, setItemQuantities] = React.useState<any>({});
  const isLoggedIn = user?._id;

  const handleToast = () => {
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        description: "We couldn't able to access cart. Please Sign In.",
      });
    }
  };

  const calculateTotalPrice = (cartList: any, quantities: any) => {
    return cartList.reduce((total: number, item: any) => {
      const product =
        typeof item.productId === "object" ? item.productId : null;
      if (!product) return total;

      const quantity = quantities[item._id] || item.quantity;

      // Check if there's a discount
      const discountedPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

      return total + quantity * discountedPrice;
    }, 0);
  };

  // Increase product quantity
  const increaseQty = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = cartList.find((item) => item._id === itemId);
    if (!cartItem) return;

    // Update the quantity in the state and send the update to the server
    const newQuantity = (itemQuantities[itemId] || cartItem.quantity) + 1;
    await updateCartItem(cartItem._id, newQuantity);

    setItemQuantities((prev: any) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    toast({
      variant: "default",
      title: "Product added to cart",
    });
  };

  // Decrease product quantity
  const decreaseQty = async (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = cartList.find((item) => item._id === itemId);
    if (!cartItem) return;

    const newQuantity = (itemQuantities[itemId] || cartItem.quantity) - 1;

    if (newQuantity < 1) {
      // Delete the item if the new quantity is less than 1
      try {
        await deleteCartItem(itemId);

        // Update the local state to remove the item
        setItemQuantities((prev: any) => {
          const updatedQuantities = { ...prev };
          delete updatedQuantities[itemId];
          return updatedQuantities;
        });
        fetchCartItem();

        toast({
          variant: "default",
          title: "Item removed from cart",
        });
      } catch (error) {
        console.error("Error deleting cart item:", error);
        toast({
          variant: "destructive",
          title: "Failed to remove item",
        });
      }
    } else {
      // Update the cart item quantity
      try {
        await updateCartItem(cartItem._id, newQuantity);

        setItemQuantities((prev: any) => ({
          ...prev,
          [itemId]: newQuantity,
        }));

        toast({
          variant: "default",
          title: "Quantity decreased",
        });
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        toast({
          variant: "destructive",
          title: "Failed to decrease quantity",
        });
      }
    }
  };

  const handleDeleteCart = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteCartItem(id);

      // Update the local state to remove the item
      setItemQuantities((prev: any) => {
        const updatedQuantities = { ...prev };
        delete updatedQuantities[id];
        return updatedQuantities;
      });
      fetchCartItem();
      toast({
        variant: "default",
        title: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast({
        variant: "destructive",
        title: "Failed to remove item",
      });
    }
  };

  // Set cart item details and quantity when cartList changes
  React.useEffect(() => {
    if (cartList.length > 0) {
      const initialQuantities = cartList.reduce((acc: any, item: any) => {
        acc[item._id] = item.quantity;
        return acc;
      }, {});
      setItemQuantities(initialQuantities);
      setTotalPrice(calculateTotalPrice(cartList, initialQuantities)); // Use initialQuantities here
    } else {
      setItemQuantities({});
      setTotalPrice(0);
    }
  }, [cartList]);

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={isLoggedIn ? (isOpen) => isSetSheetOpen(isOpen) : undefined}
    >
      <SheetTrigger onClick={handleToast}>{button}</SheetTrigger>
      <SheetContent className="w-full p-0">
        <Card className="w-full border-none !p-0">
          <CardHeader className="mb-auto flex justify-between border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Shopping Cart <ShoppingBag />
              </span>
            </CardTitle>
            <CardDescription>Total Price: ₹{totalPrice}</CardDescription>
          </CardHeader>
          {cartList.length > 0 ? (
            <CardContent>
              <div className="mx-auto">
                <ScrollArea className="h-[500px] w-full">
                  <div>
                    {cartList.map((item: any) => {
                      const product =
                        typeof item.productId === "object"
                          ? item.productId
                          : null;

                      if (!product) {
                        return <div key={item._id}>Product not found</div>;
                      }
                      // Get the quantity for the current item from the state
                      const itemQuantity =
                        itemQuantities[item._id] || item.quantity;

                      return (
                        <div
                          key={item._id}
                          className="flex h-auto w-full flex-wrap items-center gap-4 border-b py-4"
                        >
                          <div>
                            <img
                              alt={product?.name}
                              className="w-20 object-cover"
                              src={product?.image[0] || "/default_image.png"} // Use product.image if available
                            />
                          </div>
                          <div className="my-auto mr-auto flex h-full max-w-60 flex-col items-start justify-center gap-2 text-sm font-semibold sm:max-w-xs">
                            {product?.name}
                            <div className="font-bold">
                              ₹{product?.price}
                              {product?.salePrice && (
                                <del className="ml-1 text-secondary/50 dark:text-secondary-foreground/70">
                                  ₹{product?.salePrice}
                                </del>
                              )}
                              {product.discount && (
                                <Badge className="ml-2 bg-red-600 hover:bg-red-500">
                                  {product.discount} %
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-start gap-1">
                            <div className="flex">
                              <button
                                onClick={(e) => decreaseQty(e, item._id)}
                                className="rounded-l-md border-b border-l border-t px-3 py-1"
                              >
                                -
                              </button>
                              <p className="border px-2 py-1 text-sm font-medium">
                                {itemQuantity}
                              </p>
                              <button
                                onClick={(e) => increaseQty(e, item._id)}
                                className="rounded-r-md border-b border-r border-t px-3 py-1"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={(e) => handleDeleteCart(e, item._id)}
                              className="flex items-center gap-1 !p-0 text-xs text-secondary !no-underline dark:text-secondary-foreground"
                            >
                              <Trash2 className="w-3.5 text-destructive" />{" "}
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              <CardFooter className="mt-2 flex w-full flex-row items-center justify-between p-0">
                <Button
                  variant="outline"
                  onClick={() => isSetSheetOpen(false)}
                  className="rounded-lg"
                >
                  Continue Shopping
                </Button>
                <Link
                  to={isLoggedIn ? "/shop/checkout" : "/login"}
                  onClick={() => isSetSheetOpen(false)}
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Proceed To Checkout
                </Link>
              </CardFooter>
            </CardContent>
          ) : (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2">
              <h1 className="text-3xl font-bold text-secondary/70 dark:text-secondary-foreground/70">
                Opps!
              </h1>
              <p>Your cart is empty.</p>
              <Link
                to="/shop"
                onClick={() => isSetSheetOpen(false)}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Shop Now
              </Link>
            </div>
          )}
        </Card>
      </SheetContent>
    </Sheet>
  );
}
