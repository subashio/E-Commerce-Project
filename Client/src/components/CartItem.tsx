import { setVariantSheet } from "@/store/ProductSlice";
import { Loader, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { toggleSheetOpen } from "@/store/orderSlice";
import { RootState } from "@/store/store";

const CartItem = React.memo(function CartItem({
  item,
  quantity,
  isLoading,
  increaseQty,
  decreaseQty,
  handleDeleteCart,
}: {
  item: any;
  quantity: number;
  isLoading: boolean | string;
  increaseQty: (e: React.MouseEvent, id: string) => void;
  decreaseQty: (e: React.MouseEvent, id: string) => void;
  handleDeleteCart: (e: React.MouseEvent, id: string) => void;
}) {
  const product = typeof item.productId === "object" ? item.productId : null;

  if (!product) {
    return <div key={item._id}>Product not found</div>;
  }

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const userType = user?.isWholesaler;
  return (
    <div className="flex h-auto flex-col gap-2 border-b py-4">
      <div
        key={item._id}
        className="flex h-auto w-full flex-wrap items-center gap-4"
      >
        <div>
          <img
            alt={product?.name}
            className="w-20 object-cover"
            src={product?.image[0] || "/default_image.png"}
          />
        </div>
        <div className="my-auto mr-auto flex h-full max-w-44 flex-col items-start justify-center gap-2 truncate text-sm font-semibold">
          {product?.name}
          <div className="font-bold">
            ₹{item.variantTotal || product?.wholesalePrice || product?.price}
            {product?.salePrice && (
              <del className="ml-1 text-secondary/50 dark:text-secondary-foreground/70">
                ₹{product?.salePrice}
              </del>
            )}
          </div>
          {item.productId.variantId && (
            <p className="text-xs font-semibold text-secondary/80 dark:text-secondary-foreground/70">
              Total qty: {quantity}
            </p>
          )}
        </div>

        {!item.productId.variantId && userType === false ? (
          <div className="flex flex-col items-start gap-1">
            <div className="flex">
              <button
                onClick={(e) => decreaseQty(e, item._id)}
                className="rounded-l-md border-b border-l border-t px-3 py-1"
              >
                -
              </button>

              <p className="border px-2 py-1 text-sm font-medium">
                {isLoading ? (
                  <Loader className="animate-spin p-1.5" />
                ) : (
                  quantity
                )}
              </p>
              <button
                onClick={(e) => increaseQty(e, item._id)}
                className="rounded-r-md border-b border-r border-t px-3 py-1"
              >
                +
              </button>
              <button
                onClick={(e) => handleDeleteCart(e, item._id)}
                className="ml-4 flex items-center gap-1 !p-0 text-xs text-secondary !no-underline dark:text-secondary-foreground"
              >
                <Trash2 className="text-destructive" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={(e) => handleDeleteCart(e, item._id)}
            className="flex items-center gap-1 !p-0 text-xs text-secondary !no-underline dark:text-secondary-foreground"
          >
            <Trash2 className="text-destructive" />
          </button>
        )}
      </div>
      {item.productId.variantId && userType === true && (
        <Button
          variant="outline"
          onClick={() => {
            dispatch(setVariantSheet(true));
            dispatch(toggleSheetOpen(false));
          }}
        >
          Edit variant
        </Button>
      )}
    </div>
  );
});

export default CartItem;
