import { addressSchema } from "@/constants/schema";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import {
  deleteAddress,
  handleAddAddress,
  updateAddressStatus,
} from "@/store/addressSlice";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useToast } from "./use-toast";

export function useAddress() {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.address.addressList);

  const user = useSelector((state: RootState) => state.user.currentUser);

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.get_address,
      });
      const { data: responseData } = response;

      if (responseData.data) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  React.useEffect(() => {
    fetchAddress();
  }, [user]);

  const addAddressDetails = async (
    data: z.infer<typeof addressSchema>,
    closeDialog: () => void,
  ) => {
    try {
      const response = await Axios({
        ...SummaryApi.add_address,
        data: {
          ...data,
        },
      });

      const { data: responseData } = response;

      if (responseData.data) {
        toast({
          variant: "default",
          title: "Address Added uccessful ",
          description:
            "Your address has been added to the account successfully.",
        });
        closeDialog();
        fetchAddress();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
      });
    }
  };
  const editAddressDetails = async (
    data: z.infer<typeof addressSchema>,
    closeDialog: () => void,
  ) => {
    try {
      const response = await Axios({
        ...SummaryApi.update_address,
        data: {
          _id: data._id,
          ...data,
        },
      });

      const { data: responseData } = response;

      if (responseData.data) {
        toast({
          variant: "default",
          title: "Address Updated  uccessful ",
          description:
            "Your address has been added to the account successfully.",
        });
        window.location.reload();
        closeDialog();
        fetchAddress();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
      });
    }
  };

  //updating stauts
  const handleAddressStatus = async (id: any) => {
    try {
      const selectedAddress = address.find((item) => item._id === id);
      if (!selectedAddress || selectedAddress.status) return;

      const response = await Axios({
        ...SummaryApi.update_address_status,
        data: {
          _id: id,
          status: true,
        },
      });
      if (response.data.success) {
        // Update Redux: Set the clicked address's status to true and all others to false
        dispatch(
          updateAddressStatus({
            _id: id,
            status: true,
          }),
        );
        console.log("status updated success");
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {}
  };

  //delete address
  const handleDeleteAddress = async (id: any, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const response = await Axios({
        ...SummaryApi.delete_address,
        data: {
          _id: id,
        },
      });
      if (response.data.success) {
        console.log("data:", response.data);
        dispatch(deleteAddress());
        toast({
          variant: "default",
          title: "Address Removed successful ",
          description:
            "Your address has been added to the account successfully.",
        });
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {}
  };

  return {
    fetchAddress,
    handleAddressStatus,
    handleDeleteAddress,
    addAddressDetails,
    editAddressDetails,
  };
}
