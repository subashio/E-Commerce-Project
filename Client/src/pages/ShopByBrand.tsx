import Breadcrumbs from "@/components/Breadcrumbs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductCard from "@/components/ProductCard";
import { brandsData } from "@/constants/details";
import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function ShopByBrand() {
  const { categoryName, brandName } = useParams<{
    categoryName: string;
    brandName?: string;
  }>();

  const product = useSelector((state: RootState) => state.product.product);
  const category = useSelector((state: RootState) => state.product.category);
  const user = useSelector((state: RootState) => state.user.currentUser);
  if (!categoryName) return <p>No category selected</p>;

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );
  const calculateDiscountPercentage = (
    listPrice: number,
    salePrice: number,
  ): number => {
    if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
    return Math.round(((listPrice - salePrice) / listPrice) * 100);
  };

  const productsData = React.useMemo(() => {
    return product
      .filter((product: Products) => product !== null && product !== undefined) // Filter out null or undefined entries
      .filter((product: Products) => {
        // Check if the user is a wholesaler and filter accordingly
        if (user?.isWholesaler) {
          return product.productType === "wholesale";
        } else {
          return product.productType !== "wholesale";
        }
      })
      .map((product: any) => {
        const price = user?.isWholesaler
          ? product.wholesalePrice || product.price
          : product.price;
        const discount = calculateDiscountPercentage(product.salePrice, price);

        return {
          _id: product._id,
          name: product.name || "Unknown Product",
          discount: discount > 0 ? `${discount}%` : null,
          to: "/",
          image: product.image[0] || "default.jpg",
          category:
            categoryLookup.get(product.categoryId) || "Unknown Category",
          price: product.price || 0,
          salePrice: product.salePrice || 0,
          wholesalePrice: product.wholesalePrice || 0,
          status: product.status ?? false,
          brandName: product.brandName,
        };
      });
  }, [product, categoryLookup]);
  const decodedCategory = decodeURIComponent(categoryName);
  const decodedBrand = brandName ? decodeURIComponent(brandName) : null;

  console.log("Decoded Category:", decodedCategory);
  console.log("Brands Data Keys:", Object.keys(brandsData));

  const brands = brandsData[decodedCategory] || [];

  console.log("Brands for category:", brands);

  // ✅ Filter products based on user type
  const filteredProducts = (productsData || []).filter((product) =>
    decodedBrand
      ? product.brandName === decodedBrand
      : product.category === decodedCategory,
  );

  return (
    <MaxWidthWrapper className="mt-56">
      {/* <h2 className="text-2xl font-bold">
        {decodedBrand ? decodedCategory : "Search By BrandName"}
      </h2> */}
      <Breadcrumbs
        className="my-6 w-full"
        path={`/ShopByBrand/${decodedCategory}`}
        pathName={`${decodedCategory}`}
        finalPathName={`/ ${decodedBrand ? decodedBrand : "All Brands"}`}
      />

      {/* ✅ Show brands when no brand is selected */}
      {!decodedBrand && brands.length > 0 ? (
        <>
          <h3 className="mt-6 text-xl font-semibold">All Brands</h3>
          <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-6">
            {brandsData[decodedCategory].map((brand, index) => (
              <Link
                to={`/shopByBrand/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(brand.name)}`}
                key={index}
                className="flex flex-col items-center gap-1 rounded-2xl border p-4 shadow-sm hover:border-primary"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="lg:w-26 h-14 w-20 object-contain lg:h-28"
                />
                <span className="text-sm font-semibold">{brand.name}</span>
              </Link>
            ))}
          </div>
        </>
      ) : null}

      {/* ✅ Show all products in the category if no brand is selected */}
      {decodedBrand && (
        <>
          <h3 className="mt-6 text-xl font-semibold">
            {decodedBrand
              ? `${decodedBrand} Products`
              : `${decodedCategory} Products`}
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  _id={product._id}
                  key={index}
                  category={product.category}
                  name={product.name}
                  image={product.image}
                  price={product.price ? product.price : product.wholesalePrice}
                  salePrice={product.salePrice}
                />
              ))
            ) : (
              <p>No products found for {decodedBrand || decodedCategory}.</p>
            )}
          </div>
        </>
      )}
    </MaxWidthWrapper>
  );
}
