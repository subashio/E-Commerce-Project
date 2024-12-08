import { imageSchema, loginSchema, RegisterSchema } from "@/constants/schema";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { setUserDetails } from "@/store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "./use-toast";

export function useUser() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //fetching user deails
  const fetchUserDetails = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.userDetails,
      });
      if (res.status === 200 && res.data) {
        // Handle success response
        return res.data; // Return data to the calling function
      } else {
        // Handle unexpected status codes
        return {
          error: true,
          message: res?.data?.message || "Unexpected response structure.",
        };
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  //register user
  const registerUser = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response) {
        return toast({
          variant: "default",
          title: "Registration Successful ",
          description:
            "Your account has been created successfully. Welcome aboard!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went Wrong",
        description: "We couldn't able to sign. Please try again.",
      });
    }
  };

  // login user
  const loginUser = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data,
      });

      if (response.data) {
        navigate("/");
        //adding the userdetails to the persist
        const userDetails = await fetchUserDetails();
        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data));
          console.log("User details fetched successfully:");
        } else {
          console.error("Error fetching user details:");
        }
        toast({
          variant: "default",
          title: "Login successful ",
          description: "Welcome back! You have successfully logged in.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went Wrong",
        description: "We couldn't able to sign. Please try again.",
      });
    }
  };

  const uploadUserProfile = async (
    data: z.infer<typeof imageSchema>,
    handleClose: () => void,
  ) => {
    const image = new FormData();

    image.append("image", data.image[0]);

    try {
      const response = await Axios({
        ...SummaryApi.upload_avatar,
        data: image,
      });

      if (response.data) {
        const userDetails = await fetchUserDetails();
        if (userDetails?.data.avatar) {
          dispatch(setUserDetails({ avatar: userDetails.data.avatar }));

          // window.location.reload();
          console.log(
            "User details fetched successfully:",
            userDetails.data.avatar,
          );
        } else {
          console.error("Error fetching user details:");
        }
        toast({
          title: "Pofile Image Uploaded",
          description: "Your Profile has been created successfully.",
        });
      }
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
      });
    }
  };

  return { loginUser, registerUser, fetchUserDetails, uploadUserProfile };
}
