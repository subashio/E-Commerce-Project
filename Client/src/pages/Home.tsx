import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCarousel from "@/components/ProductCarousel";
import { Badge } from "@/components/ui/badge";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import { MoveRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const banners = [
  {
    title: "Unlock the Best Deals on Smartphones",
    offer: "Get Upto 20% offer",
    to: "/shop",
    image: "/banner.jpeg",
  },
];
const banner2 = [
  {
    title: "",
    offer: "Banner",
    to: "/product/67696151620088e9f001e1f9",
    image: "/ban2.png",
  },
  {
    title: "",
    offer: "Banner",
    to: "/product/6769689f620088e9f001e783",
    image: "/ban1.png",
  },
];

export default function Home() {
  const viewedProduct = useSelector(
    (state: RootState) => state.product?.viewedProduct || [],
  );
  const product = useSelector(
    (state: RootState) => state.product.product || [],
  );
  const user = useSelector((state: RootState) => state.user.currentUser);
  const category = useSelector(
    (state: RootState) => state.product.category || [],
  );

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  const calculateDiscountPercentage = (
    listPrice: number,
    salePrice: number,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };

  const products = React.useMemo(() => {
    const categorizedProducts = product
      .filter((product: any) => product !== null && product !== undefined) // Filter out null or undefined entries
      .filter((product: any) => {
        // Check if the user is a wholesaler and filter accordingly
        if (user?.isWholesaler) {
          return product.productType === "wholesale";
        } else {
          return product.productType !== "wholesale";
        }
      })
      .filter((product: any) => {
        // Filter products based on category
        return categoryLookup.has(product.categoryId);
      });

    // Group products by category
    const productsByCategory = categorizedProducts.reduce(
      (acc: any, product: any) => {
        const categoryId = product.categoryId;
        if (!acc[categoryId]) {
          acc[categoryId] = [];
        }
        acc[categoryId].push(product);
        return acc;
      },
      {},
    );

    // Filter categories with at least one product
    return Object.values(productsByCategory)
      .filter((products: any) => products.length > 0)
      .flat()
      .map((product: any) => {
        const discount = calculateDiscountPercentage(
          product.salePrice,
          product.price,
        );

        return {
          _id: product._id,
          name: product.name || "Unknown Product",
          discount: discount > 0 ? `${discount}%` : null,
          to: "/",
          image: product.image || "default.jpg",
          category:
            categoryLookup.get(product.categoryId) || "Unknown Category",
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          wholesalePrice: product.wholesalePrice || 0,
          status: product.status ?? false,
          productType: product.productType,
        };
      });
  }, [product, categoryLookup, user]);

  return (
    <section className="">
      <HeroSection />

      {Array.isArray(viewedProduct) && viewedProduct.length > 0 && (
        <ProductCarousel title="Recently Viewed" viewProduct={viewedProduct} />
      )}
      <CategoriesSection />
      <ProductCarousel title="Best Sellers" />

      <MaxWidthWrapper className="my-20 grid w-full grid-cols-1 gap-10 md:grid-cols-2">
        {banner2.map((_item, _index) => (
          <Link
            to={_item.to}
            key={_index}
            className="flex h-[20vh] w-full flex-col items-center justify-center gap-3 rounded-lg bg-cover bg-left bg-no-repeat lg:h-[25vh]"
            style={{ backgroundImage: `url(${_item.image})` }}
          ></Link>
        ))}
      </MaxWidthWrapper>
      {/* <CategoryWiseProduct /> */}

      {/* Group products by category and render each category once */}
      {Object.entries(
        products.reduce((acc: Record<string, any[]>, product) => {
          if (!acc[product.category]) {
            acc[product.category] = [];
          }
          acc[product.category].push(product);
          return acc;
        }, {}),
      ).map(([category, products]) => (
        <ProductCarousel
          key={category}
          title={category}
          productDataCategory={products}
        />
      ))}

      <MaxWidthWrapper className="my-10 grid w-full grid-flow-row gap-10">
        {banners.map((_item, _index) => (
          <div
            key={_index}
            className="flex h-[24vh] w-full flex-col justify-center gap-3 rounded-lg bg-cover bg-center bg-no-repeat text-end lg:h-[44vh]"
            style={{ backgroundImage: `url(${_item.image})` }}
          >
            <div className="ml-auto flex flex-col items-center gap-2.5 px-2.5 sm:px-5 md:items-start md:px-10">
              <Badge className="mt-8 text-xs font-semibold sm:mt-0">
                {_item.title}
              </Badge>
              <p className="text-2xl font-bold text-secondary sm:text-3xl md:text-4xl lg:text-5xl">
                {_item.offer}
              </p>
              <Link
                className="group mt-2 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-secondary px-4 text-center text-sm font-medium text-primary-foreground transition-all duration-500 hover:border-secondary hover:bg-white hover:text-black"
                to={_item.to}
              >
                Show Now
                <MoveRight className="w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        ))}
      </MaxWidthWrapper>

      {/* <CategoryDisplay name="Mobiles" /> */}
      {/* <BestSellers /> */}
    </section>
  );
}
