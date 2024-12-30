import { imageSchema, loginSchema, RegisterSchema } from "@/constants/schema";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { resetState } from "@/store/ProductSlice";
import { persist } from "@/store/store";
import { logout, setError, setUserDetails } from "@/store/userSlice";
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
        navigate("/login");
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
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        //adding the userdetails to the persist
        const userDetails = await fetchUserDetails();
        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data));
        } else {
          console.error("Error fetching user details:");
        }
        toast({
          variant: "default",
          title: "Login successful ",
          description: "Welcome back! You have successfully logged in.",
        });

        navigate("/");
      }
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode === 403) {
          // Render specific error for wholesalers not approved
          dispatch(
            setError(
              "Wholesaler not approved. Approval process takes 2 to 3 days. Please wait.",
            ),
          );
          return; // Stop further execution
        }
      }
      if (error.response.status === 401) {
        dispatch(setError("User not Register"));
        return;
      }
      if (error.response.status === 404) {
        dispatch(setError("Incorrect Password"));
        return;
      }
      if (error.response.status === 423) {
        dispatch(setError("Contact to Admin to activate your account"));
        return;
      }
      if (error.response.status === 409) {
        dispatch(setError("Verify your email first"));
        return;
      }
      dispatch(setError("Something went Wrong"));
      return;
    }
  };

  const handleLogout = async () => {
    // need to add in the use user hook
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      if (response.data) {
        localStorage.clear();
        persist.purge(); // Ensure purge happens first
        dispatch(logout()); // clear the redux store state
        dispatch(resetState());
        navigate("/login"); // navigate to loginPage}
      }
    } catch (error) {
      console.log(error);
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
        } else {
          console.error("Error fetching user details: ");
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

  return {
    loginUser,
    registerUser,
    fetchUserDetails,
    uploadUserProfile,
    handleLogout,
  };
}
