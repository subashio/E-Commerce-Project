import { RootState } from "@/store/store";
import { ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const productList = useSelector(
    (state: RootState) => state.product.productList,
  );
  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );

  // const CartList = useSelector((state: RootState) => state.product.cartList);
  // const [cartState, setCartState] = React.useState<Record<string, boolean>>({});

  const categoryLookup = new Map(
    categoryList.map((category: { _id: string; name: string }) => [
      category._id,
      category.name,
    ]),
  );

  const products = productList.map((product: any) => ({
    _id: product._id,
    name: product.name,
    to: "/",
    image: product.image[0] || "default.jpg",
    category: categoryLookup.get(product.categoryId), // Look
    price: product.price,
    salePrice: product.salePrice,
  }));

  return (
    <MaxWidthWrapper className="my-10 flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Best Sellers</h1>
        <Link
          to="/"
          className="group flex items-center gap-1 rounded-full bg-primary/20 px-4 md:mt-2"
        >
          See More{" "}
          <ArrowRight className="h-10 w-10 rounded-full p-2.5 transition-all duration-300 group-hover:translate-x-2" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((item, index) => (
          <ProductCard
            _id={item._id}
            key={index}
            category={item.category}
            name={item.name}
            image={item.image}
            price={item.price}
            salePrice={item.salePrice}
          />
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
