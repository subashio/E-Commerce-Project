import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

//
export default function ProductCard({
  className,
  _id,
  name,
  category,
  image,
  price,
  discount,
  salePrice,
}: ProductCartProps) {
  return (
    <Link
      to={`/shop/product/${_id}`}
      className={cn("group relative rounded-lg border", className)}
    >
      <Card className="border-none p-0 shadow-none">
        <Badge className="absolute right-3 top-3 hidden bg-red-600 px-4 hover:bg-red-500">
          {discount}%
        </Badge>
        <div className="flex h-[30vh] w-full items-center justify-center rounded-lg bg-gray-50 p-20">
          <img src={image} className="mx-auto object-center" />
        </div>
        {/* <div className="w-ful mt-4 flex flex-col justify-between gap-2 px-2"> */}
        <div className="mt-2 flex w-full items-start justify-between px-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-md max-w-44 truncate font-semibold">{name}</p>
            <p className="flex gap-2 text-xs">
              {category}
              <span className="text-xs font-normal text-destructive">
                stock
              </span>
            </p>
          </div>
          {discount && (
            <p className="rounded-md bg-primary/10 p-1 text-sm">
              {discount}OFF
            </p>
          )}
        </div>
        {/* </div> */}

        <div className="flex w-full items-center justify-between gap-2 p-4">
          <p className="flex flex-col font-bold">
            ₹{price}
            <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
              ₹{salePrice}
            </del>
          </p>
          <div className="flex items-center gap-2">
            <Button className="mr-auto h-8 gap-1 p-2">Buy Now</Button>
            <AddToCartButton id={_id} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
