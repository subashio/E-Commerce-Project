import GenericTable from "@/components/GenericTable";
import { cn } from "@/lib/utils";
import { DollarSign, Plus, ShoppingCartIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { createLookup } from "@/lib/lookUpMap";
import React from "react";

const RecentOrdersColoum = [
  { header: "Order ID", key: "orderId" },
  {
    header: "Status",
    key: "status",
    render: (value: boolean) => (
      <Badge
        className={`rounded-lg p-1 text-xs ${
          value === true
            ? "bg-amber-100/50 text-amber-800 hover:bg-amber-200/50"
            : "bg-green-500/50 text-green-900 hover:bg-green-500/50"
        }`}
      >
        {value === true ? "Pending" : "Success"}
      </Badge>
    ),
  },
  { header: "Price", key: "price" },
  { header: "Product", key: "name" },
];

export default function DashboardPage() {
  const orders = useSelector((state: RootState) => state.order.allOrders || []);
  const user = useSelector((state: RootState) => state.user.users || []);
  const userLookup = React.useMemo(
    () => createLookup(user, "_id", "name"),
    [user],
  );

  const orderData = orders.slice(0, 6).map((item) => {
    const product = item.product_details;
    const userId =
      typeof item.userId === "object" ? item.userId?._id : undefined;

    return {
      image: product?.image[0] || "/placeholder.png",
      name: product?.name || "Unknown Product",
      qty: product.quantity,
      orderId: item.orderId,
      status: product.status,
      price: item.totalAmt || 0,
      userName: userLookup.get(userId || "") || "Unknown User",
    };
  });
  const cards = [
    {
      title: "Earnings",
      number: `₹${orders.reduce((acc, item) => acc + item.totalAmt, 0)}`,
      discription: "Monthly revenue",
      icon: <DollarSign className="h-10 w-10 rounded-full bg-primary/20 p-2" />,
    },
    {
      title: "Orders",
      number: orders.length,
      discription: `${orders.length} New Sales`,
      icon: (
        <ShoppingCartIcon className="h-10 w-10 rounded-full bg-orange-500/20 p-2" />
      ),
    },
    {
      title: "Customer",
      number: orders.filter((item) => item.userId).length,
      discription: "30+new in 2 days",
      icon: <UsersIcon className="h-10 w-10 rounded-full bg-sky-500/20 p-2" />,
    },
  ];
  return (
    <section className="mt-10 px-5">
      <div
        className="relative h-[26vh] rounded-lg bg-cover bg-left bg-no-repeat sm:h-[30vh] xl:h-[40vh]"
        style={{ backgroundImage: "url(/dash-banner.jpg)" }}
      >
        <div className="flex h-full w-full flex-col justify-center gap-y-3 px-5 sm:gap-y-6 md:px-14">
          <h1 className="max-w-2xl text-2xl font-semibold sm:text-2xl">
            Welcome to the Admin Dashboard!
          </h1>
          <p className="max-w-xs text-sm font-medium text-secondary/60 sm:text-sm md:max-w-sm">
            Manage products, orders, and customer data in one place. Monitor
            performance and track sales easily
          </p>
          <Link
            className={cn(
              "group mr-auto flex items-center gap-2 transition-all duration-300",
              buttonVariants({ variant: "secondary" }),
            )}
            to="/dashboard-page/products"
          >
            Create Product
            <Plus className="transition-all duration-300 group-hover:rotate-180" />
          </Link>
        </div>
      </div>

      <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-2xl">
        <div className="flex w-max space-x-4 p-4">
          {cards.map((_item, _index) => (
            <Card className="mt-5 w-96 rounded-lg border-none from-[#c7c6d1] shadow-md">
              <CardContent className="flex flex-col gap-10 p-6">
                <CardTitle className="flex items-center justify-between">
                  {_item.title}
                  {_item.icon}
                </CardTitle>
                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold">{_item.number}</h2>
                  <p>{_item.discription}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Card className="my-10">
        <CardHeader>
          <CardTitle className="text-secondary/70">Recent Order</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
            <GenericTable columns={RecentOrdersColoum} data={orderData} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
