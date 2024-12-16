import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { RootState } from "@/store/store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Card } from "./ui/card";

export default function CategoriesSection() {
  const [api, setApi] = React.useState<CarouselApi>();
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const categories = React.useMemo(() => {
    // Sort categories by `_id` or a timestamp (assuming `_id` reflects creation order)
    const sortedCategories = [...category].sort((a, b) => {
      // Adjust the sorting logic based on your database field
      if (a._id < b._id) return -1;
      if (a._id > b._id) return 1;
      return 0;
    });

    return sortedCategories.map((category) => ({
      name: category.name,
      to: `/shop/${category._id}`,
      image: category.image,
    }));
  }, [category]);
  // Handle navigation for the arrows
  const handleRightClick = () => {
    if (api?.canScrollNext()) {
      api.scrollNext();
    }
  };

  const handleLeftClick = () => {
    if (api?.canScrollPrev()) {
      api.scrollPrev();
    }
  };
  React.useEffect(() => {
    if (api) {
      api.reInit({
        align: "start", // Ensures cards align correctly at the start
        containScroll: "trimSnaps",
      });
    }
  }, [api]);

  return (
    <MaxWidthWrapper className="my-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Explore Popular Categories</h1>

      <Carousel setApi={setApi} className="w-full">
        <ArrowLeft
          onClick={handleLeftClick}
          className="absolute z-10 my-28 h-10 w-10 cursor-pointer rounded-full bg-primary/20 p-2 lg:-left-3"
        />
        <ArrowRight
          onClick={handleRightClick}
          className="absolute right-0 z-10 my-28 h-10 w-10 cursor-pointer rounded-full bg-primary/20 p-2 lg:-right-3"
        />
        <CarouselContent className="ml-0 flex w-full">
          {Array.isArray(category) &&
            categories?.map((_item, index) => (
              <Link
                to={_item.to}
                key={index}
                className="group z-50 flex-shrink-0 basis-1/2 py-4 sm:basis-1/3 lg:basis-1/5 xl:basis-1/6"
              >
                <Card className="flex h-[20vh] flex-col items-center justify-center gap-6 rounded-full border-none shadow-none sm:h-[24vh]">
                  <div className="flex h-36 w-36 items-center rounded-full bg-accent p-4 sm:h-44 sm:w-44">
                    <img src={_item.image} className="mx-auto" />
                  </div>
                </Card>
                <p className="mt-6 text-center text-sm font-bold text-secondary/70 underline-offset-8 group-hover:underline dark:text-secondary-foreground">
                  {_item.name}
                </p>
              </Link>
            ))}
        </CarouselContent>
      </Carousel>
    </MaxWidthWrapper>
  );
}
