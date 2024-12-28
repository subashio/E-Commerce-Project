import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { SummaryApi } from "@/constants/SummaryApi";
import { useGlobleContext } from "@/context/GlobleContextProvider";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setVariantSheet } from "@/store/ProductSlice";

interface VariantCartSheetProps {
  button: ReactNode;
  selectedProduct?: any;
  materialType?: string[];
  brandName?: string[];
  selectedBrand?: string;
  selectedMaterial?: string;
  setSelectedBrand?: (brand: string | undefined) => void;
  setSelectedMaterial?: (material: string | undefined) => void;
}

export default function VariantCartSheet({
  button,
  selectedProduct,
  materialType,
  brandName,
  selectedBrand,
  setSelectedBrand,
  selectedMaterial,
  setSelectedMaterial,
}: VariantCartSheetProps) {
  // State to track quantities for each materialType and brandName
  const [quantities, setQuantities] = useState<{
    [materialType: string]: { [brandName: string]: number };
  }>({});

  const { toast } = useToast();
  // State to track the subtotal price
  const [subtotal, setSubtotal] = useState<number>(0);
  const [updatedArray, setUpdatedArray] = useState<any[]>([]);
  const [isAvailableCart, setIsAvailableCart] = React.useState(false);
  const [cartItemDetails, setCartItemsDetails] = React.useState<any>(null);
  const variantSheet = useSelector(
    (state: RootState) => state.product.variantSheet,
  );
  const dispatch = useDispatch();
  // Function to handle quantity change for each materialType and brandName
  const handleQuantityChange = async (
    materialType: string,
    brandName: string,
    change: number,
  ) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[materialType]?.[brandName] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);

      const updatedQuantities = {
        ...prevQuantities,
        [materialType]: {
          ...(prevQuantities[materialType] || {}),
          [brandName]: newQuantity,
        },
      };

      // Set the selected brand to the current brand being modified
      setSelectedBrand?.(brandName);

      // Transform updatedQuantities to an array of objects
      const updatedQuantitiesArray = Object.entries(updatedQuantities).flatMap(
        ([material, brands]) =>
          Object.entries(brands).map(([brand, quantity]) => ({
            materialType: material,
            brandName: brand,
            quantity,
          })),
      );

      // Make API call with the updated quantities array
      setUpdatedArray(updatedQuantitiesArray);
      return updatedQuantities;
    });
  };

  // Function to check if material is selected
  const isMaterialSelected = () => {
    return selectedMaterial !== undefined;
  };

  // Function to calculate total quantity
  const calculateTotalQuantity = () => {
    let total = 0;
    for (const material in quantities) {
      for (const brand in quantities[material]) {
        total += quantities[material][brand];
      }
    }

    return total;
  };

  const { fetchCartItem, handleToast } = useGlobleContext();
  const addToCart = async () => {
    // Function to handle adding items to the cart
    if (!isMaterialSelected()) {
      alert("Please select a material type.");
      return;
    }

    const totalQuantity = calculateTotalQuantity();

    if (isAvailableCart) {
      try {
        const response = await Axios({
          ...SummaryApi.update_cart,
          data: {
            _id: cartItemDetails?._id,
            qty: totalQuantity,
            variantQty: updatedArray,
            variantTotal: subtotal,
          },
        });
        if (response.data) {
          fetchCartItem();
          toast({
            variant: "default",
            title: "Product updated to cart ✅",
          });
        }
      } catch (error) {
        console.error(error);
        handleToast();
      }
    } else {
      try {
        const response = await Axios({
          ...SummaryApi.add_cart,
          data: {
            productId: selectedProduct?._id,
            quantity: totalQuantity,
            variantQty: updatedArray,
            variantTotal: subtotal,
          },
        });

        if (response.data) {
          fetchCartItem();
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

  const cartList = useSelector((state: RootState) => state.product.cartList);

  // Function to calculate subtotal price
  const calculateSubtotal = () => {
    let total = 0;
    for (const material in quantities) {
      for (const brand in quantities[material]) {
        const quantity = quantities[material][brand];
        const price = selectedProduct?.wholesalePrice || 0;
        total += quantity * price;
      }
    }
    setSubtotal(total);
  };

  // Update subtotal whenever quantities change
  React.useEffect(() => {
    calculateSubtotal();
  }, [quantities]);

  React.useEffect(() => {
    const productInCart = cartList.find((item: any) => {
      if (typeof item.productId === "string") {
        return item.productId === selectedProduct?._id;
      } else if (item.productId && typeof item.productId === "object") {
        return item.productId._id === selectedProduct?._id;
      }
      return false;
    });

    if (productInCart) {
      setIsAvailableCart(true);
      setUpdatedArray(productInCart.variantQty);

      setCartItemsDetails(productInCart);

      // Update quantities from the database
      const newQuantities = productInCart.variantQty.reduce(
        (acc: any, variant: any) => {
          if (!acc[variant.materialType]) {
            acc[variant.materialType] = {};
          }
          acc[variant.materialType][variant.brandName] = variant.quantity;
          return acc;
        },
        {},
      );
      setQuantities(newQuantities);
    } else {
      setIsAvailableCart(false);
      setUpdatedArray([]);

      setCartItemsDetails(null);
      setQuantities({});
    }
  }, [selectedProduct?._id, cartList]);
  return (
    <Sheet open={variantSheet} onOpenChange={setVariantSheet}>
      <SheetTrigger asChild>{button}</SheetTrigger>
      <SheetContent className="flex w-full flex-col justify-between p-0">
        <div className="flex flex-col gap-2 p-4">
          <h1>Select Variants and Quantity</h1>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-start justify-start gap-2 text-2xl font-bold">
              <h2>Price per piece</h2>
              <p className="text-md ml-2 flex items-center">
                <span className="relative">
                  <b className="absolute -left-2 top-1 text-sm font-normal">
                    ₹
                  </b>
                  {selectedProduct?.wholesalePrice}
                </span>
              </p>
            </div>

            {selectedProduct?.variantId && (
              <div className="mb-2 flex w-full flex-col items-start gap-4">
                <p className="text-sm font-semibold text-secondary/70">
                  Material Type
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {materialType?.map((item) => (
                    <div
                      key={item}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-sm font-medium ${
                        selectedMaterial === item ? "bg-primary text-white" : ""
                      }`}
                      aria-label="Toggle bold"
                      onClick={() =>
                        setSelectedMaterial?.(
                          selectedMaterial === item ? undefined : item,
                        )
                      }
                    >
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMaterial && (
              <div className="mt-2 flex w-full flex-col gap-2">
                <p className="text-sm font-semibold text-secondary/70">
                  Brand Name
                </p>

                <div className="mt-4 flex w-full flex-col gap-4">
                  {materialType?.map((material) => (
                    <>
                      {selectedMaterial === material && (
                        <div key={material}>
                          <p className="mb-4 px-2 text-xs font-semibold capitalize text-secondary/70">
                            {material} Variants
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {brandName?.map((brand) => (
                              <div
                                className="flex w-full items-center gap-2"
                                key={brand}
                              >
                                <div className="flex w-full">
                                  <div
                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-1 text-sm font-medium ${
                                      selectedBrand === brand
                                        ? "bg-primary text-white"
                                        : ""
                                    }`}
                                    aria-label="Toggle bold"
                                    onClick={() =>
                                      setSelectedBrand?.(
                                        selectedBrand === brand
                                          ? undefined
                                          : brand,
                                      )
                                    }
                                  >
                                    <p>{brand}</p>
                                  </div>
                                </div>

                                {selectedMaterial === material && (
                                  <div className="flex gap-3">
                                    <p className="text-md flex items-center">
                                      <span className="relative">
                                        <b className="absolute -left-2 top-1 text-sm font-normal">
                                          ₹
                                        </b>
                                        {selectedProduct?.wholesalePrice}
                                      </span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(
                                            material,
                                            brand,
                                            -1,
                                          )
                                        }
                                        className="rounded-full border px-3 py-1"
                                      >
                                        -
                                      </button>

                                      <p className="rounded-xl border px-5 py-1 text-sm font-medium">
                                        {quantities[material]?.[brand] || 0}
                                      </p>

                                      <button
                                        onClick={() =>
                                          handleQuantityChange(
                                            material,
                                            brand,
                                            1,
                                          )
                                        }
                                        className="flex rounded-full border px-2.5 py-1"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <SheetFooter className="!mx-0 flex !flex-col justify-between gap-2 border-t p-4 pt-10">
          <div className="flex w-full justify-between">
            <p className="text-sm font-semibold text-secondary/70">
              Item Total Quantity
            </p>
            <p className="text-md font-semibold">{calculateTotalQuantity()}</p>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-sm font-semibold text-secondary/70">
              Item Subtotal
            </p>
            <p className="text-md font-semibold">₹ {subtotal}</p>
          </div>
          <div className="!mx-0 flex w-full justify-between">
            <p className="text-sm font-semibold text-secondary/70">Total</p>
            <p className="text-md font-semibold">₹ {subtotal}</p>
          </div>
          <Button
            className="!mx-0 w-full"
            onClick={() => {
              addToCart();
              dispatch(setVariantSheet(false));
            }}
          >
            Add To Cart
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
