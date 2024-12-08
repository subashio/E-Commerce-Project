import { cn } from "@/lib/utils";
import { MapPin, ShoppingBag, User } from "lucide-react";
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

export default function Side() {
  const location = useLocation();
  return (
    <aside className="hidden max-h-screen w-full flex-col gap-2 md:flex">
      <div className="my-10 flex-1">
        <nav className="group grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className={cn(
                "mx-2 flex items-center gap-3 rounded-lg p-2 transition-all",
                location.pathname === item.to
                  ? "bg-primary/20"
                  : "hover:bg-accent",
              )}
            >
              {item.logo}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

{
  /* <div className="flex   items-center  ">
        <Link
          to="/profile-page/user-details"
          className="flex items-center px-4 gap-3 font-semibold">
          <Avatar>
            <AvatarImage
              src={user.avatar || "/default-avatar.png"}
              alt="avatar"
            />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <h1 className="flex flex-col">
            Account
            <span className="text-xs flex hover:text-blue-600 items-center  gap-1">
              {user.name}
              <SquareArrowOutUpRight className="w-2.5 h-2.5 mt-0.5" />{" "}
            </span>
          </h1>
        </Link>
      </div> */
}
