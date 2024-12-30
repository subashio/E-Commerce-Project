import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { actions, wholesaleUserColumn } from "@/lib/Actions";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import WholesaleCustomer from "./WholesaleCustomer";
import Axios from "@/lib/Axios";
import { SummaryApi } from "@/constants/SummaryApi";

export default function WholesaleUsers() {
  const [search, setSearch] = React.useState("");
  const user = useSelector((state: RootState) => state.user.users || []);
  const location = useLocation();
  const userLookup = React.useMemo(
    () => createLookup(user, "_id", "name"),
    [user],
  );

  const wholesaleUserData = user
    .filter((item) => item.isWholesaler === true)
    .map((item) => {
      const user = item;
      const userId = typeof user === "object" ? user : null;

      return {
        id: userId?._id || "",
        name: userLookup.get(userId?._id || ""),
        email: userId?.email || "Unknown Email",
        phone: userId?.mobile || "Unknown Phone",
        companyName: userId?.companyName || "Unknown Company Name",
        officeAddress: userId?.officeAddress || "Unknown Office Address",
        officePhone: userId?.officePhone || "Unknown Office Phone",
        GSTIN: userId?.GSTIN || "Unknown GSTIN",
        isApprovedWholsale: userId?.isApprovedWholsale ?? false,
      };
    })
    .filter((customer) => {
      // Apply search filter here
      return (
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase())
      );
    });
  console.log(user);

  const handleDeletewholesale = async (id: string) => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_user,
        data: {
          _id: id,
        },
      });

      if (response.data) {
        console.log("User Deleted successful");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (id: string) => {
    return actions(id, "approve-wholesale", handleDeletewholesale);
  };

  let isApproveWholesale =
    location.pathname == "/dashboard-page/approve-wholesale/:id";
  return (
    <>
      {!isApproveWholesale ? (
        <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-10">
          <h1 className="mb-2 text-3xl font-semibold">Wholesale Users</h1>
          <DashboardBreadcrumb
            pathName="Wholesale Users"
            path="whosale-users"
          />

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
                  columns={wholesaleUserColumn}
                  data={wholesaleUserData}
                  actions={(row) => renderActions(row.id)}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      ) : (
        <WholesaleCustomer />
      )}
    </>
  );
}
