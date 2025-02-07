import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusStyles } from "@/constants/details";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import InvoiceDownloader from "@/components/InvoiceDownloader";

const orderStatusSchema = z.object({
  order_status: z.string().optional(),
});

const Orderstatus = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Success", value: "Success" },
  { label: "Cancel", value: "Cancel" },
];

export default function SingleOrderPage() {
  const { id } = useParams();

  //   const navigate = useNavigate();
  const order = useSelector((state: RootState) => state.order.allOrders || []);

  const form = useForm<z.infer<typeof orderStatusSchema>>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      order_status: "",
    },
  });
  async function handleSubmit(data: z.infer<typeof orderStatusSchema>) {
    try {
      const response = await Axios({
        ...SummaryApi.order_update_status,
        data: {
          _id: id,
          order_status: data.order_status,
        },
      });
      if (response.data) {
        console.log("data submitted: ", response.data);
        window.location.reload();
      }
      form.reset();
    } catch (error) {
      console.error("error in form submition");
    }
  }

  //   const userData = user.find((user) => user._id === id);
  const orderData = order.find((order) => order._id === id);

  const userId =
    typeof orderData?.userId === "object" ? orderData.userId : undefined;

  const product_details = orderData?.product_details;

  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-10">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold">Single Order</h1>

          <DashboardBreadcrumb pathName="Orders" path="orders" />
        </div>

        <Link
          to="/dashboard-page/orders"
          className="group flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary/50 hover:bg-white hover:text-black"
        >
          Back to all Orders
        </Link>
      </div>
      <Card className="mt-10 flex flex-col gap-4 p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-wrap justify-between gap-6">
              <h1 className="mr-2 flex items-center gap-2 text-2xl font-semibold">
                Order ID : {orderData?.orderId}
                <Badge
                  className={`rounded-lg p-1 text-xs ${
                    statusStyles[orderData?.order_status || ""] ||
                    "bg-gray-100/50 text-gray-800 hover:bg-gray-200/50"
                  }`}
                >
                  {orderData?.order_status || "Unknown"}
                </Badge>
              </h1>
              <div className="flex gap-2">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="tracking-wide"
                >
                  save
                  {form.formState.isSubmitting && (
                    <Loader className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
                {orderData && userId && (
                  <InvoiceDownloader orderData={orderData} userId={userId} />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="order_status"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Orderstatus.map((item, _index) => (
                        <SelectItem key={_index} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-md mb-2 font-semibold text-secondary">
              Customer Details
            </p>
            <p className="text-sm font-medium text-secondary/80">
              {userId?.name}
            </p>
            <p className="text-sm text-secondary/80">{userId?.email}</p>
            <p className="text-sm text-secondary/80">{userId?.mobile}</p>

            <Dialog>
              <DialogTrigger className="flex">
                <button className="text-sm font-medium text-primary hover:underline hover:underline-offset-4">
                  See More
                </button>
              </DialogTrigger>
              <DialogContent className="flex flex-col gap-2 px-5">
                <DialogTitle className="text-md mb-2 flex items-center justify-center gap-2 text-center font-semibold text-secondary">
                  <User className="mt-1 w-4" /> Customer Details
                </DialogTitle>
                <div className="flex w-full justify-between">
                  <p className="text-sm font-medium text-secondary/80">
                    Customer Name
                  </p>
                  <p className="text-sm font-medium text-secondary/80">
                    {userId?.name}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-sm font-medium text-secondary/80">
                    Email Id
                  </p>
                  <p className="text-sm text-secondary/80">{userId?.email}</p>
                </div>
                <div className="flex w-full justify-between text-end">
                  <p className="text-sm font-medium text-secondary/80">
                    Type Of Customer
                  </p>
                  <p className="text-sm text-secondary/80">
                    {userId?.isWholesaler === true ? "Wholesaler" : "Retailer"}
                  </p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-sm font-medium text-secondary/80">
                    Phone Number
                  </p>
                  <p className="text-sm text-secondary/80">{userId?.mobile}</p>
                </div>
                <div className="flex w-full justify-between">
                  <p className="text-sm font-medium text-secondary/80">
                    Status
                  </p>
                  <p className="text-sm text-secondary/80">{userId?.status}</p>
                </div>
                <div className="flex w-full justify-between text-end">
                  <p className="text-sm font-medium text-secondary/80">
                    Address
                  </p>
                  <p className="text-sm text-secondary/80">
                    {orderData?.delivery_address.address_line}
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-md mb-2 font-semibold text-secondary">
              Shipping Address
            </p>
            <p className="text-sm font-medium text-secondary/80">
              {orderData?.delivery_address.address_line}
            </p>
            <p className="text-sm font-medium text-secondary/80">
              {orderData?.delivery_address.pincode},{" "}
              {orderData?.delivery_address.state},{" "}
              {orderData?.delivery_address.country}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-md mb-2 font-semibold text-secondary">
              Order Details
            </p>
            <p className="text-sm font-medium text-secondary/80">
              Order ID: {orderData?.orderId}
            </p>
            <p className="text-sm font-medium text-secondary/80">
              Order Total: {orderData?.totalAmt}
            </p>
          </div>
        </div>
      </Card>
      <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-2xl">
        <Table>
          <TableCaption className="text-left">
            {" "}
            <div className="mt-4 flex flex-col gap-1">
              <p className="text-md mb-2 font-semibold text-secondary">
                Payment Info
              </p>
              <p className="text-sm font-medium text-secondary/80">
                {orderData?.payment_status === "CASH ON DELIVERY"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>
            </div>
          </TableCaption>
          <TableHeader>
            <TableRow className="w-[200px] border-none hover:bg-gray-50">
              <TableHead colSpan={2}>Products</TableHead>
              <TableHead colSpan={2}>Price</TableHead>
              <TableHead colSpan={2}>Quantity</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product_details?.variantQty.map((item, index) => (
              <TableRow className="" key={product_details?.name}>
                <TableCell
                  colSpan={2}
                  key={index}
                  className="font-medium text-secondary/70"
                >
                  <span className="rounded-lg bg-primary/20 px-2">
                    {item?.materialType}
                  </span>
                </TableCell>
                <TableCell
                  key={index}
                  className="font-medium text-secondary/70"
                >
                  <span className="rounded-lg bg-primary/20 px-2">
                    {item?.brandName}
                  </span>
                </TableCell>
                <TableCell
                  colSpan={3}
                  key={index}
                  className="font-medium text-secondary/70"
                >
                  <span className="rounded-lg bg-primary/20 px-2">
                    {item?.quantity}
                  </span>
                </TableCell>
                <TableCell
                  key={index}
                  className="font-medium text-secondary/70"
                >
                  <span className="rounded-lg bg-primary/20 px-2">
                    ₹{item?.quantity * product_details.price}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            <TableRow key={product_details?.name}>
              <TableCell
                colSpan={2}
                className="max-w-44 truncate font-medium text-secondary/70"
              >
                {product_details?.name}
              </TableCell>
              <TableCell className="font-medium text-secondary/70">
                ₹{product_details?.price}
              </TableCell>
              <TableCell colSpan={3} className="font-medium text-secondary/70">
                {product_details?.quantity}
              </TableCell>
              <TableCell className="font-medium text-secondary/70">
                ₹{orderData?.subTotalAmt}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className="bg-transparent">
            <TableRow>
              <TableCell className="border-none" colSpan={3}></TableCell>
              <TableCell colSpan={3}>Sub-Total</TableCell>
              <TableCell className="text-left">
                ₹{orderData?.subTotalAmt}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-none" colSpan={3}></TableCell>
              <TableCell colSpan={3}>Shipping Cost:</TableCell>
              <TableCell className="text-left">₹50.00</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="border-none" colSpan={3}></TableCell>
              <TableCell colSpan={3}>Grand Total:</TableCell>
              <TableCell className="text-left">
                ₹{orderData?.totalAmt}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

{
  /* {userId?.isWholesaler === true && (
            <div>
              <p className="text-sm text-secondary/80">{userId?.companyName}</p>
              <p className="text-sm text-secondary/80">{userId?.GSTIN}</p>
            </div>
          )} */
}
