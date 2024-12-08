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

interface ProductCartProps {
  _id: string;
  name: string;
  image: string;
  category: string | undefined;
  price: number;
  salePrice: number;
}
export default function ProductCard({
  _id,
  name,
  category,
  image,
  price,
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
      <Card className="mt-6 p-4">
        <img src={image} className="mx-auto h-32 w-32" />
        <div className="mt-4">
          <h1 className="text-xs">{category}</h1>
          <h1 className="text-md font-bold">{name}</h1>
        </div>
        <div className="mt-4 flex w-full items-center justify-between">
          <p className="flex flex-col gap-1.5">
            ${price}
            <del className="text-secondary/50">${salePrice}</del>
          </p>
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
          <AddToCartButton id={_id} />
        </div>
      </Card>
    </Link>
  );
}
