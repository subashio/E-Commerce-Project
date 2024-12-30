import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AlignLeft, MapPin, ShoppingBag, User } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

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
export default function ProfileHeader() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <section className="relative mt-4 w-full rounded-lg bg-secondary/5 py-4 lg:my-0 lg:bg-transparent lg:py-0">
      <div className="flex w-full items-center justify-between lg:hidden">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <div className="group relative flex items-center gap-2">
              <AlignLeft className="ml-4 h-5 w-5 cursor-pointer" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <nav className="mt-3 grid gap-2 px-4 text-lg font-medium">
              <p className="text-md mb-4 border-b py-4 font-semibold">
                Account Settings
              </p>
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
        <h1 className="mr-4 px-2 text-lg font-semibold">Account Settings</h1>
      </div>
    </section>
  );
}
