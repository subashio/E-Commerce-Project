import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishlistButton";

//
export default function ProductCardVariant({
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
      to={`/product/${_id}`}
      className={cn(
        "group relative rounded-lg bg-white sm:hover:shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]",
        className,
      )}
    >
      <div className="flex w-full items-center justify-center gap-2 rounded-lg border-none p-2 shadow-none">
        <div className="relative flex h-[20vh] items-center justify-center rounded-lg p-2">
          <img
            src={image}
            className="mx-auto w-44 object-center duration-300 group-hover:scale-105"
          />
          {/* {discount && (
            <p className="absolute right-3 top-3 rounded-md bg-primary/10 p-1 text-sm">
              {discount}OFF
            </p>
          )} */}
        </div>
        <div className="mt-2 flex w-full items-start justify-between px-2">
          <div className="flex w-full flex-col gap-2">
            <p className="text-md max-w-44 truncate font-semibold">{name}</p>
            <div className="flex w-full flex-col gap-3">
              <p className="flex w-full flex-col font-bold">
                ₹{price}
                <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
                  ₹{salePrice}
                </del>
              </p>

              <AddToCartButton className="h-10" id={_id} />
            </div>
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white p-2 shadow-md group-hover:opacity-100 sm:opacity-0">
            <AddToWishlistButton id={_id} />
            <Eye className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
