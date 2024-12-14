import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card } from "./ui/card";

export default function CategoriesSection() {
  const category = useSelector((state: RootState) => state.product.category);

  const categories = category?.map((category) => ({
    name: category.name,
    to: `/shop/${category._id}`,
    image: category.image,
  }));

  return (
    <MaxWidthWrapper className="my-10 flex flex-col gap-4">
      <h1 className="text-center text-3xl font-bold">Shop by Category</h1>

      <div className="grid grid-cols-2 md:grid-cols-4">
        {categories?.map((_item, index) => (
          <div
            key={index}
            className="basis-1/2 p-4 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
          >
            <Link to={_item.to} className="h-full">
              <Card className="flex h-full flex-col items-center justify-center gap-6 border-none p-4 shadow-none">
                <img
                  src={_item.image}
                  className="mx-auto h-28 w-28 sm:h-36 sm:w-36"
                />
                <p className="text-sm font-bold text-secondary/70 dark:text-secondary-foreground">
                  {_item.name}
                </p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
}
