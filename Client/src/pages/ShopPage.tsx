import ProductCard from "@/components/ProductCard";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function ShopPage({ PriceRange }: { PriceRange: [number, number] }) {
  const { categoryId, subCategoryId } = useParams<{
    categoryId: string;
    subCategoryId: string;
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

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );
  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );

  const filteredProducts = React.useMemo(() => {
    let filtered = product;

    if (categoryId) {
      filtered = filtered.filter((prod: any) => prod.categoryId === categoryId);
    }

    if (subCategoryId) {
      filtered = filtered.filter(
        (prod: any) => prod.sub_categoryId === subCategoryId,
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (prod: any) => prod.price >= PriceRange[0] && prod.price <= PriceRange[1],
    );

    return filtered;
  }, [categoryId, subCategoryId, product, PriceRange]);

  const activeProducts = filteredProducts.filter(
    (prod: any) => prod.status === true,
  );

  if (activeProducts.length === 0) {
    return (
      <p>
        {categoryId
          ? `No products found in this category.`
          : "No products found."}
      </p>
    );
  }
  const products = activeProducts.map((product: any) => ({
    _id: product._id,
    name: product.name,
    discount: product.discount,
    to: "/",
    image: product.image[0] || "default.jpg",
    category: categoryLookup.get(product.categoryId), // Look
    subCategory:
      subCategoryLookup.get(product.sub_categoryId) || "Unknown Subcategory",
    price: product.price,
    salePrice: product.salePrice,
    status: product.status ?? false,
  }));

  return (
    <div>
      <div className="mb-20 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            _id={product._id}
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
