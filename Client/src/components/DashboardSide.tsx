import { cn } from "@/lib/utils";
import { House } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { dashboardLinks } from "./DashboardHeder";

export default function DashboardSide() {
  const location = useLocation();
  return (
    <aside className="hidden max-h-screen w-full flex-col gap-2 md:flex">
      <div className=" ">
        <nav className="text-lg font-medium">
          <Link to="/">
            <img src="/logo.png" className="h-20" alt="Shopme-logo" />
          </Link>
          <div className="flex w-full flex-col px-2.5">
            <Link
              to="/dashboard-page"
              className={cn(
                "mb-4 flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                location.pathname === "/dashboard-page"
                  ? "bg-primary/20"
                  : "hover:bg-accent",
              )}
            >
              <House className="h-4 w-4" />
              Dashboard
            </Link>
            <p className="p-4 text-sm text-secondary/70">Store Managements </p>
            {dashboardLinks.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                  location.pathname === item.to
                    ? "bg-primary/20"
                    : "hover:bg-accent",
                )}
              >
                {item.logo}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
