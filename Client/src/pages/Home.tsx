import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCarousel from "@/components/ProductCarousel";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/store";
import { MoveRight } from "lucide-react";
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
    to: "/shop",
    image: "/default-banner.png",
  },
  {
    title: "",
    offer: "Banner",
    to: "/shop",
    image: "/default-banner.png",
  },
];

export default function Home() {
  const viewedProduct = useSelector(
    (state: RootState) => state.product?.viewedProduct ?? [],
  );

  return (
    <section className="">
      <HeroSection />
      {Array.isArray(viewedProduct) && viewedProduct.length > 0 && (
        <ProductCarousel title="Resently Viewed" viewProduct={viewedProduct} />
      )}
      <ProductCarousel title="Best Sellers" />
      <MaxWidthWrapper className="my-20 grid w-full grid-cols-1 gap-10 md:grid-cols-2">
        {banner2.map((_item, _index) => (
          <div
            key={_index}
            className="flex h-[20vh] w-full flex-col items-center justify-center gap-3 rounded-lg bg-cover bg-center bg-no-repeat lg:h-[25vh]"
            style={{ backgroundImage: `url(${_item.image})` }}
          >
            <div className="flex flex-col items-center gap-2.5 px-2.5 sm:px-5 md:items-start md:px-10">
              {/* <Badge className="mt-8 text-xs font-semibold sm:mt-0">
                {_item.title}
              </Badge> */}
              <p className="text-2xl font-bold text-secondary sm:text-3xl md:text-4xl lg:text-5xl">
                {_item.offer}
              </p>
              {/* <Link
                className="group mt-2 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-secondary px-4 text-center text-sm font-medium text-primary-foreground transition-all duration-500 hover:border-secondary hover:bg-white hover:text-black"
                to={_item.to}
              >
                Show Now
                <MoveRight className="w-4 transition-transform duration-300 group-hover:translate-x-2" />
              </Link> */}
            </div>
          </div>
        ))}
      </MaxWidthWrapper>

      <CategoriesSection />
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
