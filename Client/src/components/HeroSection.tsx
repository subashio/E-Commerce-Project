import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { Dot, MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";

const list = [
  {
    to: "/",
    image: "/slide-1.jpg",
    tag: "Fresh & Organic - Direct from Farms",
    title: "Discover the Freshest Produce Today",
    discription:
      "Stock up on fresh fruits and vegetables, sourced daily to ensure quality and taste. Perfect for healthy living!",
  },
  {
    to: "/",
    image: "/slide-2.jpg",
    tag: "Weekly Deals - Up to 20% Off",
    title: "Dairy, Bread, and Eggs Delivered Fresh",
    discription:
      "From farm-fresh milk to artisanal bread, find everything you need to start your day on the right note.",
  },
];

export default function HeroSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    // Set total slide count and listen for slide changes
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index); // Navigate to the respective slide
    }
  };
  return (
    <MaxWidthWrapper className="">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {list.map((_item, index) => (
            <CarouselItem key={index}>
              <div
                className="relative mt-14 h-[40vh] rounded-md bg-cover bg-center bg-no-repeat sm:h-[60vh]"
                style={{ backgroundImage: `url(${_item.image})` }}
              >
                <div className="flex h-full w-full flex-col justify-center gap-y-4 px-5 sm:gap-y-8 md:px-14">
                  <Badge
                    className="mr-auto bg-amber-600 px-2 pb-1.5"
                    variant="outline"
                  >
                    {_item.tag}
                  </Badge>
                  <h1 className="max-w-2xl text-2xl font-bold sm:text-5xl">
                    {_item.title}{" "}
                  </h1>
                  <p className="max-w-md text-sm text-secondary/60 sm:text-lg">
                    {_item.discription}{" "}
                  </p>
                  <Link
                    className={cn(
                      "group mr-auto flex items-center gap-2 transition-all duration-300",
                      buttonVariants({ variant: "secondary" }),
                    )}
                    to={_item.to}
                  >
                    Show Now{" "}
                    <MoveRight className="transition-all duration-300 group-hover:translate-x-2" />
                  </Link>
                </div>
                <div className="absolute bottom-0 z-30 flex w-full justify-center">
                  {Array.from({ length: count }).map((_, index) => (
                    <Dot
                      key={index}
                      className={cn(
                        "h-12 w-12 cursor-pointer transition-colors",
                        current == index ? "text-primary" : "text-gray-400",
                      )}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </MaxWidthWrapper>
  );
}
