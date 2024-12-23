import { baseURL, SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create an Axios instance with a base URL and credentials included
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Ensure cookies are sent with every request
});

//sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//extend the life span of access token with
// the help refresh
Axios.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    let originRequest = error.config;

    if (error.response.status === 401 && !originRequest.retry) {
      originRequest.retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originRequest);
        }
      }
      // If refresh token is invalid or expired, show toast and redirect to login
      const { toast } = useToast(); // Initialize the toast hook here
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
      });

      // Optionally, navigate the user to the login page (requires useNavigate)
      const navigate = useNavigate();
      navigate("/login");
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async (refreshToken: any) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
  }
};
export default Axios;
