import AddAddress from "@/components/AddAddress";
import AddressCard from "@/components/AddressCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import GenericTable from "@/components/GenericTable";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { ChevronRight, CreditCard, MapPin } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const paymentMethodList = [
  {
    id: "stripe",
    name: "Payment with Stripe",
    description:
      "You will be redirected to Stripe website to complete your purchase securely.",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    description: "Pay with cash when your order is delivered.",
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const { fetchCartItem, fetchOrder } = useGlobleContext();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const cart = useSelector((state: RootState) => state.product.cartList); // Assuming cart.items contains the cart data
  const isLoggedIn = user?._id;
  const address = useSelector((state: RootState) => state.address.addressList);

  const { toast } = useToast();
  // Prepare table data
  const cartColumns = [
    {
      key: "image",
      render: (value: string | undefined) => (
        <img
          src={value}
          alt="product"
          className="h-10 w-10 rounded-md object-cover"
        />
      ),
    },
    { key: "product" },
    { key: "qty" },
    {
      key: "price",
      render: (value: number, row: { qty: number }) =>
        `₹${(value * row.qty).toFixed(2)}`, // Calculate total price per item
    },
  ];

  const cartData = cart.map((item) => {
    const product = typeof item.productId === "object" ? item.productId : null;
    return {
      image: product?.image[0] || "/placeholder.png", // Default image if not available
      product: product?.name || "Unknown Product",
      qty: item.quantity,
      price: product?.price || 0,
    };
  });

  const calculateSubtotal = () =>
    cartData.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const taxRate = 0.18; // 18% VAT
  const shippingFee = 0; // Assuming free shipping for now
  let subtotal = parseFloat(calculateSubtotal());
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  let grandTotal = (subtotal + tax + shippingFee).toFixed(2);

  // Find the address with status true
  const selectedAddress = address.find((address) => address.status === true);

  const addressId = selectedAddress?._id;

  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPaymentMethod(event.target.id);
  };
  const handlePlaceOrder = async () => {
    // Validate both inputs
    if (!paymentMethod || !addressId) {
      toast({
        variant: "destructive",
        title: "Please select payment method or Delivery Address",
      });

      return;
    }

    // Handle Cash on Delivery
    if (paymentMethod === "cash") {
      try {
        const response = await Axios({
          ...SummaryApi.order_CashOnDelivery,
          data: {
            list_items: cart,
            addressId: addressId,
            subTotalAmt: subtotal,
            totalAmt: grandTotal,
          },
        });

        if (response.data.success) {
          fetchCartItem();
          fetchOrder();
          navigate("/success");
        }
      } catch (error) {
        console.error(error);
      }
    } else if (paymentMethod === "stripe") {
      alert("online payment comming soon");
    }
  };
  return (
    <section>
      <MaxWidthWrapper className="my-8 flex flex-col gap-4">
        <Breadcrumbs path="/shop" pathName="shop" finalPathName="Checkout" />
        <div className="mt-4 flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="text-sm text-secondary/80 dark:text-secondary-foreground/70">
            {isLoggedIn && "Already have an account? Click here to"}{" "}
            <span className="text-primary/70">
              <Link to="/login">Sign in</Link>
            </span>
            .
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Accordion type="single" collapsible defaultValue="">
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex items-center justify-between hover:text-primary/70 hover:no-underline">
                <h3 className="flex items-center gap-2 font-medium">
                  <MapPin /> Add Delivery address
                </h3>
                <ChevronRight className="w-4 shrink-0 text-secondary/50" />
              </AccordionTrigger>
              <AccordionContent className="flex flex-col justify-end">
                <div className="ml-auto">
                  <AddAddress />
                </div>
                {address.map(
                  (item) =>
                    item.status === true && (
                      <div
                        className={`flex items-center gap-2 ${item.status ? "text-green-600" : ""}`}
                      >
                        <svg width={24} height={24} viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
                          />
                        </svg>
                        <label htmlFor="address-check">Address Confirm </label>
                      </div>
                    ),
                )}
                <AddressCard />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="flex items-center justify-between hover:text-primary/70 hover:no-underline">
                <h3 className="flex items-center gap-2 font-medium">
                  <CreditCard /> Payment Method
                </h3>
                <ChevronRight className="w-4 shrink-0 text-secondary/50" />
              </AccordionTrigger>
              <AccordionContent>
                {paymentMethodList.map((item, index) => (
                  <Card key={index} className="mt-2 bg-transparent">
                    <CardContent className="bg-transparent p-0">
                      <label
                        htmlFor={item.id}
                        className="relative flex h-24 w-full select-none items-center justify-between gap-x-3 rounded-lg px-8 font-medium hover:bg-zinc-100 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-300 dark:has-[:checked]:bg-accent"
                      >
                        <div className="flex flex-col justify-center gap-1.5">
                          <p className="text-md font-semibold">{item.name}</p>
                          <p className="max-w-sm text-xs">{item.description}</p>
                        </div>
                        <input
                          type="radio"
                          name="status"
                          className="peer/html h-4 w-4 accent-current"
                          id={item.id}
                          onChange={handlePaymentMethodChange}
                        />
                      </label>
                    </CardContent>
                  </Card>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-secondary/70 dark:text-secondary-foreground/70">
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <GenericTable columns={cartColumns} data={cartData} />
              </CardContent>
              <Separator />
              <CardFooter className="mt-4 flex flex-col justify-between gap-2">
                <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80 dark:text-secondary-foreground/80">
                  Item Subtotal
                  <span className="font-bold">₹{subtotal}</span>
                </p>
                <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80 dark:text-secondary-foreground/80">
                  Shipping Fee
                  <span className="font-bold">₹{shippingFee.toFixed(2)}</span>
                </p>
                <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80 dark:text-secondary-foreground/80">
                  Tax VAT 18%
                  <span className="font-bold">₹{tax}</span>
                </p>
              </CardFooter>
              <Separator />
              <div className="flex justify-between p-5 font-bold">
                Grand Total <span>₹{grandTotal}</span>
              </div>
            </Card>

            <Button
              onClick={handlePlaceOrder}
              disabled={cartData.length === 0}
              className="mt-8 w-full"
            >
              {paymentMethod === "stripe"
                ? "Online Payment"
                : "Cash On Delivery"}
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
