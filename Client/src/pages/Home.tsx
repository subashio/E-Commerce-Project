import BestSellers from "@/components/BestSellers";
import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const banners = [
  {
    title: "Vegtables & Fruits",
    offer: " Get Upto 20% offer",
    to: "/",
    image: "/banner-1.png",
  },
  {
    title: "Freshly Baked Buns",
    offer: "Get Upto 20% offer",
    to: "/",
    image: "/banner-2.jpg",
  },
];

export default function Home() {
  return (
    <section className="">
      <HeroSection />
      <CategoriesSection />
      <MaxWidthWrapper className="my-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        {banners.map((_item, _index) => (
          <div
            key={_index}
            className="flex h-[30vh] w-full flex-col justify-center gap-3 rounded-lg bg-center bg-no-repeat px-5 md:px-10"
            style={{ backgroundImage: `url(${_item.image})` }}
          >
            <h1 className="text-4xl font-bold">{_item.title}</h1>
            <p className="text-sm text-secondary/60">{_item.offer}</p>
            <Link
              to={_item.to}
              className={cn(
                "mr-auto",
                buttonVariants({ variant: "secondary" }),
              )}
            >
              Shop Now
            </Link>
          </div>
        ))}
      </MaxWidthWrapper>
      <BestSellers />
    </section>
  );
}
