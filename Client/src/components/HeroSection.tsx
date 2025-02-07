"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
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
  // const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (!api) return;

    // // Set total slide count and listen for slide changes
    // setCount(api.scrollSnapList().length);
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
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Determine scroll direction and visibility
      if (scrollY > lastScrollY && scrollY > 100) {
        // Scrolling down
        setIsHidden(true);
      } else if (scrollY < lastScrollY) {
        // Scrolling up
        setIsHidden(false);
      }
      // Add background and shadow when scrolled
      setIsScrolled(scrollY > 50);

      setLastScrollY(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <section className="">
      <motion.div
        initial={{ opacity: 0, y: -150 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={cn(
          "rounded-2xl pb-4 pt-36",

          !isHidden || isScrolled ? "pt-52 lg:pt-56" : "pt-36",
        )}
      >
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="relative !rounded-2xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="ml-1 flex h-[35vh] gap-2 !rounded-2xl sm:h-[52vh]">
            {list.map((_item, index) => (
              <CarouselItem
                className="relative flex items-center justify-center rounded-2xl bg-cover bg-left bg-no-repeat"
                style={{ backgroundImage: `url(${_item.image})` }}
                key={index}
              >
                {/* <div> */}
                <MaxWidthWrapper
                  className={cn("select-none sm:px-10", _item.className)}
                >
                  <Badge className="bg-primary px-2 pb-1.5 hover:bg-primary/90">
                    {_item.tag}
                  </Badge>
                  <h1 className="max-w-[20rem] font-semibold sm:max-w-xl sm:text-5xl">
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
          <div className="absolute -bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {list.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDotClick(idx)}
                className={`h-1 w-2 rounded-full transition-all duration-300 ${
                  current === idx ? "w-4 bg-primary" : "w-2.5 bg-primary/20"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </motion.div>
    </section>
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
