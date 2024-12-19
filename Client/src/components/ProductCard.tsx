import { cn } from "@/lib/utils";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";

//
export default function ProductCard({
  className,
  _id,
  name,
  image,
  price,
  discount,
  salePrice,
}: ProductCartProps) {
  return (
    <Link
      to={`/shop/product/${_id}`}
      className={cn("group relative rounded-lg", className)}
    >
      <div className="w-full rounded-lg border-none p-0 pb-4 shadow-none">
        <div className="relative flex h-[26vh] items-center justify-center rounded-lg bg-gray-50 p-2 sm:hover:shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">
          <img
            src={image}
            className="mx-auto w-36 object-center duration-300 group-hover:scale-105"
          />
          {discount && (
            <p className="absolute bottom-3 left-3 rounded-md bg-primary/10 p-1 text-sm">
              {discount}OFF
            </p>
          )}
        </div>
        <div className="mt-2 flex w-full items-start justify-between px-2">
          <div className="flex w-full flex-col gap-1">
            <p className="text-md max-w-44 truncate font-semibold">{name}</p>
            <div className="flex w-full flex-col gap-2">
              <p className="flex w-full flex-col font-bold">
                ₹{price}
                <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
                  ₹{salePrice}
                </del>
              </p>

              <AddToCartButton id={_id} />
            </div>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white p-2 shadow-md group-hover:opacity-100 sm:opacity-0">
            <Heart className="h-4 w-4 text-primary" />
            <Eye className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
