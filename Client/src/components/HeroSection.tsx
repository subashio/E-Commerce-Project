import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, MoveRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Badge } from "./ui/badge";

const list = [
  {
    to: "/",
    image: "/slide-1.png",
    tag: "Advanced Tech for Everyday Life",
    className:
      "mx-10  flex flex-col items-start  justify-center gap-y-4 rounded-sm p-5 md:m-0 h-full w-full md:gap-y-6 md:bg-secondary/0 md:px-14 text-accent",
    title: "Experience Superior Sound and Style",
    description: "Premium comfort. Powerful audio.",
  },
  {
    to: "/",
    image: "/slide-2.png",
    tag: "Stay Connected, Stay Ahead",
    title: "Latest Smartphones at Your Fingertips",
    className:
      "mx-10   flex flex-col items-start justify-center gap-y-4 rounded-sm  p-5 md:m-0 h-full w-full  md:gap-y-6 md:bg-secondary/0 md:px-14 text-accent",
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
    <MaxWidthWrapper className="mt-20">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="relative max-w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <div className="absolute z-10 mx-auto flex h-full w-full items-center justify-end gap-4 px-2 pb-4 md:items-center md:justify-between md:px-2 lg:px-20">
          <ArrowLeft
            onClick={() => api && api.scrollPrev()}
            className="h-16 w-16 cursor-pointer rounded-full bg-primary/20 p-4"
          />
          <ArrowRight
            onClick={() => api && api.scrollNext()}
            className="h-16 w-16 cursor-pointer rounded-full bg-primary/20 p-4"
          />
        </div>
        <CarouselContent className="">
          {list.map((_item, index) => (
            <CarouselItem key={index}>
              <div
                className="relative flex h-[40vh] flex-col place-items-center rounded-lg bg-cover bg-center bg-no-repeat pb-20 sm:h-[73vh]"
                style={{ backgroundImage: `url(${_item.image})` }}
              >
                <div className={cn("max-w-screen-lg", _item.className)}>
                  <Badge className="mr-auto bg-amber-600 px-2 pb-1.5 hover:bg-amber-600">
                    {_item.tag}
                  </Badge>
                  <h1 className="font-semibold sm:max-w-xl sm:text-6xl">
                    {_item.title}
                  </h1>
                  <p className="max-w-sm text-sm text-[#bbecb6] sm:text-sm md:text-sm">
                    {_item.description}
                  </p>
                  <Link
                    className="group inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap !rounded-md border-[1px] border-[#052702] px-4 py-2 text-sm transition-all duration-300 hover:bg-secondary"
                    to={_item.to}
                  >
                    Show Now
                    <MoveRight className="transition-all duration-300 group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 z-30 mx-auto flex w-full justify-center gap-2 md:bg-secondary/0">
          {Array.from({ length: count }).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "h-3 w-3 cursor-pointer transition-colors",
                current === index
                  ? "scale-x-150 rounded-sm fill-secondary"
                  : "fill-gray-100",
              )}
              viewBox="0 0 24 24"
              onClick={() => handleDotClick(index)}
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          ))}
        </div>
      </Carousel>
    </MaxWidthWrapper>
  );
}
