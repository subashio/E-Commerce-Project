import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

//
export default function ProductCard({
  _id,
  name,
  category,
  image,
  price,
  discount,
  salePrice,
}: ProductCartProps) {
  return (
    <Link to={`/shop/product/${_id}`} className=" ">
      <Card className="group relative mt-6 border-none p-4 hover:shadow-2xl">
        <Badge className="absolute right-3 top-3 bg-red-600 px-4 hover:bg-red-500">
          {discount}%
        </Badge>
        <img src={image} className="mx-auto h-32 w-32" />
        <div className="mt-4 flex flex-col items-start justify-between gap-2">
          <div>
            <h1 className="flex gap-1.5 text-xs">
              {category}
              <span className="text-xs font-normal text-destructive">
                stock
              </span>
            </h1>
            <h1 className="text-md max-w-44 truncate font-semibold">{name}</h1>
          </div>
        </div>
        <div className="mt-4 flex w-full items-center justify-between gap-2">
          <p className="flex w-full flex-col font-bold">
            ₹{price}
            <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
              ₹{salePrice}
            </del>
          </p>
          <AddToCartButton id={_id} />
        </div>
      </Card>
    </Link>
  );
}
