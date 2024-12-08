import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Filter,
  List,
  ListTree,
  ShoppingBag,
  ShoppingCartIcon,
  Users,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

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
export default function ShopHeader() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <section className="relative ml-auto flex px-10">
      <div className="w-full">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              Filter <Filter />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <nav className="text-lg font-medium">
              <Link to="/">
                <img src="/logo.png" className="h-20" alt="Shopme-logo" />
              </Link>
              <div className="flex w-full flex-col px-2.5">
                <p className="p-4 text-sm text-secondary/70"></p>
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
      </div>
    </section>
  );
}
