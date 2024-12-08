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
const invoices = [
  {
    invoice: "INV001",
    status: "Paid",
    price: "$250.00",
    product: "Milk",
  },
  {
    invoice: "INV002",
    status: "Pending",
    price: "$150.00",
    product: "PayPal",
  },
  {
    invoice: "INV003",
    status: "Unpaid",
    price: "$350.00",
    product: "Bank Transfer",
  },
  {
    invoice: "INV004",
    status: "Paid",
    price: "$450.00",
    product: "Credit Card",
  },
];

const columns = [
  { header: "Invoice", key: "invoice" },
  {
    header: "Status",
    key: "status",
    render: (value: string) => (
      <Badge
        className={`rounded-sm p-1 ${
          value === "Active" ? "bg-green-200" : "bg-gray-300"
        }`}
      >
        {value}
      </Badge>
    ),
  },
  { header: "Price", key: "price" },
  { header: "Product", key: "product" },
];

const cards = [
  {
    title: "Earnings",
    number: "$93,438.78",
    discription: "Monthly revenue",
    icon: <DollarSign className="h-10 w-10 rounded-full bg-primary/20 p-2" />,
  },
  {
    title: "Orders",
    number: "93,438",
    discription: "32+New Sales",
    icon: (
      <ShoppingCartIcon className="h-10 w-10 rounded-full bg-orange-500/20 p-2" />
    ),
  },
  {
    title: "Customer",
    number: "53,438",
    discription: "30+new in 2 days",
    icon: <UsersIcon className="h-10 w-10 rounded-full bg-sky-500/20 p-2" />,
  },
];
export default function DashboardPage() {
  return (
    <section className="mt-10 px-5">
      <div
        className="relative h-[25vh] rounded-lg bg-cover bg-center bg-no-repeat sm:h-[30vh]"
        style={{ backgroundImage: "url(/dash-image.jpg)" }}
      >
        <div className="flex h-full w-full flex-col justify-center gap-y-3 px-5 sm:gap-y-6 md:px-14">
          <h1 className="max-w-2xl text-2xl font-semibold sm:text-4xl">
            Welcome To Shopme Dashboard!
          </h1>
          <p className="max-w-xs text-sm font-medium text-secondary/60 sm:text-lg md:max-w-md">
            Shopme is simple & clean design for developer and designer
          </p>
          <Link
            className={cn(
              "group mr-auto flex items-center gap-2 transition-all duration-300",
              buttonVariants({ variant: "default" }),
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
            <Card className="mt-5 min-w-[400px] rounded-lg border-none shadow-md">
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
          <GenericTable columns={columns} data={invoices} />
        </CardContent>
      </Card>
    </section>
  );
}
