import { baseURL, SummaryApi } from "@/constants/SummaryApi";
import axios from "axios";

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

// // Intercept the request to add the authorization header if available
// Axios.interceptors.request.use(
//   async (config) => {
//     // If there is a valid token in the cookies, we set it to the Authorization header
//     const accessToken = getCookie("accessToken"); // Get access token from cookies
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Handle 401 Unauthorized error by refreshing the access token using the refresh token in cookies
// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originRequest = error.config;

//     if (error.response?.status === 401 && !originRequest._retry) {
//       originRequest._retry = true;

//       try {
//         // Get the refresh token from the cookie
//         const refreshToken = getCookie("refreshToken");

//         if (refreshToken) {
//           // Attempt to refresh the access token using the refresh token
//           const newAccessToken = await refreshAccessToken(refreshToken);

//           if (newAccessToken) {
//             // Attach the new access token to the failed request's Authorization header
//             originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             // Retry the original request with the new token
//             return Axios(originRequest);
//           }
//         }
//       } catch (err) {
//         console.error("Failed to refresh token:", err);
//       }
//     }

//     // If refresh fails or not a 401, reject the error
//     return Promise.reject(error);
//   },
// );

// // Function to get a specific cookie by name
// export const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();
//   return null;
// };

// // Function to refresh the access token using the refresh token
// const refreshAccessToken = async (refreshToken: string) => {
//   try {
//     const response = await Axios({
//       ...SummaryApi.refreshToken,
//       headers: {
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     });

//     const accessToken = response.data.data.accessToken;

//     // Set the new access token as a cookie (use HttpOnly and Secure flags for better security)
//     document.cookie = `accessToken=${accessToken}; path=/; HttpOnly; Secure`;

//     return accessToken;
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//   }
// };
