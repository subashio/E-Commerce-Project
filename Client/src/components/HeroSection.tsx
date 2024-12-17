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

const list = [
  {
    to: "/",
    image: "/slide-f-2.PNG",
    tag: "Advanced Tech for Everyday Life",
    className:
      "  flex flex-col items-start  justify-center gap-y-4    w-full sm:gap-y-6 md:bg-secondary/0  text-secondary",
    title: "Experience Superior Sound and Style",
    description: "Premium comfort. Powerful audio.",
  },
  {
    to: "/",
    image: "/slide-2-f.png",
    tag: "Stay Connected, Stay Ahead",
    title: "Latest Smartphones at Your Fingertips",
    className:
      "  flex flex-col items-start justify-center gap-y-4    w-full  sm:gap-y-6 md:bg-secondary/0  text-secondary",
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
    <MaxWidthWrapper className="mt-10">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="relative"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="my-2 ml-1 flex h-[30vh] gap-2 !rounded-xl sm:h-[60vh]">
          {list.map((_item, index) => (
            <CarouselItem
              className="relative flex items-center justify-center rounded-lg bg-cover bg-left bg-no-repeat"
              style={{ backgroundImage: `url(${_item.image})` }}
              key={index}
            >
              {/* <div> */}
              <MaxWidthWrapper className={cn("sm:px-10", _item.className)}>
                <Badge className="bg-amber-600 px-2 pb-1.5 hover:bg-amber-600">
                  {_item.tag}
                </Badge>
                <h1 className="font-semibold sm:max-w-xl sm:text-5xl">
                  {_item.title}
                </h1>
                <p className="max-w-sm text-sm text-[#153d11] sm:text-sm md:text-sm">
                  {_item.description}
                </p>
                <Link
                  className="group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-secondary px-4 text-center text-sm font-medium text-primary-foreground transition-all duration-500 hover:border-secondary hover:bg-white hover:text-black"
                  to={_item.to}
                >
                  Show Now
                  <MoveRight className="w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
              </MaxWidthWrapper>
              {/* </div> */}
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
                  ? "scale-x-[1.8] rounded-sm fill-accent"
                  : "rounded-full border fill-secondary/50",
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

{
  /* <div className="absolute z-10 mt-4 flex w-full items-end justify-end gap-4 px-2 md:my-60 md:items-center md:justify-between lg:items-center">
          <ChevronLeft
            onClick={() => api && api.scrollPrev()}
            className="h-16 w-16 cursor-pointer rounded-full bg-primary/20 p-4 text-white"
          />
          <ChevronRight
            onClick={() => api && api.scrollNext()}
            className="h-16 w-16 cursor-pointer rounded-full bg-primary/20 p-4 text-white"
          />
        </div> */
}
