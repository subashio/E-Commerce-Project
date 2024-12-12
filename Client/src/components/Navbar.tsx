import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { persist, RootState } from "@/store/store";
import { logout } from "@/store/userSlice";
import {
  AlignRight,
  House,
  LogOut,
  SearchIcon,
  ShoppingBag,
  User,
} from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import MobileNav from "./MobileNav";
import SearchInput from "./SearchInput";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CartSheet from "./CartSheet";

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = user?._id;
  const isAdmin = user.role == "ADMIN";
  const [hideOnScroll, setHideOnScroll] = React.useState(false);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > lastScrollY + 10) {
            setHideOnScroll(true); // User is scrolling down
          } else if (window.scrollY < lastScrollY - 10) {
            setHideOnScroll(false); // User is scrolling up
          }
          lastScrollY = window.scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <header
      className={`sticky top-0 z-50 border-b bg-background transition-all duration-200 ${
        hideOnScroll ? "h-20" : "h-28"
      }`}
    >
      <div
        className={`${
          hideOnScroll ? "h-0 opacity-0" : "h-8 pt-1.5 opacity-100"
        } w-full justify-center bg-primary/20 transition-all duration-300 md:justify-between`}
      >
        <MaxWidthWrapper className="flex items-center justify-center text-sm sm:justify-between">
          <p className="hidden sm:block">Call Us: +91 9288348329</p>
          <p>Super Value Deals - Save more with coupons</p>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="flex items-center gap-16">
        <div className="mb-4 flex w-full flex-row items-center justify-between gap-x-10 gap-y-2">
          <div className="flex w-full items-center justify-between">
            <Link to="/" className="flex items-center py-4">
              <img src="/logo.png" className="w-44" alt="Globo-green logo" />
            </Link>
            <div className="hidden items-center gap-3 md:flex md:w-[400px] lg:w-[550px]">
              <SearchInput />
            </div>

            <div className="flex items-center justify-between gap-2.5">
              <Link
                className="flex items-center gap-2 text-primary md:hidden"
                to="/"
              ></Link>
              <SearchInput
                button={
                  <SearchIcon className="h-10 w-10 p-2 text-primary md:hidden" />
                }
              />

              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Link
                      className="hidden items-center gap-2 text-primary md:flex"
                      to={isLoggedIn ? "/profile-page" : "/login"}
                    >
                      <User className="h-10 w-10 p-2" />
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
              ) : (
                <Link
                  to="/login"
                  className={cn(
                    "!text-md",
                    buttonVariants({ variant: "default" }),
                  )}
                >
                  Login
                </Link>
              )}

              <CartSheet
                button={
                  <button className="relative flex items-center gap-4 text-primary">
                    <ShoppingBag className="h-10 w-10 p-2" />
                    <Badge
                      className="absolute -right-1 -top-0 p-0.5 px-1.5"
                      variant="secondary"
                    >
                      {cartList.length}
                    </Badge>
                  </button>
                }
              />
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}

              <MobileNav button={<AlignRight />} />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
