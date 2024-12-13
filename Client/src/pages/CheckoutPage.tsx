// import AddAddress from "@/components/AddAddress";
// import AddressCard from "@/components/AddressCard";
// import Breadcrumbs from "@/components/Breadcrumbs";
// import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { RootState } from "@/store/store";
// import { MapPin } from "lucide-react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import GenericTable from "@/components/GenericTable";
// import { Separator } from "@/components/ui/separator";
// const invoices = [
//   {
//     image: "/banner-1.jpg",
//     qty: "1",
//     price: "$250.00",
//     product: "Milk",
//   },
//   {
//     image: "/banner-1.jpg",
//     qty: "1",
//     price: "$150.00",
//     product: "PayPal",
//   },
//   {
//     image: "/banner-1.jpg",
//     qty: "1",
//     price: "$350.00",
//     product: "Bank Transfer",
//   },
//   {
//     image: "/banner-1.jpg",
//     qty: "1",
//     price: "$450.00",
//     product: "Credit Card",
//   },
// ];

// const columns = [
//   {
//     key: "image",
//     render: (value: string | undefined) => (
//       <img
//         src={value}
//         alt="product"
//         className="h-10 w-10 rounded-md object-cover"
//       />
//     ),
//   },
//   { key: "product" },

//   { key: "qty" },
//   { key: "price" },
// ];

// export default function CheckoutPage() {
//   const user = useSelector((state: RootState) => state.user);
//   const isLoggedIn = user?._id;

//   return (
//     <section>
//       <MaxWidthWrapper className="my-8 flex flex-col gap-4">
//         <Breadcrumbs path="/shop" pathName="shop" finalPathName="Checkout" />
//         <div className="mt-4 flex flex-col gap-2">
//           <h1 className="text-4xl font-bold">Checkout</h1>
//           <p className="text-sm text-secondary/80">
//             {isLoggedIn && "Already have an account? Click here to"}{" "}
//             <span className="text-primary/70">
//               <Link to="/login">Sign in</Link>
//             </span>
//             .
//           </p>
//         </div>
//         <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
//           <Accordion type="single" collapsible defaultValue="item-1">
//             <AccordionItem value="item-1">
//               <AccordionTrigger className="flex items-center justify-between hover:text-primary/70 hover:no-underline">
//                 <h2 className="flex justify-between gap-2">
//                   <MapPin /> Add delivery address
//                 </h2>
//                 <AddAddress />
//               </AccordionTrigger>
//               <AccordionContent>
//                 <AddressCard />
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//           <div>
//             <Card className="">
//               <CardHeader>
//                 <CardTitle className="text-secondary/70">
//                   Order Details
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="px-2">
//                 <GenericTable columns={columns} data={invoices} />
//               </CardContent>
//               <Separator />
//               <CardFooter className="mt-4 flex flex-col justify-between gap-2">
//                 <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80">
//                   Item Subtotal
//                   <span className="font-bold">$2000</span>
//                 </p>
//                 <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80">
//                   Shipping Fee
//                   <span className="font-bold">$0.00</span>
//                 </p>
//                 <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80">
//                   Tax Vat 18%
//                   <span className="font-bold">$16.84</span>
//                 </p>
//               </CardFooter>
//               <Separator />
//               <div className="flex justify-between p-5 font-bold">
//                 Grand Total <span>$2334</span>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </section>
//   );
// }

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
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { CreditCard, MapPin } from "lucide-react";
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

// const CheckoutPage: React.FC = (): JSX.Element | null => {
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const { fetchCartItem, fetchOrder } = useGlobleContext();
  const user = useSelector((state: RootState) => state.user);
  const cart = useSelector((state: RootState) => state.product.cartList); // Assuming cart.items contains the cart data
  const isLoggedIn = user?._id;
  const address = useSelector((state: RootState) => state.address.addressList);

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
        `$${(value * row.qty).toFixed(2)}`, // Calculate total price per item
    },
  ];

  const cartData = cart.map((item) => {
    const product =
      typeof item.productId === "object" ? (item.productId as Products) : null;
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
  // If no address with status true, handle the error
  // if (typeof selectedAddress !== "object") {
  //   return console.error("selectedAddress is invalid or does not have _id.");
  // }

  const addressId = selectedAddress?._id;

  const handleCashOnDelivery = async () => {
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

      const { data: responseData } = response;

      if (responseData.success) {
        fetchCartItem();
        navigate("/success");
        fetchOrder();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlePaymentMethodChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPaymentMethod(event.target.id);
  };
  const handlePlaceOrder = async () => {
    if (paymentMethod === "stripe") {
      // Handle Stripe Payment Logic
      console.log("Redirecting to Stripe payment...");
      // Add your Stripe payment logic here
    } else if (paymentMethod === "cash") {
      // Handle Cash on Delivery Logic
      await handleCashOnDelivery();
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
                <h2 className="flex justify-between gap-2">
                  <MapPin /> Add delivery address
                </h2>
                <AddAddress />
              </AccordionTrigger>
              <AccordionContent>
                <AddressCard />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="flex items-center justify-between hover:text-primary/70 hover:no-underline">
                <h2 className="flex justify-between gap-2">
                  <CreditCard /> Payment Method
                </h2>
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
                          <h1 className="">{item.name}</h1>
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
                  <span className="font-bold">${subtotal}</span>
                </p>
                <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80 dark:text-secondary-foreground/80">
                  Shipping Fee
                  <span className="font-bold">${shippingFee.toFixed(2)}</span>
                </p>
                <p className="flex w-full items-center justify-between text-sm font-semibold text-secondary/80 dark:text-secondary-foreground/80">
                  Tax VAT 18%
                  <span className="font-bold">${tax}</span>
                </p>
              </CardFooter>
              <Separator />
              <div className="flex justify-between p-5 font-bold">
                Grand Total <span>${grandTotal}</span>
              </div>
            </Card>

            <Button
              onClick={handlePlaceOrder}
              disabled={paymentMethod === ""}
              className="mt-8 w-full"
            >
              {paymentMethod === "stripe" ? "Online Payment" : "Place Order"}
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

// export default CheckoutPage;
