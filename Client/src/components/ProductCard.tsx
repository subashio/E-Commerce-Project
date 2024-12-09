import { useCart } from "@/hooks/useCart";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import Axios from "@/lib/Axios";
import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { Badge } from "./ui/badge";

interface ProductCartProps {
  _id: string;
  name: string;
  image: string;
  category: string | undefined;
  discount: number | undefined;
  price: number;
  salePrice: number;
}
export default function ProductCard({
  _id,
  name,
  category,
  image,
  price,
  discount,
  salePrice,
}: ProductCartProps) {
  const { addToCart } = useCart();

  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );
  const categoryLookup = new Map(
    categoryList.map((category: { _id: string; name: string }) => [
      category._id,
      category.name,
    ]),
  );

  return (
    <Link to="/" className=" ">
      <Card className="relative mt-6 p-4">
        <Badge className="absolute right-3 top-3 bg-red-600 px-4 hover:bg-red-500">
          {discount}%
        </Badge>
        <img src={image} className="mx-auto h-32 w-32" />
        <div className="mt-4 flex flex-col items-center justify-between gap-2">
          <div>
            <h1 className="text-xs">{category}</h1>
            <h1 className="text-md font-bold">{name}</h1>
          </div>
          <p className="flex gap-1.5">
            ₹{price}
            <del className="text-secondary/50 dark:text-secondary-foreground/50">
              ₹{salePrice}
            </del>
          </p>
        </div>
        <div className="mt-4 flex w-full flex-col items-center gap-2">
          {/* <p className="flex flex-col gap-1.5">
           ₹{price}
            <del className="text-secondary/50 dark:text-secondary-foreground/50">
             ₹{salePrice}
            </del>
          </p> */}
          {/* 
          <Button size="sm" onClick={() => AddtoCart()}>
            Add
            <Plus />
          </Button>
          <div className="flex items-center">
            <Minus className="h-7 w-7 p-2" />

            <p className="border px-3 py-1 text-sm font-medium">1</p>
            <Plus className="h-7 w-7 p-2" />
          </div> */}
          <Button className="w-full">Buy Now</Button>
          <AddToCartButton id={_id} />
        </div>
      </Card>
    </Link>
  );
}
