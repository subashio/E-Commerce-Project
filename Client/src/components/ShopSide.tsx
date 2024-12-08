import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ShopSide() {
  const location = useLocation();
  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );

  return (
    <aside className="hidden max-h-screen w-full flex-col gap-2 md:flex">
      <div className=" ">
        <nav className="text-lg font-medium">
          <div className="flex w-full flex-col px-2.5">
            <p className="p-4 text-sm text-secondary/70">Categories </p>
            {categoryList.map((item, index) => (
              <Link
                key={index}
                to={`/shop/${item._id}`}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                  location.pathname === `/shop/${item._id}`
                    ? "bg-primary/20"
                    : "hover:bg-accent",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </aside>
  );
}
