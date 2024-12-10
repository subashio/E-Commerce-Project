import BestSellers from "@/components/BestSellers";
import CategoriesSection from "@/components/CategoriesSection";
import HeroSection from "@/components/HeroSection";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const banners = [
  {
    title: "Unlock the Best Deals on Smartphones",
    offer: "Get Upto 20% offer",
    to: "/shop",
    image: "/banner.jpeg",
  },
];

export default function Home() {
  return (
    <section className="">
      <HeroSection />
      <CategoriesSection />
      <MaxWidthWrapper className="grid w-full grid-cols-1">
        {banners.map((_item, _index) => (
          <div
            key={_index}
            className="flex h-[24vh] w-full flex-col justify-center gap-3 rounded-lg bg-cover bg-center bg-no-repeat text-end lg:h-[28vh]"
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
                className={cn(
                  "group mr-auto mt-1.5 flex items-center gap-2 !rounded-sm transition-all duration-300 md:mt-4",
                  buttonVariants({ variant: "secondary" }),
                )}
                to={_item.to}
              >
                Show Now
                <MoveRight className="transition-all duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        ))}
      </MaxWidthWrapper>
      <BestSellers />
    </section>
  );
}
