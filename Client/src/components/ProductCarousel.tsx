import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import ProductCard from "./ProductCard";

export default function ProductCarousel({
  title,
  viewProduct,
}: {
  title: string;
  viewProduct?: any[];
}) {
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

  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (
    listPrice: number | null | undefined,
    salePrice: number | null | undefined,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };

  const validProducts = (data: any[]) =>
    data.filter((item) => item && typeof item.salePrice === "number");

  const products = React.useMemo(() => {
    const source = viewProduct || product;
    const filteredProducts = validProducts(source);
    if (viewProduct)
      return filteredProducts.map((product: any) => {
        const discount = calculateDiscountPercentage(
          product.salePrice,
          product.price,
        );
        return {
          _id: product._id,
          name: product.name,
          discount: discount > 0 ? `${discount}%` : null,
          to: "/",
          image:
            product.image && product.image[0]
              ? product.image[0]
              : "default.jpg",
          category: categoryLookup.get(product.categoryId),
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          status: product.status ?? false,
        };
      }); // Use external data if provided

    // Default: Map products from Redux
    return product.map((product: any) => {
      const discount = calculateDiscountPercentage(
        product.salePrice,
        product.price,
      );
      return {
        _id: product._id,
        name: product.name,
        discount: discount > 0 ? `${discount}%` : null,
        to: "/",
        image: product.image[0] || "default.jpg",
        category: categoryLookup.get(product.categoryId),
        price: product.price,
        salePrice: product.salePrice,
        status: product.status ?? false,
      };
    });
  }, [product, categoryLookup, viewProduct]);
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
          className="flex items-center gap-3 px-2 py-2 text-xl font-medium md:text-3xl"
        >
          {title}
        </Link>
        <div className="flex gap-2">
          <ChevronLeft
            onClick={handleLeftClick}
            className="h-8 w-8 cursor-pointer rounded-full bg-accent p-1.5 transition-all duration-500 hover:bg-primary/60"
          />
          <ChevronRight
            onClick={handleRightClick}
            className="h-8 w-8 cursor-pointer rounded-full bg-accent p-1.5 transition-all duration-500 hover:bg-primary/60"
            // className="h-10 w-10 cursor-pointer rounded-full bg-primary/20 p-2"
          />
        </div>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full p-2"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-1 flex snap-x snap-mandatory items-center gap-4">
          {products
            ?.filter((item) => item.status === true)
            .map((item, index) => (
              <ProductCard
                discount={item.discount}
                _id={item._id}
                key={index}
                category={item.category}
                name={item.name}
                image={item.image}
                price={item.price}
                salePrice={item.salePrice}
                className="flex-shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-[24%] xl:basis-[19%]"
              />
            ))}
        </CarouselContent>
      </Carousel>
    </MaxWidthWrapper>
  );
}
