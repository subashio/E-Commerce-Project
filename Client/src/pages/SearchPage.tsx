import ProductCard from "@/components/ProductCard";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const product = useSelector((state: RootState) => state.product.product);
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [visibleCount, setVisibleCount] = useState(20);

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );

  const productsData = product
    .filter((prod: any) =>
      user?.isWholesaler
        ? prod.productType === "wholesale"
        : prod.productType !== "wholesale",
    )
    .map((prod: any) => ({
      id: prod._id,
      image: prod.image,
      name: prod.name,
      category: categoryLookup.get(prod.categoryId) || "NA",
      subCategory: subCategoryLookup.get(prod.sub_categoryId) || "NA",
      status: prod.status,
      brandName: prod.brandName,
      productType: prod.productType,
      wholesalePrice: prod.wholesalePrice,
      searchTags: prod.searchTags,
      salePrice: prod.salePrice,
      maxQuantity: prod.maxQuantity,
      price: prod.price,
      description: prod.description,
      createdAt: new Date(prod.createdAt).toISOString().split("T")[0],
    }));

  const filteredProducts = React.useMemo(() => {
    if (!query.trim()) return productsData;

    return productsData
      .filter(
        (prod) =>
          prod.name.toLowerCase().includes(query) ||
          prod.searchTags?.some((tag: string) =>
            tag.toLowerCase().includes(query),
          ),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [productsData, query]);

  return (
    <div className="mt-48 block p-4">
      <h1 className="text-lg font-semibold">
        Search Results for: <span className="font-normal"> {query} </span>
      </h1>
      <div className="mt-4">
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts
                .slice(0, visibleCount)
                .map((item: any, index) => (
                  <ProductCard
                    discount={item.discount}
                    _id={item.id}
                    key={index}
                    category={item.category}
                    name={item.name}
                    image={item.image[0]}
                    price={item.price ? item.price : item.wholesalePrice}
                    salePrice={item.salePrice}
                    className="flex-shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-[24%] xl:basis-[19%]"
                  />
                ))}
            </div>
            {visibleCount < filteredProducts.length && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
}
