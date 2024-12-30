import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { retailCustomerColumn, wholesaleCustomerColumn } from "@/lib/Actions";
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
    .filter(
      (item) =>
        typeof item.userId === "object" && item.userId?.isWholesaler === false,
    )
    .map((item) => {
      const customer = item.userId;
      const userId = typeof customer === "object" ? customer : null;

      return {
        name: userLookup.get(userId?._id || ""),
        email: userId?.email || "Unknown Email",
        phone: userId?.mobile || "Unknown Phone",
      };
    })
    .filter(
      (customer, index, self) =>
        index === self.findIndex((c) => c.email === customer.email),
    )
    .filter((customer) => {
      // Apply search filter here
      return (
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase())
      );
    });

  const wholesaleCustomerData = order
    .filter(
      (item) =>
        typeof item.userId === "object" && item.userId?.isWholesaler === true,
    )
    .map((item) => {
      const customer = item.userId;
      const userId = typeof customer === "object" ? customer : null;

      return {
        id: userId?._id || "",
        name: userLookup.get(userId?._id || ""),
        email: userId?.email || "Unknown Email",
        phone: userId?.mobile || "Unknown Phone",
        companyName: userId?.companyName || "Unknown Company Name",
        officeAddress: userId?.officeAddress || "Unknown Office Address",
        GSTIN: userId?.GSTIN || "Unknown GSTIN",
        isApprovedWholsale: userId?.isApprovedWholsale || "Unknown Status",
      };
    })
    .filter(
      (customer, index, self) =>
        index === self.findIndex((c) => c.id === customer.id),
    )
    .filter((customer) => {
      // Apply search filter here
      return (
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-10">
      <h1 className="mb-2 text-3xl font-semibold">Customers</h1>
      <DashboardBreadcrumb pathName="Customers" path="customers" />
      <Tabs defaultValue="retail" className="mt-4 w-full">
        <TabsList className="m-0 grid h-10 w-full grid-cols-2 bg-primary/20 p-0">
          <TabsTrigger
            value="retail"
            className="data-[state=active]:bg-primary/70 data-[state=active]:text-white"
          >
            Retail Customers
          </TabsTrigger>
          <TabsTrigger
            value="wholesale"
            className="data-[state=active]:bg-primary/70 data-[state=active]:text-white"
          >
            Wholesale Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="retail">
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
                <GenericTable
                  columns={retailCustomerColumn}
                  data={customerData}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wholesale">
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
                <GenericTable
                  columns={wholesaleCustomerColumn}
                  data={wholesaleCustomerData}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
