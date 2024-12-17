import { useUser } from "@/hooks/useUser";
import { RootState } from "@/store/store";
import {
  AlignRight,
  House,
  LogOut,
  SearchIcon,
  ShoppingBag,
  ShoppingCartIcon,
  User,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartSheet from "./CartSheet";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MobileNav from "./MobileNav";
import SearchInput from "./SearchInput";
import { Badge } from "./ui/badge";
// import debounce from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { handleLogout } = useUser();
  const isLoggedIn = user?._id;
  const isAdmin = user.role == "ADMIN";
  const [hideOnScroll, setHideOnScroll] = React.useState(false);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + 20) {
        // Scrolling down
        setHideOnScroll(true);
      } else if (currentScrollY < lastScrollY - 20) {
        // Scrolling up
        setHideOnScroll(false);
      }

      // Update the lastScrollY
      lastScrollY = currentScrollY;
    };

    const throttledHandleScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background shadow-lg transition-all duration-200 ${
        hideOnScroll ? "h-20" : "h-28"
      }`}
    >
      <div
        className={`${
          hideOnScroll ? "h-0 opacity-0" : "h-8 pt-1.5 opacity-100"
        } w-full justify-center bg-green-50 transition-all duration-300 md:justify-between`}
      >
        <MaxWidthWrapper className="flex items-center justify-center text-sm sm:justify-between">
          <p className="hidden sm:block">Call Us: +91 9288348329</p>
          <p>Super Value Deals - Save more with coupons</p>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="flex items-center gap-16 pt-2">
        <div className="flex h-full w-full flex-row items-center justify-evenly gap-x-10 gap-y-2">
          <div className="grid w-full grid-flow-col">
            <Link to="/" className="col-span-1 py-4">
              <img src="/logo.png" className="w-44" alt="Globo-green logo" />
            </Link>
            <div className="col-span-3 hidden items-center gap-3 lg:flex">
              <SearchInput />
            </div>
            <div className="col-span-1 flex items-center justify-end gap-1.5 md:gap-2.5">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Link
                    className="hidden items-center gap-2 text-primary lg:flex"
                    to={isLoggedIn ? "/profile-page" : "/login"}
                  >
                    <User className="h-10 w-10 rounded-full bg-primary/20 p-2" />
                  </Link>
                </DropdownMenuTrigger>
                {isLoggedIn ? (
                  <DropdownMenuContent
                    align="end"
                    className="hidden px-2.5 sm:block"
                  >
                    <DropdownMenuLabel className="text-md">
                      Hi! {user.name}
                      <p className="text-xs">{user.email}</p>
                    </DropdownMenuLabel>
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
                        <User />
                        Profile
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

              <SearchInput
                button={
                  <SearchIcon className="h-10 w-10 rounded-full bg-primary/20 p-2 text-primary lg:hidden" />
                }
              />
              {/* <Link
                to="/profile-page/address-details"
                className="relative flex items-center gap-4 text-primary lg:hidden"
              >
                <MapPin className="h-10 w-10 rounded-full bg-primary/20 p-2" />
              </Link> */}
              <CartSheet
                button={
                  <button className="relative flex items-center gap-4 text-primary">
                    <ShoppingCartIcon className="h-10 w-10 rounded-full bg-primary/20 p-2" />
                    <Badge
                      className="absolute -right-2 -top-1 p-0.5 px-1.5"
                      variant="secondary"
                    >
                      {cartList.length}
                    </Badge>
                  </button>
                }
              />

              <MobileNav button={<AlignRight className="ml-2" />} />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* <DropdownMenu>
            <DropdownMenuTrigger className="h-full border-none">
              <Link
                className="flex h-full items-center gap-2 bg-accent/30 px-5"
                to="/"
                // to={isLoggedIn ? "/profile-page" : "/login"}
              >
                <User className="h-10 w-10 rounded-full bg-accent/40 p-2" />{" "}
                Account <ChevronDown />
              </Link>
            </DropdownMenuTrigger>

            {isLoggedIn ? (
              <DropdownMenuContent
                align="center"
                className="hidden px-2.5 lg:block"
              >
                <DropdownMenuLabel className="text-md">
                  Hi! {user.name}
                  <p className="text-xs">{user.email}</p>
                </DropdownMenuLabel>

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
                    <User />
                    Profile
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
          </DropdownMenu> */}
      {/* </MaxWidthWrapper> */}
      {/* </div> */}
    </header>
  );
}

{
  /* bottom headfer */
}
{
  /* <div className="hidden h-14 gap-2 bg-background lg:flex">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex">
            <Accordion type="single" className="relative w-[250px]" collapsible>
              <AccordionItem className="!border-none" value="item-1 ">
                <AccordionTrigger className="hover:no-underline">
                  <Button
                    className="flex w-full justify-between"
                    variant="secondary"
                  >
                    All Departments
                    <LayoutGrid />
                  </Button>
                </AccordionTrigger>
                <AccordionContent className="absolute top-full -mt-2 flex w-full flex-col rounded-md border bg-white text-foreground">
                  {category?.map((_item, _index) => (
                    <Link
                      key={_index}
                      to="#"
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
            <Navmenu />
          </div> */
}

{
  /* <div
        className={`${
          hideOnScroll ? "h-0 opacity-0" : "h-10 pt-1.5 opacity-100"
        } w-full justify-center bg-green-50 transition-all duration-300 md:justify-between`}
      >
        <MaxWidthWrapper className="flex items-center justify-center text-sm sm:justify-between">
          <p className="hidden sm:block">Call Us: +91 9288348329</p>
          <p>Super Value Deals - Save more with coupons</p>
        </MaxWidthWrapper>
      </div> */
}

{
  /* {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Link
                      className="hidden items-center gap-2 text-primary md:flex"
                      to={isLoggedIn ? "/profile-page" : "/login"}
                    >
                      <User className="h-10 w-10 rounded-full bg-primary/20 p-2" />
                    </Link>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="hidden px-2.5 sm:block"
                  >
                    <DropdownMenuLabel className="text-md">
                      Hi! {user.name}
                      <p className="text-xs">{user.email}</p>
                    </DropdownMenuLabel>
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
                        <User />
                        Profile
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
                </DropdownMenu>
              ) : undefined} */
}
