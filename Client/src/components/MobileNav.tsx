import React, { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { brandsData } from "@/constants/details";

export default function MobileNav({ button }: { button: ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { handleLogout } = useUser();
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const isLoggedIn = user?._id;
  const isAdmin = user?.role === "ADMIN";

  const [selectedCategory, setSelectedCategory] = React.useState<string>("");

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
        {/* Main Accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem className="!border-none" value="item-1">
            <AccordionTrigger className="mt-4 h-10 rounded-lg border bg-primary/20 px-4 py-2 text-sm hover:no-underline">
              All Categories
              <ChevronRight className="w-4 shrink-0 text-secondary/50" />
            </AccordionTrigger>
            <AccordionContent className="mt-2 flex flex-col rounded-md">
              {category?.map((_item, _index) => (
                <Link
                  key={_index}
                  to={`/shop/${_item.name}`}
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

        {/* Shop By Brand Accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem className="!border-none" value="item-2">
            <AccordionTrigger className="mt-2 h-10 rounded-lg border bg-secondary/20 px-4 py-2 text-sm hover:no-underline">
              Shop By Brand
              <ChevronRight className="w-4 shrink-0 text-secondary/50" />
            </AccordionTrigger>
            <AccordionContent className="mt-2 flex flex-col rounded-md">
              {category
                .slice() // Avoid mutating original state
                .sort((a, b) => b._id.localeCompare(a.name))
                ?.map((category, _index) => (
                  <div key={category._id}>
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`item-${category._id}`}>
                        <AccordionTrigger
                          onClick={() => setSelectedCategory(category.name)} // Optional: For click event
                          className="flex cursor-pointer items-center justify-between rounded-md p-3 text-sm font-medium hover:bg-primary/10 hover:no-underline"
                        >
                          {category.name} <ChevronRight className="h-3 w-3" />
                        </AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea className="max-h-[400px] w-full overflow-y-auto pl-4">
                            <h3 className="mb-2 py-2 text-sm font-semibold text-primary">
                              Brands
                            </h3>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                              {brandsData[selectedCategory]
                                ?.slice(0, 9)
                                .map((brand, index) => (
                                  <Link
                                    onClick={() => setIsSheetOpen(false)}
                                    to={`/shopByBrand/${encodeURIComponent(selectedCategory)}/${encodeURIComponent(brand.name)}`}
                                    key={index}
                                    className="flex items-center gap-2 rounded-lg border p-3 shadow-sm hover:shadow-md hover:shadow-primary/10"
                                  >
                                    <img
                                      src={brand.logo}
                                      alt={brand.name}
                                      className="h-8 w-8 object-contain"
                                    />
                                    <span className="text-sm font-medium">
                                      {brand.name}
                                    </span>
                                  </Link>
                                ))}
                            </div>

                            {/* View More Button */}
                            <div className="mt-4 text-center">
                              <Link
                                onClick={() => setIsSheetOpen(false)}
                                to={`/shopByBrand/${encodeURIComponent(selectedCategory)}`}
                                className="inline-block rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                              >
                                View All Brands
                              </Link>
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* User and Admin links */}
        {isLoggedIn ? (
          <>
            <Link
              to="/"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "mt-2 w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Home
            </Link>
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
              to="/"
              onClick={() => setIsSheetOpen(false)}
              className={cn(
                "w-full !justify-start",
                buttonVariants({ variant: "ghost" }),
              )}
            >
              Home
            </Link>
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
