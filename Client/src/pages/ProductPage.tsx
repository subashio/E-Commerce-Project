import AddToCartButton from "@/components/AddToCartButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useProduct } from "@/hooks/useProduct";
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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );
  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (
    listPrice: number,
    salePrice: number,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };

  const selectedProduct = product.find((product) => {
    return product._id === selectedId;
  });

  const discountPercentage = selectedProduct?.salePrice
    ? calculateDiscountPercentage(
        selectedProduct.salePrice,
        selectedProduct.price,
      )
    : 0;

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  try {
    createViewiedProducts(selectedId);
  } catch (error) {
    console.log("errror sending data");
  }

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
      <MaxWidthWrapper className="mx-auto grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w- group grid md:col-span-1 lg:col-span-2 lg:grid-cols-[100px_1fr]"
        >
          <ScrollArea
            className="row-start-2 my-2 whitespace-nowrap lg:row-auto"
            style={{
              height: "calc(100% - 2px)", // Makes the height dynamic
            }}
          >
            <div className="flex flex-row gap-2 lg:flex-col">
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
                <AspectRatio ratio={16 / 12} className="bg-gray-100">
                  <img
                    alt="Product image"
                    className="h-full w-full rounded-md object-contain"
                    src={image}
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* </div> */}
        </Carousel>

        <div className="py-4 text-start md:col-span-1">
          <div>
            <p className="text-md capitalize text-primary">
              {categoryLookup(selectedProduct?.categoryId)}
            </p>
            <h1 className="py-2 text-3xl font-semibold capitalize">
              {selectedProduct?.name}
            </h1>
          </div>

          <div className="mb-4 flex flex-col items-start justify-start text-2xl font-bold">
            <p className="text-md ml-2 flex items-center">
              <span className="relative">
                <b className="absolute -left-2 top-1 text-sm font-normal">₹</b>
                {selectedProduct?.price}
              </span>
            </p>

            {selectedProduct?.salePrice && (
              <span className="my-1.5 text-xs font-semibold text-secondary/70">
                M.R.P: <del>₹{selectedProduct.salePrice} </del>
                {discountPercentage > 0 && (
                  <b className="ml-2 text-primary/90">
                    {discountPercentage}% OFF
                  </b>
                )}
              </span>
            )}
          </div>
          <Separator className="mb-4" />
          <p>{selectedProduct?.brandName}</p>
          <p className="max-w-xl truncate text-sm">
            {selectedProduct?.description}
          </p>
          <div className="flex flex-col gap-3 py-4">
            {/* <div className="flex">
              <button
                onClick={(e) => decreaseQty(e, selectedProduct?._id || "")}
                className="rounded-l-md border-b border-l border-t px-3 py-1"
              >
                -
              </button>
              <p className="border px-2 py-1 text-sm font-medium">
                {loadingItems[selectedProduct?._id ?? ""] ? (
                  <Loader className="animate-spin p-1.5" />
                ) : (
                  itemQuantities[selectedProduct?._id ?? ""] || 0
                )}
              </p>
              <button
                onClick={(e) => increaseQty(e, selectedProduct?._id ?? "")}
                className="rounded-r-md border-b border-r border-t px-3 py-1"
              >
                +
              </button>
            </div> */}
            <AddToCartButton id={selectedProduct?._id} />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
