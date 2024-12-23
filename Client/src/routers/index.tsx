import App from "@/App";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "@/layouts/Dashboard";
import Profile from "@/layouts/Profile";
import Shop from "@/layouts/shop";
import AddressPage from "@/pages/AddressPage";
import CategoryList from "@/pages/CategoryList";
import CheckoutPage from "@/pages/CheckoutPage";
import Customers from "@/pages/Customers";
import DashboardPage from "@/pages/DashboardPage";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import Orders from "@/pages/Orders";
import OtpVerification from "@/pages/OtpVerification";
import ProductList from "@/pages/ProductList";
import ProductPage from "@/pages/ProductPage";
import ProfilePage from "@/pages/ProfilePage";
import { ProtectedRoute } from "@/pages/ProtectedRoute";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import SearchPage from "@/pages/SearchPage";
import ShopPage from "@/pages/ShopPage";
import SubCategoryList from "@/pages/SubCategoryList";
import SuccessPage from "@/pages/SuccessPage";
import VerfiyEmail from "@/pages/VerfiyEmail";
import WishlistPage from "@/pages/WishlistPage";
import { createBrowserRouter } from "react-router-dom";

const profileRoutes = [
  { path: "", element: <ProfilePage /> },
  { path: "order-details", element: <OrderDetailsPage /> },
  { path: "address-details", element: <AddressPage /> },
  { path: "wishlist", element: <WishlistPage /> },
];

const shopRoutes = [
  { path: "", element: <ShopPage PriceRange={[0, 0]} /> },
  { path: ":categoryId", element: <ShopPage PriceRange={[0, 0]} /> },
  {
    path: ":categoryId/:subCategoryId",
    element: <ShopPage PriceRange={[0, 0]} />,
  },
];

const dashboardRoutes = [
  { path: "", element: <DashboardPage /> },
  {
    path: "products",
    element: <ProductList />,
    children: [
      { path: "add-product", element: <ProductList /> },
      { path: "edit-product/:id", element: <ProductList /> },
    ],
  },
  {
    path: "category",
    element: <CategoryList />,
    children: [
      { path: "add-category", element: <CategoryList /> },
      { path: "edit-category/:id", element: <CategoryList /> },
    ],
  },
  {
    path: "sub-category",
    element: <SubCategoryList />,
    children: [
      { path: "add-sub-category", element: <SubCategoryList /> },
      { path: "edit-sub-category/:id", element: <SubCategoryList /> },
    ],
  },
  { path: "orders", element: <Orders /> },
  { path: "customers", element: <Customers /> },
];

const authRoutes = [
  { path: "login", element: <Login /> },
  { path: "forgot-password", element: <ForgotPassword /> },
  { path: "register", element: <Register /> },
  { path: "verify-forgot-password-otp", element: <OtpVerification /> },
];

const router = createBrowserRouter(
  [
    {
      path: "",
      element: <App />, // Layout wraps all pages
      children: [
        { path: "", element: <Home /> },
        { path: "search", element: <SearchPage /> },
        { path: "checkout", element: <CheckoutPage /> },
        { path: "success", element: <SuccessPage /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "product/:id", element: <ProductPage /> },
        {
          path: "profile-page",
          element: <Profile />,
          children: profileRoutes,
        },
        {
          path: "shop",
          element: <Shop />,
          children: shopRoutes,
        },
      ],
    },
    {
      path: "dashboard-page",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: dashboardRoutes,
    },
    {
      path: "verify-email",
      element: <VerfiyEmail />,
    },
    {
      path: "",
      element: <AuthLayout />,
      children: authRoutes,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export default router;
