import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, ArrowRightCircleIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ title }: { title: string }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const product = useSelector(
    (state: RootState) => state.product?.product || [],
  );
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  const products = product.map((product: any) => ({
    _id: product._id,
    name: product.name,
    discount: product.discount,
    to: "/",
    image: product.image[0] || "default.jpg",
    category: categoryLookup.get(product.categoryId), // Look
    price: product.price,
    salePrice: product.salePrice,
  }));
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
      <div className="flex w-full items-center justify-between">
        <Link
          to="/shop"
          className="group flex items-center gap-3 rounded-full px-2 text-3xl font-bold"
        >
          {title}
          <ArrowRightCircleIcon className="mt-2 -translate-x-5 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
        <div className="flex gap-4">
          <ArrowLeft
            onClick={handleLeftClick}
            className="h-10 w-10 cursor-pointer rounded-full bg-primary/20 p-2"
          />
          <ArrowRight
            onClick={handleRightClick}
            className="h-10 w-10 cursor-pointer rounded-full bg-primary/20 p-2"
          />
        </div>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-1 flex snap-x snap-mandatory items-center py-10">
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
              className="flex-shrink-0 basis-1/2 md:basis-1/3 lg:basis-1/5"
            />
          ))}
        </CarouselContent>
      </Carousel>
    </MaxWidthWrapper>
  );
}
