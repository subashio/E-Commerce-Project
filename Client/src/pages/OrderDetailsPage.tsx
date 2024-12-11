import GenericTable from "@/components/GenericTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export const orderColumn = [
  {
    header: "Image",
    key: "image",
    render: (value: string | undefined) => (
      <img
        src={value}
        alt="product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },

  { header: "Product Name", key: "name" },
  { header: "orderId", key: "orderId" },
  { header: "Items", key: "qty" },

  {
    header: "Status",
    key: "status",
    render: (value: boolean) => (
      <Badge
        className={`rounded-sm p-1 px-1.5 text-xs ${
          value === true
            ? "bg-green-500/50 text-green-900 hover:bg-green-500/50"
            : "hover:bg-red-500/ 50 bg-red-500/50 text-red-950"
        }`}
      >
        {value === true ? "Processing" : "Completed"}
      </Badge>
    ),
  },
  { header: "Price", key: "price" },
];

export default function OrderDetailsPage() {
  const [search, setSearch] = React.useState("");
  const orders = useSelector((state: RootState) => state.order.order);

  // const orderData = orders.map((item) => {
  //   return item.product_details;
  // });
  const orderData = orders.map((item) => {
    const product = item.product_details;
    return {
      image: product?.image[0] || "/placeholder.png", // Default image if not available
      name: product?.name || "Unknown Product",
      qty: product.quantity,
      orderId: item.orderId,
      status: product.status,
      price: product?.price || 0,
    };
  });
  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-0">
      <h1 className="text-3xl font-semibold">My Orders</h1>
      {/* {orders.map((item, index) => {
        return (
          <div key={index}>
            <p>Order no: {item.orderId}</p>
            <img src={item.product_details.image[0]} alt="image" />
            <p>{item.product_details.name}</p>
            <p>{item.product_details.status}</p>
            <p>{item.product_details.price}</p>
            <p>{item.product_details.quantity}</p>
          </div>
        );
      })} */}
      <Card className="my-10">
        <CardHeader className="w-full items-center justify-between gap-2 sm:flex-row">
          <Input
            placeholder="search"
            className="w-full sm:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
            <GenericTable columns={orderColumn} data={orderData} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
