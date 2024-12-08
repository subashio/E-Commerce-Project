import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AlignRight, MapPin, ShoppingBag, User } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const links = [
  {
    name: "My Profile",
    to: "/profile-page",
    logo: <User className="h-5 w-5" />,
  },
  {
    name: "Orders",
    to: "/profile-page/order-details",
    logo: <ShoppingBag className="h-5 w-5" />,
  },
  {
    name: "Address",
    to: "/profile-page/address-details",
    logo: <MapPin className="h-5 w-5" />,
  },
];
export default function Header() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <section className="relative mt-2 w-full">
      <div className="flex w-full items-center justify-between md:hidden">
        <h1 className="px-4 text-xl font-semibold">Account Setting</h1>
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <AlignRight className="h-7 w-7 cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left" className="flex !w-full flex-col p-0">
            <nav className="mx-10 mt-3 grid gap-2 text-lg font-medium">
              <h1 className="mb-4 border-b py-4 text-xl font-semibold">
                Account Settings
              </h1>
              {links.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => isSetSheetOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-2 transition-all",
                    location.pathname === item.to
                      ? "bg-primary/50"
                      : "hover:bg-accent",
                  )}
                >
                  {item.logo}
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
