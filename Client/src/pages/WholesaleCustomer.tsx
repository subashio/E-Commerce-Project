import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { CircleAlert } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function WholesaleCustomer() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.user.users || []);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const handleApproveWholesaler = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.update_user_details,
        data: {
          id: id,
          isApprovedWholsale: true,
        },
      });
      if (response.status === 200) {
        navigate("/dashboard-page/wholesale-users");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBanWholesaler = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.update_user_details,
        data: {
          id: id,
          isApprovedWholsale: false,
        },
      });
      if (response.status === 200) {
        navigate("/dashboard-page/wholesale-users");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userData = user.find((user) => user._id === id);
  return (
    <div className="mt-10 flex h-screen flex-col gap-10">
      <h1 className="text-center text-3xl font-semibold">
        Approve Wholesale Customer
      </h1>

      <div className="grid items-center justify-center gap-9 rounded-lg bg-primary/10 p-4 py-10 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Name</h2>
          <p className="text-sm font-normal"> {userData?.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Email </h2>
          <p className="text-sm font-normal"> {userData?.email}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Phone </h2>
          <p className="text-sm font-normal"> {userData?.mobile}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Company Name </h2>
          <p className="text-sm font-normal"> {userData?.companyName}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">Office Address </h2>
          <p className="text-sm font-normal"> {userData?.officeAddress}</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-md font-semibold">GSTIN </h2>
          <p className="text-sm font-normal">
            {userData?.GSTIN || "Unknown GSTIN"}
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center gap-4">
        <Button
          className="rounded-lg"
          variant="default"
          onClick={handleApproveWholesaler}
        >
          Approve
        </Button>
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogTrigger>
            <Button className="rounded-lg" variant="destructive">
              Deactivate Account
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center justify-center gap-2">
                <CircleAlert className="mt-1 w-10 text-red-400" /> Confirm
                Account Deactivation
              </DialogTitle>
              <DialogDescription className="text-center">
                Disabling this account will permanently revoke the user's access
                to the platform.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex w-full items-center justify-center gap-2">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleBanWholesaler();
                  setIsOpen(false);
                }}
                variant="destructive"
                className="w-full"
              >
                Deactivate Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
