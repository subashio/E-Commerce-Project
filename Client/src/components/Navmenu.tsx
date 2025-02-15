import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import { Link } from "react-router-dom";

import { brandsData } from "@/constants/details";
import { useUser } from "@/hooks/useUser";
import { RootState } from "@/store/store";
import {
  ChevronRight,
  House,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

export function Navmenu() {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { handleLogout } = useUser();
  const isLoggedIn = user?._id;
  const isAdmin = user?.role == "ADMIN";
  const category = useSelector((state: RootState) => state.product.category);

  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("Mobile Phones");
  return (
    <header className="relative z-20 flex w-full items-center justify-between">
      <NavigationMenu className="">
        <NavigationMenuList className="ml-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="flex justify-between bg-transparent !text-primary-foreground hover:bg-secondary/50">
              Shop By Brands
            </NavigationMenuTrigger>

            <NavigationMenuContent className="absolute left-0 flex !w-[700px] bg-background p-4 shadow-lg">
              {/* Categories (Left Side) */}
              <div className="w-1/3 border-r pr-6">
                <h3 className="mb-2 rounded-2xl px-3 py-2 text-sm font-semibold text-primary">
                  Categories
                </h3>
                <ul className="mt-3 space-y-2">
                  {category
                    .slice() // Avoid mutating original state
                    .sort((a, b) => b._id.localeCompare(a.name))
                    .map((category) => (
                      <li
                        key={category._id}
                        onMouseEnter={() => setSelectedCategory(category.name)} // Hover event
                        className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/10"
                      >
                        {category.name} <ChevronRight className="h-3 w-3" />
                      </li>
                    ))}
                </ul>
              </div>

              {/* Brands (Right Side) */}
              <ScrollArea className="max-h-[400px] w-2/3 overflow-y-auto pl-4">
                <h3 className="mb-2 py-2 text-sm font-semibold text-primary">
                  Brands
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {brandsData[selectedCategory]
                    ?.slice(0, 9)
                    .map((brand, index) => (
                      <Link
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
                    to={`/shopByBrand/${encodeURIComponent(selectedCategory)}`}
                    className="inline-block rounded-md px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    View All Brands
                  </Link>
                </div>
              </ScrollArea>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/" className="bg-transparent">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className:
                    "bg-transparent transition-colors duration-300 hover:bg-secondary/50 hover:text-primary",
                })}
              >
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="">
            <Link to="/" className="bg-transparent">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className:
                    "bg-transparent transition-colors duration-300 hover:bg-primary/10 hover:text-primary",
                })}
              >
                About Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: "bg-transparent",
                })}
              >
                Contact us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="hidden lg:flex">
          {isLoggedIn ? (
            <div className="flex items-center justify-center gap-2.5 rounded-2xl p-2 text-primary-foreground hover:bg-secondary/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt="@shadcn" />
                <AvatarFallback className="text-md">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">Account</span>
            </div>
          ) : (
            <Link
              className="flex items-center gap-2.5 rounded-2xl p-2 text-primary-foreground hover:bg-secondary/50"
              to={isLoggedIn ? "/profile-page" : "/login"}
            >
              <User className="borer h-9 w-9 rounded-full bg-secondary/50 p-2" />{" "}
              <span className="text-md font-semibold">Account</span>
            </Link>
          )}
        </DropdownMenuTrigger>
        {isLoggedIn ? (
          <DropdownMenuContent align="end" className="hidden px-2.5 lg:block">
            <DropdownMenuItem className="">
              <Link
                to="/profile-page"
                className="flex h-full w-full cursor-pointer items-center gap-2"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt="@shadcn" />
                  <AvatarFallback className="text-sm font-medium">
                    {user.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="-mt-1">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {user.name}{" "}
                    {isAdmin && (
                      <span className="text-xs text-primary">Admin</span>
                    )}
                  </p>
                  <p className="text-xs">{user.email}</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem className="mt-1">
                <Link
                  className="flex w-full items-center gap-2 hover:text-primary dark:hover:text-primary-foreground"
                  to="/dashboard-page"
                >
                  <House />
                  Dasboard
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="">
              <Link
                className="flex w-full items-center gap-2 hover:text-primary dark:hover:text-primary-foreground"
                to="/profile-page/order-details"
              >
                <ShoppingBag />
                Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="mb-3">
              <Link
                className="flex w-full items-center gap-2 hover:text-primary dark:hover:text-primary-foreground"
                to="/profile-page"
              >
                <MapPin />
                Address
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="text-secondary" />
            <DropdownMenuItem>
              {isLoggedIn && (
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="flex w-full items-start gap-2 py-1 text-primary"
                >
                  <LogOut /> Logout
                </Link>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : undefined}
      </DropdownMenu>
    </header>
  );
}

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink className="" asChild>
//         <a
//           ref={ref}
//           className={cn(
//              block select-none space-y-1 rounded-md p-3 leading-none text-primary-foreground no-underline outline-none transition-colors hover:bg-secondary/50 focus:bg-accent focus:text-accent-foreground",
//             className,
//           )}
//           {...props}
//         >
//           <div className= text-sm font-medium leading-none">{title}</div>
//           <p className= line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";

// const categories: Category[] = [
//   { id: 1, name: "Mobile Phones" },
//   { id: 2, name: "Mobile Accessories" },
//   { id: 3, name: "Computers & Peripherals" },
//   { id: 4, name: "Spare & Tools" },
//   { id: 5, name: "Home Appliances" },
// ];
