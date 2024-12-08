// import { SummaryApi } from "@/constants/SummaryApi";
// import Axios from "./Axios";

// const fetchUserDetails = async () => {
//   try {
//     const res = await Axios({
//       ...SummaryApi.userDetails,
//     });
//     if (res.status === 200 && res.data) {
//       // Handle success response
//       return res.data; // Return data to the calling function
//     } else {
//       // Handle unexpected status codes
//       return {
//         error: true,
//         message: res?.data?.message || "Unexpected response structure.",
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//   }
// };

// export default fetchUserDetails;
