import { Loader, Trash2 } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";

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

  return (
    <div
      key={item._id}
      className="flex h-auto w-full flex-wrap items-center gap-4 border-b py-4"
    >
      <div>
        <img
          alt={product?.name}
          className="w-20 object-cover"
          src={product?.image[0] || "/default_image.png"}
        />
      </div>
      <div className="my-auto mr-auto flex h-full max-w-60 flex-col items-start justify-center gap-2 text-sm font-semibold sm:max-w-xs">
        {product?.name}
        <div className="font-bold">
          ₹{product?.price}
          {product?.salePrice && (
            <del className="ml-1 text-secondary/50 dark:text-secondary-foreground/70">
              ₹{product?.salePrice}
            </del>
          )}
          {product.discount && (
            <Badge className="ml-2 bg-red-600 hover:bg-red-500">
              {product.discount} %
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start gap-1">
        <div className="flex">
          <button
            onClick={(e) => decreaseQty(e, item._id)}
            className="rounded-l-md border-b border-l border-t px-3 py-1"
          >
            -
          </button>
          <p className="border px-2 py-1 text-sm font-medium">
            {isLoading ? <Loader className="animate-spin p-1.5" /> : quantity}
          </p>
          <button
            onClick={(e) => increaseQty(e, item._id)}
            className="rounded-r-md border-b border-r border-t px-3 py-1"
          >
            +
          </button>
        </div>
        <button
          onClick={(e) => handleDeleteCart(e, item._id)}
          className="flex items-center gap-1 !p-0 text-xs text-secondary !no-underline dark:text-secondary-foreground"
        >
          <Trash2 className="w-3.5 text-destructive" /> Remove
        </button>
      </div>
    </div>
  );
});

export default CartItem;
