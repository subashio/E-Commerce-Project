// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { createLookup } from "@/lib/lookUpMap";
// import { RootState } from "@/store/store";
// import React from "react";
// import { useSelector } from "react-redux";
// import MaxWidthWrapper from "./MaxWidthWrapper";
// import ProductCardVariant from "./ProductCardVariant";

// export default function CategoryWiseProduct() {
//   const product = useSelector(
//     (state: RootState) => state.product.product || [],
//   );
//   const category = useSelector(
//     (state: RootState) => state.product.category || [],
//   );

//   const categoryTypes = [
//     { label: "Mobile ", value: "Mobile " },
//     { label: "Tablets", value: "Tablets" },
//     { label: "Laptops", value: "Laptops" },
//     { label: "Desktops", value: "Desktops" },
//   ];

//   const categoryLookup = React.useMemo(
//     () => createLookup(category, "_id", "name"),
//     [category],
//   );
//   const user = useSelector((state: RootState) => state.user.currentUser);

//   // Helper function to calculate discount percentage
//   const calculateDiscountPercentage = (
//     listPrice: number,
//     salePrice: number,
//   ): number => {
//     if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
//     return Math.round(((listPrice - salePrice) / listPrice) * 100);
//   };
//   const products = React.useMemo(() => {
//     return product
//       .filter((product: any) => product !== null && product !== undefined) // Filter out null or undefined entries
//       .filter((product: any) => {
//         // Check if the user is a wholesaler and filter accordingly
//         if (user?.isWholesaler) {
//           return product.productType === "wholesale";
//         } else {
//           return product.productType !== "wholesale";
//         }
//       })
//       .map((product: any) => {
//         const discount = calculateDiscountPercentage(
//           product.salePrice,
//           product.price,
//         );

//         return {
//           _id: product._id,
//           name: product.name || "Unknown Product",
//           discount: discount > 0 ? `${discount}%` : null,
//           to: "/",
//           image: product.image?.[0] || "default.jpg",
//           category:
//             categoryLookup.get(product.categoryId) || "Unknown Category",
//           price: product.price || 0,
//           salePrice: product.salePrice || 0,
//           wholesalePrice: product.wholesalePrice || 0,
//           status: product.status ?? false,
//         };
//       });
//   }, [product, categoryLookup, user]);
//   return (
//     <div className="rounded-lg md:p-6">
//       <MaxWidthWrapper className="w-full">
//         <h1 className="flex items-center gap-3 px-2 py-2 text-xl font-medium md:text-3xl">
//           Recommended for you
//         </h1>

//         <Tabs defaultValue="account" className="my-4 w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-transparent pl-2 md:grid-cols-10">
//             {categoryTypes.map((item, index) => (
//               <TabsTrigger
//                 className="bg-transparent text-sm"
//                 value={item.label}
//               >
//                 {item.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//           <TabsContent
//             value="Mobile "
//             className="mt-6 grid gap-4 sm:grid-cols-2 md:p-6 lg:grid-cols-3"
//           >
//             {products
//               ?.filter((item) => item.status === true)
//               .slice(0, 6)
//               .map((item, index) => (
//                 <ProductCardVariant
//                   discount={item.discount}
//                   _id={item._id}
//                   key={index}
//                   category={item.category}
//                   name={item.name}
//                   image={item.image}
//                   price={user?.isWholesaler ? item.wholesalePrice : item.price}
//                   salePrice={item.salePrice}
//                   //   className="flex-shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-[24%]"
//                 />
//               ))}
//           </TabsContent>
//         </Tabs>
//       </MaxWidthWrapper>
//     </div>
//   );
// }

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { brandsData, LookingFor } from "@/constants/details";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function CategoryWiseProduct({
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

  React.useEffect(() => {
    if (api) {
      api.reInit({
        align: "start", // Ensures cards align correctly at the start
        containScroll: "trimSnaps",
      });
    }
  }, [api]);

  return (
    <section className="my-10 flex w-full flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <Link
          to={`/shop/${encodeURIComponent(title)}`}
          className="flex items-center gap-3 px-2 py-2 text-xl font-bold md:text-3xl"
        >
          {title}
        </Link>
        <button className="flex items-center justify-center rounded-lg bg-secondary/5 px-2 py-1 text-sm text-secondary">
          View All <ChevronRight className="ml-1 w-4" />
        </button>
      </div>
      <div className="w-full rounded-2xl bg-primary/5 p-4 lg:p-6">
        {/* Top Brands & Categories */}
        <section className="mb-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Top Brands</h2>
            <Link
              to={`/shopByBrand/${encodeURIComponent(title)}`}
              className="flex items-center justify-center rounded-xl bg-secondary/5 px-2 py-1 text-sm text-primary"
            >
              View All <ChevronRight className="ml-1 w-4" />
            </Link>
          </div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-1 active:cursor-grabbing">
              {brandsData[title]?.slice(0, 9).map((brand, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/4 select-none place-content-center py-2 pl-1 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-[11%]"
                >
                  <motion.a
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1, delay: index * 0.1 }}
                    href={`/shopByBrand/${encodeURIComponent(title)}/${encodeURIComponent(brand.name)}`}
                    className="flex h-16 w-16 items-center rounded-xl bg-white text-center shadow-md hover:cursor-pointer sm:h-24 sm:w-28"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="mx-auto w-12 object-contain sm:w-20"
                    />
                    {/* <p className="mt-2 text-sm">{brand.name}</p> */}
                  </motion.a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        {/* Highlighted Categories */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="my-10"
        >
          <h2 className="mb-8 text-xl font-bold">What are you looking for?</h2>
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent className="-ml-1 active:cursor-grabbing sm:mr-1">
              {LookingFor[title]?.slice(0, 9).map((item, index) => (
                <CarouselItem
                  key={index}
                  className={`mx-2 basis-[80%] select-none pl-1 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4`}
                >
                  <div
                    className={`p-4 ${item.className} flex h-[20vh] items-center justify-between gap-1 rounded-3xl`}
                  >
                    <div className="flex h-full flex-col justify-between gap-4 py-4">
                      <p className="max-w-36 text-start text-lg font-bold text-secondary sm:text-xl">
                        {item.title}
                      </p>
                      <Link to={`/search?q=${encodeURIComponent(item.title)}`}>
                        <ChevronRight className="h-9 w-9 rounded-full bg-white p-1.5 font-bold" />{" "}
                      </Link>
                    </div>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="mr-4 h-full w-24 object-contain sm:h-full sm:w-24"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.section>

        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full p-2"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <h2 className="mb-6 text-xl font-bold">Related Products</h2>
          <CarouselContent className="ml-1 flex snap-x snap-mandatory items-center gap-4">
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
      </div>
    </section>
  );
}
