import Breadcrumbs from "@/components/Breadcrumbs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ShopHeader from "@/components/ShopHeader";
import ShopSide from "@/components/ShopSide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import ShopPage from "@/pages/ShopPage";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

const filterTypes = [
  { label: "Newest", value: "new" },
  { label: "Price: High to Low", value: "high" },
  { label: "Price: Low to High", value: "low" },
  { label: "Release Date", value: "date" },
] as const;
const filterTypes2 = [
  { label: "Show: 10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
] as const;

// export default function Shop() {
//   const { categoryId, subCategoryId } = useParams<{
//     categoryId: string;
//     subCategoryId: string;
//   }>();
//   const location = useLocation();
//   const user = useSelector((state: RootState) => state.user?.currentUser);
//   const category = useSelector(
//     (state: RootState) => state.product?.category || [],
//   );
//   const [priceRange, setPriceRange] = React.useState<[number, number]>([
//     0, 500000,
//   ]);
//   const product = useSelector((state: RootState) => state.product.product);
//   // Set category name based on the category ID in the URL
//   const subCategory = useSelector(
//     (state: RootState) => state.product?.subcategory || [],
//   );
//   const filteredProducts = React.useMemo(() => {
//     if (subCategoryId) {
//       // Filter by subcategory if subCategoryId exists
//       return product.filter(
//         (prod: any) => prod.sub_categoryId === subCategoryId,
//       );
//     }
//     if (categoryId) {
//       // Otherwise, filter by category
//       return product.filter((prod: any) => prod.categoryId === categoryId);
//     }
//     if (user?.isWholesaler) {
//       return product.filter((prod: any) => prod.productType === "wholesale");
//     } else {
//       return product.filter((prod: any) => prod.productType !== "wholesale");
//     }
//     // Default to showing all products
//     return product;
//   }, [categoryId, subCategoryId, product]);

//   const categoryName = React.useMemo(() => {
//     if (categoryId) {
//       const categoryMatch = category.find((cat) => cat._id === categoryId);
//       return categoryMatch?.name || "";
//     }
//     return "";
//   }, [categoryId, category]);

//   const subCategoryName = React.useMemo(() => {
//     if (subCategoryId) {
//       const subCategoryMatch = subCategory.find(
//         (subCat) => subCat._id === subCategoryId,
//       );
//       return subCategoryMatch?.name || "";
//     }
//     return "";
//   }, [subCategoryId, subCategory]);

//   React.useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <GlobleContextProvider>
//       <Breadcrumbs
//         className="mx-auto my-10 mt-56"
//         path="/shop"
//         pathName="shop"
//         path2={`/shop/${categoryId}`}
//         pathName2={(categoryName && `/ ${categoryName} `) || ""}
//         finalPathName={(subCategoryName && `/ ${subCategoryName}`) || ""}
//       />

//       <MaxWidthWrapper className="grid w-full grid-flow-col gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr]">
//         {/* <div className="col-span-0 hidden justify-center rounded-lg border-r md:w-[300px] lg:flex lg:min-h-screen lg:w-[250px]"> */}
//         <ShopSide setPriceRange={setPriceRange} />
//         <div className="flex w-full flex-col">
//           <div className="mb-4 flex h-24 flex-col items-center justify-center rounded-lg bg-primary/10 text-2xl font-semibold sm:text-3xl">
//             {location.pathname == "/shop"
//               ? "All Produts"
//               : `${categoryName || subCategoryName}`}
//           </div>
//           <div className="mb-8 grid w-full grid-flow-row items-center gap-3 md:grid-cols-1 lg:grid-flow-col">
//             <h1 className="row-start-1 flex items-center gap-2 lg:row-auto">
//               {
//                 filteredProducts.filter(
//                   (prod: any) =>
//                     user?.isWholesaler || prod.productType !== "wholesale",
//                 ).length
//               }
//               <span>Product found</span>
//             </h1>
//             <Select
//             // onValueChange={(value) => setStatus(value)} // Update status on selection
//             >
//               <SelectTrigger className="row-start-2 mr-auto w-[200px] lg:row-auto">
//                 <SelectValue placeholder="Sort By" />
//               </SelectTrigger>
//               <SelectContent>
//                 {filterTypes.map((item, index) => (
//                   <SelectItem key={index} value={item.value}>
//                     {item.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Select
//             // onValueChange={(value) => setStatus(value)} // Update status on selection
//             >
//               <SelectTrigger className="row-start-2 lg:row-auto">
//                 <SelectValue placeholder="Show" />
//               </SelectTrigger>
//               <SelectContent>
//                 {filterTypes2.map((item, index) => (
//                   <SelectItem key={index} value={item.value}>
//                     {item.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <ShopHeader setPriceRange={setPriceRange} />
//           </div>
//           <div className="">
//             <ShopPage PriceRange={priceRange} />
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </GlobleContextProvider>
//   );
// }

export default function Shop() {
  const { categoryId, subCategoryId, brandName } = useParams<{
    categoryId: string;
    subCategoryId?: string;
    brandName?: string;
  }>();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user?.currentUser);
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );
  const product = useSelector((state: RootState) => state.product.product);

  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 500000,
  ]);

  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  // Decode names from the URL
  const decodedCategoryName = categoryId ? decodeURIComponent(categoryId) : "";
  const decodedSubCategoryName = subCategoryId
    ? decodeURIComponent(subCategoryId)
    : "";
  const decodedBrandName = brandName ? decodeURIComponent(brandName) : null;
  // Find the corresponding category object
  const selectedCategory = category.find(
    (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase(),
  );
  const selectedCategoryId = selectedCategory?._id;

  // Find the corresponding sub-category object (if exists)
  const selectedSubCategory = subCategory.find(
    (sub) => sub.name.toLowerCase() === decodedSubCategoryName.toLowerCase(),
  );
  const selectedSubCategoryId = selectedSubCategory?._id;

  // Filter products based on category and sub-category
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
    if (decodedBrandName) {
      filtered = filtered.filter(
        (prod) =>
          prod.brandName.toLowerCase().trim() ===
          decodedBrandName.toLowerCase().trim(),
      );
    }
    if (user?.isWholesaler) {
      filtered = filtered.filter((prod) => prod.productType === "wholesale");
    } else {
      filtered = filtered.filter((prod) => prod.productType !== "wholesale");
    }

    if (filters && Object.keys(filters).length > 0) {
      filtered = filtered.filter((prod: any) => {
        return Object.keys(filters).every((filterKey) => {
          const filterValues = filters[filterKey];

          if (!filterValues || filterValues.length === 0) return true; // No filter applied

          if (!prod.filterOptions || !Array.isArray(prod.filterOptions)) {
            console.warn("Product missing.filterOptions:", prod);
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
    decodedBrandName,
    product,
    user,
    filters,
  ]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <GlobleContextProvider>
      {/* ✅ Updated Breadcrumbs */}
      <Breadcrumbs
        className="mx-auto my-10 mt-56 w-full px-2.5 lg:max-w-screen-2xl lg:px-10 xl:max-w-[1650px]"
        path="/shop"
        pathName="Shop"
        path2={categoryId ? `/shop/${categoryId}` : undefined}
        pathName2={decodedCategoryName ? `/ ${decodedCategoryName} ` : ""}
        finalPathName={
          decodedSubCategoryName
            ? `/ ${decodedSubCategoryName}`
            : decodedBrandName
              ? `/ ${decodedBrandName}`
              : ""
        }
      />

      <MaxWidthWrapper className="relative grid w-full grid-flow-col gap-10 lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr]">
        <ShopSide setFilters={setFilters} setPriceRange={setPriceRange} />
        <div className="flex w-full flex-col">
          <div className="mb-4 flex h-24 flex-col items-center justify-center rounded-lg bg-primary/10 text-2xl font-semibold sm:text-3xl">
            {location.pathname === "/shop"
              ? "All Products"
              : decodedSubCategoryName
                ? `${decodedSubCategoryName}`
                : decodedBrandName
                  ? `${decodedBrandName}`
                  : decodedCategoryName}
          </div>
          <div className="mb-8 grid w-full grid-flow-row items-center gap-3 md:grid-cols-1 lg:grid-flow-col">
            <h1 className="row-start-1 flex items-center gap-2 lg:row-auto">
              {filteredProducts.length} <span>Product&apos;s found</span>
            </h1>
            <Select>
              <SelectTrigger className="row-start-2 mr-auto w-[200px] lg:row-auto">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {filterTypes.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="row-start-2 lg:row-auto">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                {filterTypes2.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ShopHeader setFilters={setFilters} setPriceRange={setPriceRange} />
          </div>
          <div>
            <ShopPage filter={filters} PriceRange={priceRange} />
          </div>
        </div>
      </MaxWidthWrapper>
    </GlobleContextProvider>
  );
}
