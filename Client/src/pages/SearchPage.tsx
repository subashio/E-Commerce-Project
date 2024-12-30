import ProductCard from "@/components/ProductCard";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
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

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );
  const user = useSelector((state: RootState) => state.user.currentUser);
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
      category: categoryLookup.get(prod.categoryId) || "NA", // Look
      subCategory: subCategoryLookup.get(prod.sub_categoryId) || "NA", // Look
      status: prod.status,
      brandName: prod.brandName,
      productType: prod.productType,
      wholesalePrice: prod.wholesalePrice,
      maxQuantity: prod.maxQuantity,
      price: prod.price,
      description: prod.description,
      createdAt: new Date(prod.createdAt).toISOString().split("T")[0], // Correct date usage
    }));

  // Filter the data based on the query
  const filteredProducts = productsData.filter(
    (prod) =>
      prod.category.toLowerCase().includes(query) ||
      prod.name.toLowerCase().includes(query) ||
      prod.description.toLowerCase().includes(query),
  );
  console.log(productsData);
  return (
    <div className="block p-4">
      <h1 className="text-xl font-semibold">Search Results</h1>
      <div className="mt-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productsData.map((item: any, index) => (
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
        ) : (
          <p className="text-gray-500">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
}
