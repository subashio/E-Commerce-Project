import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { customerColumn } from "@/lib/Actions";

import { createLookup } from "@/lib/lookUpMap";

import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function Customers() {
  const [search, setSearch] = React.useState("");
  const user = useSelector((state: RootState) => state.user.users || []);
  const order = useSelector((state: RootState) => state.order.allOrders || []);

  const userLookup = React.useMemo(
    () => createLookup(user, "_id", "name"),
    [user],
  );
  const customerData = order
    .map((item) => {
      const customer = item.userId;

      return {
        name: userLookup.get(customer?._id || ""),
        email: customer?.email || "Unknown Email",
        phone: customer?.mobile || "Unknown Phone",
      };
    })
    .filter((customer) => {
      // Apply search filter here
      return (
        customer.phone.toLowerCase().includes(search.toLowerCase()) || // Search by product name
        customer.email.toLowerCase().includes(search.toLowerCase()) // Search by order ID
      );
    });

  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-10">
      <h1 className="mb-2 text-3xl font-semibold"> Customers</h1>
      <DashboardBreadcrumb pathName="Customers" path="customers" />
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
            <GenericTable columns={customerColumn} data={customerData} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
