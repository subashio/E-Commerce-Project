import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const isAuthenticated = user?.role === "ADMIN"; // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};
