import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  House,
  List,
  ListTree,
  LogOut,
  ShoppingBag,
  ShoppingCartIcon,
  Users,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const dashboardLinks = [
  {
    name: "Products",
    to: "/dashboard-page/products",
    logo: <ShoppingCartIcon className="h-4 w-4" />,
  },
  {
    name: "Category",
    to: "/dashboard-page/category",
    logo: <List className="h-4 w-4" />,
  },
  {
    name: "Sub_Category",
    to: "/dashboard-page/sub-category",
    logo: <ListTree className="h-4 w-4" />,
  },
  {
    name: "Orders",
    to: "/dashboard-page/orders",
    logo: <ShoppingBag className="h-4 w-4" />,
  },
  {
    name: "Customers",
    to: "/dashboard-page/customers",
    logo: <Users className="h-4 w-4" />,
  },
];
export default function DashboardHeader() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <section className="relative w-full">
      <div className="flex w-full items-center justify-between py-3 xl:justify-end xl:border-b">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <AlignLeft className="h-6 w-6 cursor-pointer xl:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="flex !w-72 flex-col p-0">
            <nav className="text-lg font-medium">
              <Link to="/">
                <img src="/logo.png" className="h-20" alt="Shopme-logo" />
              </Link>
              <div className="flex w-full flex-col px-2.5">
                <Link
                  to="/dashboard-page"
                  onClick={() => isSetSheetOpen(false)}
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
                <p className="p-4 text-sm text-secondary/70">
                  Store Managements{" "}
                </p>
                {dashboardLinks.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => isSetSheetOpen(false)}
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
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2.5">
            <DropdownMenuLabel className="text-md">
              Shopme Admin
              <p className="text-xs">subashotherp11@gmail.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="mt-2">
              <Link className="flex w-full items-center gap-2" to="/">
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="mb-3">
              <Link
                className="flex w-full items-center gap-2"
                to="/profile-page"
              >
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                to="/login"
                // onClick={handleLogout}
                className="flex w-full items-center gap-1.5 py-1 text-primary"
              >
                <LogOut /> Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
