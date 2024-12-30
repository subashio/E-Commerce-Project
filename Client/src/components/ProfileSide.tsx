import { cn } from "@/lib/utils";
import { links } from "@/pages/data/links";
import { Link, useLocation } from "react-router-dom";

export default function ProfileSide() {
  const location = useLocation();
  return (
    <aside className="hidden max-h-screen w-full flex-col gap-2 lg:flex">
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
