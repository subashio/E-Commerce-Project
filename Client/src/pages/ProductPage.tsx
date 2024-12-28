import AddToWishlistButton from "@/components/AddToWishlistButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import Logos from "@/components/Logos";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCarousel from "@/components/ProductCarousel";
import { ProductTabs } from "@/components/ProductTabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lens } from "@/components/ui/lens";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { footerSvg } from "@/constants/details";
import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import Axios from "@/lib/Axios";
import { toggleSheetOpen } from "@/store/orderSlice";
import { RootState } from "@/store/store";
import Autoplay from "embla-carousel-autoplay";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function ProductPage() {
  const product = useSelector((state: RootState) => state.product.product);
  const { id } = useParams();
  const category = useSelector((state: RootState) => state.product.category);
  const { createViewiedProducts } = useProduct();
  const [hovering, setHovering] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);
  const { updateCartItem } = useCart();
  const cartList = useSelector((state: RootState) => state.product.cartList);
  const { toast } = useToast();
  const { handleToast, fetchCartItem } = useGlobleContext();
  const [isAvailableCart, setIsAvailableCart] = React.useState(false);
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(null);
  const dispatch = useDispatch();

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

  const selectedProduct = product.find((product: any) => {
    return product._id === id;
  });

  const user = useSelector((state: RootState) => state.user.currentUser);
  if (!selectedProduct) {
    return <div>Loading...</div>; // Or a loading state if the product is not available
  }
  const [price, setPrice] = React.useState(
    user?.isWholesaler
      ? selectedProduct?.wholesalePrice
      : selectedProduct?.price,
  );

  const discountPercentage = selectedProduct?.salePrice
    ? calculateDiscountPercentage(selectedProduct.salePrice, price ?? 0)
    : 0;

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
  };

  try {
    createViewiedProducts(id);
    console.log(id);
  } catch (error) {
    console.log("errror sending data");
  }

  const handleAddToCart = async (productId: string) => {
    if (!isAvailableCart) {
      try {
        const response = await Axios({
          ...SummaryApi.add_cart,
          data: {
            productId: productId,
          },
        });

        if (response.data) {
          fetchCartItem(); // Fetch the latest cart items
          toast({
            variant: "default",
            title: "Product added to cart ✅",
          });
        }
      } catch (error) {
        console.error(error);
        handleToast();
      }
    }
  };

  const handleIncreaseQty = async () => {
    const maxQuantity = selectedProduct?.maxQuantity;

    if (maxQuantity == null || quantity < maxQuantity) {
      if (isAvailableCart) {
        const stockLimit = selectedProduct?.stock; // Assuming stockLimit is a property of selectedProduct
        if (quantity >= stockLimit) {
          toast({
            variant: "default",
            title: "Out of Stock ❌",
          });
          return;
        }

        try {
          await updateCartItem(cartItemDetails._id, quantity + 1);
          toast({
            variant: "default",
            title: "Quantity Increased!✅",
          });
        } catch (error) {
          console.error(error);
          handleToast();
        }
      } else {
        handleAddToCart(selectedProduct._id);
      }
    } else if (maxQuantity !== null) {
      toast({
        variant: "default",
        title: `Maximum quantity of ${maxQuantity} reached.`,
      });
    }
  };

  const handleDecreaseQty = async () => {
    if (isAvailableCart) {
      try {
        await updateCartItem(cartItemDetails._id, quantity - 1);
        toast({
          variant: "default",
          title: "Quantity Increased!✅",
        });
      } catch (error) {
        console.error(error);
        handleToast();
      }
    }
  };

  const updatePrice = () => {
    if (user?.isWholesaler) {
      setPrice(selectedProduct?.wholesalePrice);
    } else {
      setPrice(selectedProduct?.price);
    }
  };

  React.useEffect(() => {
    const productInCart = cartList.find((item: any) => {
      if (typeof item.productId === "string") {
        return item.productId === selectedProduct._id;
      } else if (item.productId && typeof item.productId === "object") {
        return item.productId._id === selectedProduct._id;
      }
      return false;
    });

    if (productInCart) {
      setQuantity(productInCart.quantity);
      setIsAvailableCart(true);
      setCartItemsDetails(productInCart);
      updatePrice();
    } else {
      setQuantity(0);
      setIsAvailableCart(false);
      setCartItemsDetails(null);
    }
  }, [selectedProduct._id, cartList]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
      <MaxWidthWrapper className="mx-auto grid w-full grid-cols-1 gap-10 p-4 md:grid-cols-2 lg:grid-cols-3">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="group grid md:col-span-1 lg:col-span-2 lg:grid-cols-[100px_1fr]"
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
            className="ml-auto"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {selectedProduct?.image.map((image, index) => (
              <CarouselItem
                key={index}
                className="mx-auto !w-full cursor-zoom-in active:cursor-grabbing"
              >
                <Lens hovering={hovering} setHovering={setHovering}>
                  <AspectRatio ratio={16 / 12} className="bg-gray-100">
                    <img
                      src={image}
                      alt="Product image"
                      className="h-full w-full rounded-md object-contain"
                    />
                  </AspectRatio>
                </Lens>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="py-4 text-start md:col-span-1">
          <div>
            <p className="text-md capitalize text-primary">
              {categoryLookup(selectedProduct?.categoryId)}
            </p>
            <h1 className="py-2 text-2xl font-semibold capitalize">
              {selectedProduct?.name}
            </h1>
          </div>
          <Separator className="my-2" />

          <div className="flex flex-col items-start justify-start text-2xl font-bold">
            <p className="text-md ml-2 flex items-center">
              <span className="relative">
                <b className="absolute -left-2 top-1 text-sm font-normal">₹</b>
                {price}
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

          <div className="flex flex-wrap items-center gap-3 py-4">
            {selectedProduct && (
              <div className="flex">
                <button
                  onClick={() => handleDecreaseQty()}
                  className="rounded-l-md border-b border-l border-t px-3 py-1"
                >
                  -
                </button>

                <p className="border px-2 py-1 text-sm font-medium">
                  {quantity}
                </p>

                <button
                  onClick={() => handleIncreaseQty()}
                  className="rounded-r-md border-b border-r border-t px-3 py-1"
                >
                  +
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {selectedProduct && (
                <Button
                  className="h-9 w-[200px] gap-1 rounded-lg p-2 capitalize"
                  onClick={() => {
                    handleAddToCart(selectedProduct._id);
                    dispatch(toggleSheetOpen(true));
                  }}
                >
                  Add to Cart
                </Button>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AddToWishlistButton
                      id={selectedProduct?._id}
                      className="h-9 rounded-lg bg-accent hover:bg-accent"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Wishlist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Separator className="mb-2" />
          <div className="mb-2 flex flex-col gap-4 p-2">
            {selectedProduct?.wholesalePrice ? (
              <p className="text-sm font-semibold text-secondary/70">
                Availability: Wholesale & Retail
              </p>
            ) : (
              <p className="text-sm font-semibold text-secondary/70">
                Availability: stock
              </p>
            )}
            <p className="text-sm font-semibold text-secondary/70">
              Type: Samsung
            </p>
            <p className="text-sm font-semibold text-secondary/70">
              Brand: Samsung
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border p-2 px-4 text-sm font-semibold text-secondary/70 hover:bg-secondary hover:text-secondary-foreground">
              Share <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {footerSvg.map((item) => (
                <DropdownMenuItem>
                  <Link
                    to="#"
                    className="mt-2 flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <Logos d={item.d} className="h-4 w-4 border-none" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper className="lg:my-8">
        <ProductTabs description={selectedProduct?.description} />
      </MaxWidthWrapper>
      <ProductCarousel title="Similar Items" />
      <Footer />
    </section>
  );
}
