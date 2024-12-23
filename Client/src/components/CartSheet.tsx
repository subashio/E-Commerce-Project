import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { Loader, ShoppingBag } from "lucide-react";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";

import { useGlobleContext } from "@/context/GlobleContextProvider";
import CartItem from "./CartItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useCart } from "@/hooks/useCart";

export default function CartSheet({ button }: { button: ReactNode }) {
  const [isSheetOpen, isSetSheetOpen] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { updateCartItem, deleteCartItem } = useCart();
  const { fetchCartItem, handleToast } = useGlobleContext();
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = user?._id;
  const location = useLocation();

  // Loading state for fetching cart items
  const [isFetchingCart, setIsFetchingCart] = React.useState(false);

  // Derived state for item quantities
  const itemQuantities = React.useMemo(
    () =>
      cartList.reduce(
        (acc, item) => ({ ...acc, [item._id]: item.quantity }),
        {} as Record<string, number>,
      ),
    [cartList],
  );

  const [loadingItems, setLoadingItems] = React.useState<
    Record<string, boolean>
  >({});

  const setItemLoading = (itemId: string, status: boolean) => {
    setLoadingItems((prev) => ({ ...prev, [itemId]: status }));
  };

  const calculateTotalPrice = React.useMemo(
    () =>
      cartList.reduce((total, item) => {
        const product =
          typeof item.productId === "object" ? item.productId : null;

        if (!product) return total;

        const quantity = itemQuantities[item._id] || item.quantity;

        // Use product.price directly without considering salePrice
        return total + quantity * product.price;
      }, 0),
    [cartList, itemQuantities],
  );

  const increaseQty = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = (itemQuantities[itemId] || 0) + 1;
    setItemLoading(itemId, true);
    updateCartItem(itemId, newQuantity)
      .then(() => {
        setItemLoading(itemId, false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to increase quantity ❌",
        });
        setItemLoading(itemId, false);
      });
  };

  const decreaseQty = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = Math.max(0, (itemQuantities[itemId] || 0) - 1);
    setItemLoading(itemId, true);
    (newQuantity === 0
      ? deleteCartItem(itemId)
      : updateCartItem(itemId, newQuantity)
    )
      .then(() => {
        setItemLoading(itemId, false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Failed to update cart item ❌",
        });
        setItemLoading(itemId, false);
      });
  };

  const handleDeleteCart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setItemLoading(id, true);
    deleteCartItem(id)
      .then(() => {
        setIsFetchingCart(true);
        return fetchCartItem();
      })
      .then(() => {
        location.pathname === "/shop/checkout"
          ? navigate("/")
          : toast({ variant: "default", title: "Item removed from cart ✅" });
      })
      .catch(() => {
        toast({ variant: "destructive", title: "Failed to remove item ❌" });
      })
      .finally(() => {
        setItemLoading(id, false);
        setIsFetchingCart(false);
      });
  };

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
            <CardDescription>Total Items: {cartList.length}</CardDescription>
          </CardHeader>
          {isFetchingCart ? (
            <div className="flex h-[80vh] w-full items-center justify-center gap-2">
              <Loader className="animate-spin" /> Fecthing Cart Items
            </div>
          ) : cartList.length > 0 ? (
            <CardContent>
              <div className="mx-auto">
                <ScrollArea className="h-[500px] w-full">
                  {cartList.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      quantity={itemQuantities[item._id] || 0}
                      isLoading={loadingItems[item._id] || false}
                      increaseQty={increaseQty}
                      decreaseQty={decreaseQty}
                      handleDeleteCart={handleDeleteCart}
                    />
                  ))}
                </ScrollArea>
              </div>
              <h2 className="ml-auto mt-4 w-full text-sm font-bold">
                Total Price: ₹{calculateTotalPrice}
              </h2>
              <CardFooter className="mt-2 flex w-full flex-col items-center justify-between gap-3 p-0 sm:flex-row">
                <Link
                  to={isLoggedIn ? "/checkout" : "/login"}
                  onClick={() => isSetSheetOpen(false)}
                  className={cn(
                    "w-full sm:w-auto",
                    buttonVariants({ variant: "default" }),
                  )}
                >
                  Proceed To Checkout
                </Link>

                <Button
                  variant="outline"
                  onClick={() => isSetSheetOpen(false)}
                  className="w-full rounded-lg sm:w-auto"
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </CardContent>
          ) : (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 px-4">
              <h1 className="text-3xl font-bold text-secondary/70 dark:text-secondary-foreground/70">
                Oops!
              </h1>
              <p className="text-center text-lg">Your cart is empty.</p>
              <Link
                to="/shop"
                onClick={() => isSetSheetOpen(false)}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full sm:w-auto",
                )}
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
