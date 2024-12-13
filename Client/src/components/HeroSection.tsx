import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";

const list = [
  {
    to: "/",
    image: "/slide-f-2.PNG",
    tag: "Advanced Tech for Everyday Life",
    className:
      "mx-10 mt-10 flex flex-col items-start justify-center gap-y-4 rounded-sm p-5 md:m-0 h-full w-full md:gap-y-4 md:bg-secondary/0 md:px-14 text-secondary",
    title: "Smartwatch and Smartphone",
    description:
      "Experience seamless connectivity with cutting-edge smartphones and stylish smartwatches.",
  },
  {
    to: "/",
    image: "/slide-1.webp",
    tag: "Stay Connected, Stay Ahead",
    title: "Latest Smartphones at Your Fingertips",
    className:
      "mx-10   flex flex-col items-start justify-center gap-y-4 rounded-sm  p-5 md:m-0 h-full w-full  md:gap-y-4 md:bg-secondary/0 md:px-14 text-secondary",
    description:
      "Explore top-brand mobile phones with unbeatable features and prices. Find your perfect match today.",
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

    // // Set total slide count and listen for slide changes
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
                className="relative mt-10 flex h-[40vh] flex-col place-items-center rounded-lg bg-cover bg-center bg-no-repeat sm:h-[50vh]"
                style={{ backgroundImage: `url(${_item.image})` }}
              >
                <div className={_item.className}>
                  <Badge className="mr-auto bg-amber-600 px-2 pb-1.5 hover:bg-amber-600">
                    {_item.tag}
                  </Badge>
                  <h1 className="max-w-sm text-2xl font-bold sm:max-w-lg sm:text-4xl md:max-w-2xl md:text-5xl">
                    {_item.title}
                  </h1>
                  <p className="sm:text-md max-w-sm text-sm md:text-lg">
                    {_item.description}
                  </p>
                  <Link
                    className={cn(
                      "group flex items-center gap-2 !rounded-md transition-all duration-300",
                      buttonVariants({ variant: "secondary" }),
                    )}
                    to={_item.to}
                  >
                    Show Now
                    <MoveRight className="transition-all duration-300 group-hover:translate-x-2" />
                  </Link>
                </div>
                <div className="absolute bottom-4 z-30 mx-auto flex w-full justify-center gap-2 md:bg-secondary/0">
                  {Array.from({ length: count }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      className={cn(
                        "w-3 cursor-pointer transition-colors",
                        current === index ? "fill-primary" : "fill-gray-400",
                      )}
                      viewBox="0 0 24 24"
                      onClick={() => handleDotClick(index)}
                    >
                      <circle cx="12" cy="12" r="10" />
                    </svg>
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
