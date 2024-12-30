import GenericTable from "@/components/GenericTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { wishlistColumn } from "@/lib/Actions";

import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function WishlistPage() {
  const [search, setSearch] = React.useState("");
  const wishlist = useSelector(
    (state: RootState) => state.product?.wishlist || [],
  );

  const wishlistData = wishlist
    .map((item) => {
      const product = item;
      return {
        id: product?._id,
        image: product?.image[0] || "/placeholder.png",
        name: product?.name || "Unknown Product",
        price: product?.price ? product.price : product.wholesalePrice || 0,
        variantID: product.variantId,
      };
    })
    .filter((order) => {
      // Apply search filter here
      return order.name.toLowerCase().includes(search.toLowerCase()); // Search by product name
    });

  return (
    <div className="px-4 pb-10 pt-10 md:pb-10 md:pt-0">
      <h1 className="text-3xl font-semibold">My Wishlist</h1>
      <Card className="my-10">
        <CardHeader className="w-full items-center justify-between gap-2 sm:flex-row">
          <Input
            placeholder="search"
            className="w-full sm:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
            <GenericTable columns={wishlistColumn} data={wishlistData} />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
