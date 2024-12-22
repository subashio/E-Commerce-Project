import { useGlobleContext } from "@/context/GlobleContextProvider";
import { useProduct } from "@/hooks/useProduct";
import { RootState } from "@/store/store";
import { Heart } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function AddToWishlistButton({
  id,
  className,
}: {
  id: string | undefined;
  className?: string;
}) {
  const { createWishlist, deleteWishlist } = useProduct();
  const [isAvailableWishlist, setIsAvailableWishlist] =
    React.useState<boolean>(false);

  const { handleToast } = useGlobleContext();
  const wishlist = useSelector(
    (state: RootState) => state.product?.wishlist || [],
  );

  async function Addtowishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isAvailableWishlist) {
      try {
        await deleteWishlist(id || "");
        console.log("Item removed from wishlist");
      } catch (error) {
        console.log("Form never submited");
        console.error(error);
        handleToast();
      }
    } else {
      try {
        await createWishlist(id);
        console.log("Item added to wishlist");
      } catch (error) {
        console.log("Form never submited");
        console.error(error);
        handleToast();
      }
    }
  }

  React.useEffect(() => {
    const productInWishlist = wishlist?.find((item: any) => {
      return item._id === id; // Compare directly with _id
    });

    if (productInWishlist) {
      setIsAvailableWishlist(true);
    } else {
      setIsAvailableWishlist(false);
    }
  }, [id, wishlist]);

  return (
    <div>
      <Button
        className={cn(
          "h-4 gap-1 rounded-lg p-2 capitalize hover:bg-transparent",
          className,
        )}
        variant="ghost"
        onClick={Addtowishlist}
      >
        <Heart
          className={`h-4 w-4 text-primary ${isAvailableWishlist ? "fill-primary" : "fill-none"}`}
        />
      </Button>
    </div>
  );
}
