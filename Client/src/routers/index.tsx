import App from "@/App";
import Dashboard from "@/layouts/Dashboard";
import Profile from "@/layouts/Profile";
import Shop from "@/layouts/shop";
import AddressPage from "@/pages/AddressPage";
import CartPage from "@/pages/CartPage";
import Category from "@/pages/Category";
import Customers from "@/pages/Customers";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import Orders from "@/pages/Orders";
import OtpVerification from "@/pages/OtpVerification";
import Products from "@/pages/Products";
import ProfilePage from "@/pages/ProfilePage";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import SearchPage from "@/pages/SearchPage";
import ShopPage from "@/pages/ShopPage";
import SubCategory from "@/pages/SubCategory";
import VerfiyEmail from "@/pages/VerfiyEmail";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />, // Layout wraps all pages
      children: [
        { path: "", element: <Home /> },
        { path: "search", element: <SearchPage /> },
        { path: "cart", element: <CartPage /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "verify-forgot-password-otp", element: <OtpVerification /> },
        { path: "reset-password", element: <ResetPassword /> },
        {
          path: "/profile-page",
          element: <Profile />,
          children: [
            { path: "", element: <ProfilePage /> },
            { path: "order-details", element: <OrderDetailsPage /> },
            { path: "address-details", element: <AddressPage /> },
          ],
        },
        {
          path: "/shop/:id",
          element: <Shop />,
          children: [{ path: "", element: <ShopPage /> }],
        },
      ],
    },

    {
      path: "/dashboard-page",
      element: <Dashboard />,
      children: [
        { path: "", element: <DashboardPage /> },
        {
          path: "products",
          element: <Products />,
          children: [
            { path: "add-product", element: <Products /> },
            { path: "edit-product/:id", element: <Products /> },
          ],
        },
        {
          path: "category",
          element: <Category />,
          children: [
            { path: "add-category", element: <Category /> },
            { path: "edit-category/:id", element: <Category /> },
          ],
        },
        {
          path: "sub-category",
          element: <SubCategory />,
          children: [
            { path: "add-sub-category", element: <SubCategory /> },
            { path: "edit-sub-category/:id", element: <SubCategory /> },
          ],
        },
        { path: "orders", element: <Orders /> },
        { path: "customers", element: <Customers /> },
      ],
    },

    {
      path: "/verify-email",
      element: <VerfiyEmail />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
