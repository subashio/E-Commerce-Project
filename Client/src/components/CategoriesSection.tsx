import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";

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
      to: `/shop/${encodeURIComponent(category.name)}`,
      image: category.image,
      status: category.status,
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
    <section className="py-10">
      <MaxWidthWrapper className="flex flex-col gap-2">
        <h2 className="text-xl font-bold md:text-3xl">Categories</h2>

        <Carousel setApi={setApi} className="w-full">
          <ChevronLeft
            onClick={handleLeftClick}
            className="absolute -left-3 z-10 my-24 h-10 w-10 cursor-pointer rounded-full bg-accent p-1.5 transition-all duration-500 hover:bg-primary/60 md:my-28 lg:-left-3"
          />
          <ChevronRight
            onClick={handleRightClick}
            className="absolute right-0 z-10 my-24 h-10 w-10 cursor-pointer rounded-full bg-accent p-1.5 transition-all duration-500 hover:bg-primary/60 md:my-28 lg:-right-3"
          />
          <CarouselContent className="ml-0 flex w-full">
            {Array.isArray(category) &&
              categories
                ?.filter((item) => item.status === true)
                .map((_item, index) => (
                  <Link
                    to={_item.to}
                    key={index}
                    className="group z-50 flex-shrink-0 basis-1/2 py-4 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex h-[20vh] flex-col items-center justify-center gap-2 rounded-full border-none bg-transparent shadow-none sm:h-[24vh]"
                    >
                      <div className="flex h-32 w-32 items-center rounded-full bg-primary/10 p-2 sm:h-44 sm:w-44">
                        <img
                          src={_item.image}
                          className="mx-auto w-24 lg:w-32"
                        />
                      </div>
                    </motion.div>
                    <p className="text-center text-sm font-bold text-secondary/70 underline-offset-8 group-hover:underline dark:text-secondary-foreground">
                      {_item.name}
                    </p>
                  </Link>
                ))}
          </CarouselContent>
        </Carousel>
      </MaxWidthWrapper>
    </section>
  );
}
