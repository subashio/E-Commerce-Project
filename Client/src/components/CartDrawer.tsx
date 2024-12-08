import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { ShoppingCartIcon, Trash2, X } from "lucide-react";
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

const cartItems = [
  {
    name: "Haldiram's Sev Bhijia dadsadsaddsad ",
    price: "$200",
    image: "/category-1.jpg",
  },
  { name: "Haldiram's Sev ", price: "$200", image: "/category-2.jpg" },
  {
    name: "Haldiram's Sev Bhijia dadsadsaddsad ",
    price: "$200",
    image: "/category-3.jpg",
  },
  {
    name: "Haldiram's Sev Bhijia  ",
    price: "$200",
    image: "/category-6.jpg",
  },
  {
    name: "Haldiram's Sev Bhijia  ",
    price: "$200",
    image: "/category-6.jpg",
  },
];

export default function CartDrawer({ button }: { button: ReactNode }) {
  const [quantity, setQuantity] = React.useState(1);
  const [isDrawerOpen, isSetDrawerOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.user);
  const { toast } = useToast();
  const isLoggedIn = user?._id;
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const handleToast = () => {
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        description: "We couldn't able to access cart. Please Sign In.",
      });
    }
  };
  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={
        isLoggedIn ? (isOpen) => isSetDrawerOpen(isOpen) : undefined
      }
    >
      <DrawerTrigger onClick={handleToast}>{button}</DrawerTrigger>
      <DrawerContent className="h-2/1 border-none">
        <Card className="w-full border-none !p-0 md:mx-auto md:w-4/5">
          <CardHeader className="mb-auto flex justify-between border-b">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                Shopping Cart <ShoppingCartIcon />
              </span>
              <X
                onClick={() => isSetDrawerOpen(false)}
                className="cursor-pointer"
              />
            </CardTitle>
            <CardDescription>Total Price: $32133</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="mx-auto">
              <ScrollArea className="h-[500px] w-full">
                <TableBody>
                  {cartItems.map((item, index) => (
                    <TableRow
                      key={index}
                      className="flex h-32 w-full items-center justify-evenly py-10"
                    >
                      <TableCell className="table-cell">
                        <img
                          alt="Product image"
                          className="w-20 object-cover"
                          src={item.image}
                        />
                      </TableCell>
                      <TableCell className="text-md my-auto mr-auto flex h-full flex-col items-start justify-center gap-2 p-0 font-semibold">
                        {item.name}
                        <Button
                          variant="link"
                          className="flex items-center p-0 text-xs text-secondary !no-underline"
                        >
                          <Trash2 className="text-destructive" /> Remove
                        </Button>
                      </TableCell>

                      <TableCell className="table-cell">
                        <div className="flex items-center">
                          <button
                            onClick={handleDecrement}
                            className="rounded-l-md border-b border-l border-t px-3 py-1"
                          >
                            -
                          </button>
                          <p className="border px-2 py-1 text-sm font-medium">
                            {quantity}
                          </p>
                          <button
                            onClick={handleIncrement}
                            className="rounded-r-md border-b border-r border-t px-3 py-1"
                          >
                            +
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="table-cell font-bold">
                        {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ScrollArea>
            </Table>
            <CardFooter className="mt-2 flex w-full flex-row items-center justify-between p-0">
              <Button
                variant="outline"
                onClick={() => isSetDrawerOpen(false)}
                className="rounded-lg"
              >
                Continue Shopping
              </Button>
              <Link
                to={isLoggedIn ? "/cart" : "/login"}
                onClick={() => isSetDrawerOpen(false)}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Proceed To Checkout
              </Link>
            </CardFooter>
          </CardContent>
        </Card>
      </DrawerContent>
    </Drawer>
  );
}
