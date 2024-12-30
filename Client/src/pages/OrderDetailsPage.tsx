import GenericTable from "@/components/GenericTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { orderColumn } from "@/lib/Actions";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function OrderDetailsPage() {
  const [search, setSearch] = React.useState("");
  const orders = useSelector((state: RootState) => state.order.order);
  const user = useSelector((state: RootState) => state.user.users || []);

  const userLookup = React.useMemo(
    () => createLookup(user, "_id", "name"),
    [user],
  );
  const orderData = orders
    .map((item) => {
      const product = item.product_details;
      const userId =
        typeof item.userId === "object" ? item.userId._id : item.userId;

      return {
        image: product?.image[0] || "/placeholder.png",
        name: product?.name || "Unknown Product",
        qty: product.quantity,
        orderId: item.orderId,
        status: item.order_status,
        price: item.totalAmt || 0,
        userName: userLookup.get(userId?.toString() || "") || "Unknown User",
      };
    })
    .filter((order) => {
      // Apply search filter here
      return (
        order.name.toLowerCase().includes(search.toLowerCase()) || // Search by product name
        order.orderId.toLowerCase().includes(search.toLowerCase()) // Search by order ID
      );
    });

  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-0 xl:px-6">
      <h1 className="text-3xl font-semibold">My Orders</h1>
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
