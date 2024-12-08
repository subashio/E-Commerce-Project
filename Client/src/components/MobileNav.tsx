import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { persist, RootState } from "@/store/store";
import { logout } from "@/store/userSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MobileNav({ button }: { button: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = user._id;
  const isAdmin = user.role === "ADMIN";

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout,
      });

      console.log("Logout", response);
      if (response.data) {
        persist.purge(); // Ensure purge happens first
        dispatch(logout()); // clear the redux store state
        navigate("/login"); // navigate to loginPage}
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}>
      <SheetTrigger>{button}</SheetTrigger>
      <SheetContent className="!w-full pt-0">
        <Link to="/">
          <img src="/logo.png" className="h-20" alt="Shopme-logo" />
        </Link>
        <Separator />
        <h1 className="my-4 w-full px-1 text-2xl font-semibold tracking-wide">
          Hello! {user.name}
        </h1>
        <Accordion type="single" collapsible>
          <AccordionItem className="!border-none" value="item-1 ">
            <AccordionTrigger className="hover:no-underline">
              <Button className="w-full">All categories</Button>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col rounded-md border">
              {categoryList.map((_item, _index) => (
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
              to="/cart"
            >
              Cart
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
