import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { LayoutGrid } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function MobileNav({ button }: { button: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const { handleLogout } = useUser();
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const isLoggedIn = user._id;
  const isAdmin = user.role === "ADMIN";

  return (
    <Sheet open={isSheetOpen} onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}>
      <SheetTrigger className="block md:hidden">{button}</SheetTrigger>
      <SheetContent side="left" className="p-2 pt-0">
        <Link to="/">
          <img
            src="/logo.png"
            className="my-3 ml-2 h-12 w-52"
            alt="Globo-green logo"
          />
        </Link>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem className="!border-none" value="item-1 ">
            <AccordionTrigger className="hover:no-underline">
              <Button className="w-full">
                {" "}
                <LayoutGrid /> All categories
              </Button>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col rounded-md border">
              {category?.map((_item, _index) => (
                <Link
                  key={_index}
                  to="#"
                  onClick={() => setIsSheetOpen(false)}
                  className={cn(
                    "!justify-start",
                    buttonVariants({ variant: "ghost" }),
                  )}
                >
                  {_item.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {isLoggedIn ? (
          <>
            <Link
              to="/profile-page"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                onClick={() => setIsSheetOpen(false)}
                className={cn(
                  "w-full !justify-start",
                  buttonVariants({ variant: "ghost" }),
                )}
                to="/dashboard-page"
              >
                Dashboard
              </Link>
            )}
            <Link
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
              to="/profile-page/order-details"
            >
              Orders
            </Link>

            <Link
              onClick={() => {
                setIsSheetOpen(false);
                handleLogout();
              }}
              to="/login"
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Register
            </Link>
            <Link
              to="/forgot-password"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Forgot your password
            </Link>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
