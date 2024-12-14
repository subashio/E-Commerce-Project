import { cn } from "@/lib/utils";
import { dashboardLinks } from "@/pages/data/links";
import { House } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardSide() {
  const location = useLocation();
  return (
    <aside className="sticky top-0 z-50 hidden max-h-screen w-full flex-col gap-2 border-b bg-background transition-all duration-200 md:flex">
      <div className=" ">
        <nav className="text-lg font-medium">
          <Link to="/" className="">
            <img
              src="/logo.png"
              alt="Globo-green logo"
              className="my-3 ml-6 h-12 w-52"
            />
          </Link>
          <div className="my-8 flex w-full flex-col px-2.5">
            <Link
              to="/dashboard-page"
              className={cn(
                "mb-4 flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                location.pathname === "/dashboard-page"
                  ? "bg-primary/20"
                  : "hover:bg-accent dark:hover:bg-primary/20",
              )}
            >
              <House className="h-4 w-4" />
              Dashboard
            </Link>
            <p className="p-4 text-sm text-secondary/70 dark:text-primary/70">
              Store Managements{" "}
            </p>
            {dashboardLinks.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                  location.pathname === item.to
                    ? "bg-primary/20"
                    : "hover:bg-accent dark:hover:bg-primary/20",
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
