import { RootState } from "@/store/store";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const product = useSelector((state: RootState) => state.product.product);
  const category = useSelector((state: RootState) => state.product.category);

  const categoryLookup = new Map(
    category?.map((category: { _id: string; name: string }) => [
      category._id,
      category.name,
    ]),
  );

  const products = product?.map((product: any) => ({
    _id: product._id,
    name: product.name,
    discount: product.discount,
    to: "/",
    image: product.image[0] || "default.jpg",
    category: categoryLookup.get(product.categoryId) || "Unknown Category", // Look
    price: product.price,
    salePrice: product.salePrice,
  }));

  return (
    <MaxWidthWrapper className="my-10 flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Popular Products</h1>
        <Link
          to="/shop"
          className="group flex items-center rounded-full bg-primary/20 px-4 font-semibold text-secondary/80 dark:text-secondary-foreground md:mt-2"
        >
          See More
          <ArrowRight className="h-10 w-10 rounded-full p-2.5 transition-all duration-300 group-hover:translate-x-2" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products?.map((item, index) => (
          <ProductCard
            discount={item.discount}
            _id={item._id}
            key={index}
            category={item.category}
            name={item.name}
            image={item.image}
            price={item.price}
            salePrice={item.salePrice}
            className="!border"
          />
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
