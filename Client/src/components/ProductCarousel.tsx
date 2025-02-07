import {
  Carousel,
  CarouselApi,
  CarouselContent,
} from "@/components/ui/carousel";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function ProductCarousel({
  key,
  title,
  viewProduct,
  productDataCategory,
}: {
  title: string;
  key?: any;
  viewProduct?: any[] | undefined;
  productDataCategory?: any[] | undefined;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const product = useSelector(
    (state: RootState) => state.product.product || [],
  );
  const category = useSelector(
    (state: RootState) => state.product.category || [],
  );
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );
  const user = useSelector((state: RootState) => state.user.currentUser);

  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (
    listPrice: number,
    salePrice: number,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };

  const products = React.useMemo(() => {
    // Prioritize productDataCategory if provided
    const source = Array.isArray(productDataCategory)
      ? productDataCategory
      : Array.isArray(viewProduct)
        ? viewProduct
        : product || [];

    return source
      .filter((product: Products) => product !== null && product !== undefined) // Filter out null or undefined entries
      .filter((product: Products) => {
        // Check if the user is a wholesaler and filter accordingly
        if (user?.isWholesaler) {
          return product.productType === "wholesale";
        } else {
          return product.productType !== "wholesale";
        }
      })
      .map((product: any) => {
        const price = user?.isWholesaler
          ? product.wholesalePrice || product.price
          : product.price;
        const discount = calculateDiscountPercentage(product.salePrice, price);

        return {
          _id: product._id,
          name: product.name || "Unknown Product",
          discount: discount > 0 ? `${discount}%` : null,
          to: "/",
          image: product.image[0] || "default.jpg",
          category:
            categoryLookup.get(product.categoryId) || "Unknown Category",
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          wholesalePrice: product.wholesalePrice || 0,
          status: product.status ?? false,
        };
      });
  }, [product, categoryLookup, viewProduct, productDataCategory]);

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
    // <div className="mt-10 flex flex-col bg-secondary/5 py-6">
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mt-10 rounded-2xl py-6"
    >
      <div className="mb-4 flex w-full items-center justify-between">
        <Link
          to="/shop"
          className="flex items-center gap-3 px-2 py-2 text-xl font-bold md:text-3xl"
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
          />
        </div>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full rounded-2xl"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-2 flex snap-x snap-mandatory items-center gap-4">
          {products
            ?.filter((item) => item.status === true)
            .map((item, index) => (
              <ProductCard
                discount={item.discount}
                _id={item._id}
                key={index || key}
                category={item.category}
                name={item.name}
                image={item.image}
                price={item.price ? item.price : item.wholesalePrice}
                salePrice={item.salePrice}
                className={`flex-shrink-0 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-[24%] xl:basis-[19%]`}
              />
            ))}
        </CarouselContent>
      </Carousel>
    </motion.div>
    // </div>
  );
}
