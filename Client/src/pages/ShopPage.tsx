import ProductCard from "@/components/ProductCard";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function ShopPage({
  PriceRange,
  userType,
  filter,
}: {
  PriceRange: [number, number];
  userType?: string;
  filter?: any;
}) {
  const { categoryId, subCategoryId } = useParams<{
    categoryId: string;
    subCategoryId?: string;
  }>();

  const product = useSelector(
    (state: RootState) => state.product?.product || [],
  );
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );

  if (!product || !category || !subCategory) {
    return (
      <div className="flex items-center justify-center">
        Loading products...
      </div>
    );
  }
  const user = useSelector((state: RootState) => state.user?.currentUser);
  // Helper function to calculate discount percentage
  const calculateDiscountPercentage = (
    listPrice: number,
    salePrice: number,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };
  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );
  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );

  // Decode names from the URL
  const decodedCategoryName = categoryId ? decodeURIComponent(categoryId) : "";
  const decodedSubCategoryName = subCategoryId
    ? decodeURIComponent(subCategoryId)
    : "";

  const selectedCategory = category.find(
    (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase(),
  );
  const selectedCategoryId = selectedCategory?._id;

  const selectedSubCategory = subCategory.find(
    (sub) => sub.name.toLowerCase() === decodedSubCategoryName.toLowerCase(),
  );
  const selectedSubCategoryId = selectedSubCategory?._id;

  const filteredProducts = React.useMemo(() => {
    let filtered = product;
    if (selectedCategoryId) {
      filtered = filtered.filter(
        (prod) => prod.categoryId === selectedCategoryId,
      );
    }

    if (selectedSubCategoryId) {
      filtered = filtered.filter(
        (prod) => prod.sub_categoryId === selectedSubCategoryId,
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (prod: any) => prod.price >= PriceRange[0] && prod.price <= PriceRange[1],
    );

    // Filter by user type
    if (user?.isWholesaler) {
      filtered = filtered.filter(
        (prod: any) => prod.productType === "wholesale",
      );
    } else {
      filtered = filtered.filter(
        (prod: any) => prod.productType !== "wholesale",
      );
    }

    // Log filters before applying them
    if (filter && Object.keys(filter).length > 0) {
      filtered = filtered.filter((prod: any) => {
        return Object.keys(filter).every((filterKey) => {
          const filterValues = filter[filterKey];

          if (!filterValues || filterValues.length === 0) return true; // No filter applied

          if (!prod.filterOptions || !Array.isArray(prod.filterOptions)) {
            console.warn("Product missing filterOptions:", prod);
            return false;
          }

          // Check if any keyword in `prod.filterOptions` matches the full "key:value" format
          return filterValues.some((filterValue: string) =>
            prod.filterOptions.includes(`${filterKey}:${filterValue}`),
          );
        });
      });
    }
    return filtered;
  }, [
    selectedCategoryId,
    selectedSubCategoryId,
    product,
    PriceRange,
    userType,
    filter,
  ]);

  const activeProducts = filteredProducts.filter(
    (prod: any) => prod.status === true,
  );

  if (activeProducts.length === 0) {
    return (
      <p className="flex h-full w-full items-center justify-center">
        {decodedSubCategoryName
          ? `No products found in the "${decodedSubCategoryName}" subcategory.`
          : `No products found in this category.`}
      </p>
    );
  }
  const products = activeProducts.map((product: any) => {
    const discount = calculateDiscountPercentage(
      product.salePrice,
      product.price ? product.price : product.wholesalePrice,
    );
    return {
      _id: product._id,
      name: product.name,
      discount: discount > 0 ? `${discount}%` : null,
      to: "/",
      image: product.image[0] || "default.jpg",
      category: categoryLookup.get(product.categoryId), // Look
      subCategory:
        subCategoryLookup.get(product.sub_categoryId) || "Unknown Subcategory",
      price: product.price ? product.price : product.wholesalePrice,
      salePrice: product.salePrice,
      status: product.status ?? false,
    };
  });

  return (
    <div>
      <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            _id={product._id}
            discount={product.discount}
            name={product.name}
            salePrice={product.salePrice}
            price={product.price}
            image={product.image}
            key={index}
            category={product.category}
          />
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
