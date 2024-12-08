import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { cn } from "@/lib/utils";
import { persist, RootState } from "@/store/store";
import { logout } from "@/store/userSlice";
import {
  AlignRight,
  House,
  LogOut,
  ShoppingBag,
  ShoppingCartIcon,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartDrawer from "./CartDrawer";
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

export default function Navbar() {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = user?._id;
  const isAdmin = user.role == "ADMIN";

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
    <header className="sticky top-0 z-40 h-40 gap-1 bg-white shadow-md md:h-28">
      <div className="flex h-8 w-full justify-center bg-primary/20 md:justify-between">
        <MaxWidthWrapper className="flex items-center justify-center text-sm">
          <p>Super Value Deals - Save more with coupons</p>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className="mx-auto flex items-center gap-16">
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-x-10 gap-y-2 md:flex-row">
          <div className="flex w-full items-center justify-between">
            <Link to="/">
              <div className="flex items-center">
                <img
                  src="/logo.png"
                  className="h-16 md:h-20"
                  alt="Shopme-logo"
                />
              </div>
            </Link>

            <div className="flex items-center gap-3 md:hidden">
              <Link
                className="flex items-center gap-2 text-primary/50"
                to={isLoggedIn ? "/profile-page" : "/login"}
              >
                <UserRound className="h-10 w-10 rounded-full bg-primary/20 p-2" />
              </Link>

              <CartDrawer
                button={
                  <button className="relative flex items-center gap-4 text-primary/50">
                    <ShoppingCartIcon className="h-10 w-10 rounded-full bg-primary/20 p-2" />
                    <Badge
                      className="absolute -right-2 -top-1 p-0.5 px-1.5"
                      variant="secondary"
                    >
                      0
                    </Badge>
                  </button>
                }
              />

              <MobileNav button={<AlignRight />} />
            </div>
          </div>

          <div className="w-full min-w-[300px]">
            <SearchInput />
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <CartDrawer
              button={
                <button className="relative flex items-center gap-4 text-primary/50">
                  <ShoppingCartIcon className="h-10 w-10 rounded-full bg-primary/20 p-2" />
                  <Badge
                    className="absolute -right-2 -top-1 p-0.5 px-1.5"
                    variant="secondary"
                  >
                    0
                  </Badge>
                </button>
              }
            />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Link
                    className="flex items-center gap-2 text-primary/50"
                    to={isLoggedIn ? "/profile-page" : "/login"}
                  >
                    <UserRound className="h-10 w-10 rounded-full bg-primary/20 p-2" />
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
                        className="flex w-full items-center gap-2 hover:text-secondary/70"
                        to="/dashboard-page"
                      >
                        <House />
                        Dasboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="">
                    <Link
                      className="flex w-full items-center gap-2 hover:text-secondary/70"
                      to="/profile-page/order-details"
                    >
                      <ShoppingBag />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="mb-3">
                    <Link
                      className="flex w-full items-center gap-2 hover:text-secondary/70"
                      to="/profile-page"
                    >
                      <UserRound />
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
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
