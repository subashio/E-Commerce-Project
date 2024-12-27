import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function MobileNav({ button }: { button: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { handleLogout } = useUser();
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const isLoggedIn = user?._id;
  const isAdmin = user?.role === "ADMIN";

  return (
    <Sheet open={isSheetOpen} onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}>
      <SheetTrigger className="block lg:hidden">{button}</SheetTrigger>
      <SheetContent
        side="left"
        className={`w-full p-2 pt-6 ${isLoggedIn ? "pt-0" : "pt-6"}`}
      >
        {isLoggedIn && (
          <>
            <div className="p-2">
              <Link
                to="/profile-page"
                className="my-3 flex h-full w-full cursor-pointer items-center gap-2"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt="@shadcn" />
                  <AvatarFallback className="text-sm font-medium">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="-mt-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {user.name}
                    {user.role === "ADMIN" && (
                      <span className="text-xs text-primary">Admin</span>
                    )}
                  </p>
                  <p className="text-xs">{user.email}</p>
                </div>
              </Link>
            </div>
            <Separator />
          </>
        )}
        <Accordion type="single" collapsible>
          <AccordionItem className="!border-none" value="item-1 ">
            <AccordionTrigger className="mt-4 h-10 rounded-lg border bg-primary/20 px-4 py-2 text-sm hover:no-underline">
              All categories
              <ChevronRight className="w-4 shrink-0 text-secondary/50" />
            </AccordionTrigger>
            <AccordionContent className="mt-2 flex flex-col rounded-md">
              {category?.map((_item, _index) => (
                <Link
                  key={_index}
                  to={`/shop/${_item._id}`}
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
              Address
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
