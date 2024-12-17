import Breadcrumbs from "@/components/Breadcrumbs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useProduct } from "@/hooks/useProduct";
// import { setViewedProduct } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const product = useSelector((state: RootState) => state.product.product);
  const { id: selectedId } = useParams();
  const category = useSelector((state: RootState) => state.product.category);
  const { createViewiedProducts } = useProduct();
  const categoryLookup = (categoryId: string | undefined) => {
    return category.find((cat) => cat._id === categoryId)?.name;
  };

  const selectedProduct = product.find((product) => {
    return product._id === selectedId;
  });

  const [activeIndex, setActiveIndex] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  try {
    createViewiedProducts(selectedId);
  } catch (error) {
    console.log("errror sending data");
  }

  // React.useEffect(() => {
  //   if (selectedProduct) {

  //   }
  // }, [dispatch, selectedProduct]);

  return (
    <section>
      <Breadcrumbs
        className="mx-auto mt-6 w-full max-w-screen-2xl px-5 lg:px-10"
        path="/shop"
        pathName="Shop /"
        path2={`/shop/${selectedProduct?.categoryId}`}
        pathName2={`${categoryLookup(selectedProduct?.categoryId)} /`}
        finalPathName={selectedProduct?.name}
      />
      <MaxWidthWrapper className="mx-auto grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="group grid w-full md:col-span-2 lg:h-[70vh] lg:grid-cols-[100px_1fr]"
        >
          <ScrollArea
            className="row-start-2 whitespace-nowrap lg:row-auto"
            style={{
              height: "calc(100% - 20px)", // Makes the height dynamic
            }}
          >
            <div className="my-5 flex flex-row gap-2 lg:my-0 lg:flex-col">
              {selectedProduct?.image.map((image, index) => (
                <div
                  key={index}
                  className={`h-20 w-20 cursor-pointer rounded-lg border p-2 ${
                    activeIndex === index ? "border-primary" : "border-gray-300"
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index}`}
                    className="h-full w-full rounded-lg object-contain object-center"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <CarouselContent
            className="mx-auto"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {selectedProduct?.image.map((image, index) => (
              <CarouselItem
                key={index}
                className="!w-full cursor-grab pl-1 active:cursor-grabbing"
              >
                <Card className="p-4">
                  <div className="aspect-square">
                    <img
                      alt="Product image"
                      className="w-full rounded-lg object-contain object-center lg:h-[70vh]"
                      src={image}
                    />
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* </div> */}
        </Carousel>

        <div className="border px-8 py-4 text-start md:col-span-1">
          <div>
            <p>{categoryLookup(selectedProduct?.categoryId)}</p>
            <h1 className="py-2 text-xl font-bold">{selectedProduct?.name} </h1>
          </div>

          <div className="flex flex-col items-start justify-start text-2xl font-bold">
            <p className="text-md ml-2 flex items-center">
              <span className="relative">
                <b className="absolute -left-2 top-1 text-sm font-normal">₹</b>
                {selectedProduct?.price}
              </span>
            </p>
            {selectedProduct?.salePrice && (
              <span className="my-1.5 text-xs font-semibold text-secondary/70">
                M.R.P: <del>₹{selectedProduct.salePrice} </del>
                {/* {selectedProduct?. && (
                  <b className="ml-2 text-primary/90">
                    {selectedProduct?.discount} % OFF
                  </b>
                )} */}
                <b className="ml-2 text-primary/90">20 % OFF</b>
              </span>
            )}
          </div>

          <p>{selectedProduct?.description}</p>
          <div className="flex flex-col gap-3 py-4">
            <Button className="w-full rounded-full">Buy</Button>
            <Button variant="outline" className="rounded-full">
              Add to cart
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
