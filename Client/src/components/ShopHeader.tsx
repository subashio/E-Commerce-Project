import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RootState } from "@/store/store";
import { ChevronRight, Filter } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";

export default function ShopHeader({
  setPriceRange,
  setFilters,
}: {
  setPriceRange: (range: [number, number]) => void;
  setFilters: (filters: Record<string, string[]>) => void;
}) {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);

  const [priceRange, setLocalPriceRange] = React.useState<[number, number]>([
    0, 500000,
  ]);

  const { categoryId, subCategoryId } = useParams<{
    categoryId?: string;
    subCategoryId?: string;
  }>();

  // Redux selectors
  const categories = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategories = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );
  const products = useSelector(
    (state: RootState) => state.product?.product || [],
  );
  const user = useSelector((state: RootState) => state.user.currentUser);
  // Function to handle slider value change
  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    setPriceRange(value);
  };

  // Decode category name from URL
  const decodedCategoryName = categoryId ? decodeURIComponent(categoryId) : "";
  const decodedSubcategoryName = subCategoryId
    ? decodeURIComponent(subCategoryId)
    : "";

  // Find selected category object
  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase(),
  );
  const selectedCategoryId = selectedCategory?._id;
  // Find selected subcategory object
  const selectedSubcategory = subCategories.find(
    (sub) => sub.name.toLowerCase() === decodedSubcategoryName.toLowerCase(),
  );
  const selectedSubcategoryId = selectedSubcategory?._id;

  // Get subcategories of the selected category
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.categoryId === selectedCategoryId,
  );
  // ✅ Updated filtering logic to show retail filters for guests
  const categoryProducts = products.filter((product) => {
    const isWholesaleProduct = product.productType === "wholesale";
    const isRetailProduct = product.productType === "retail";

    if (user) {
      return (
        product.categoryId === selectedCategoryId &&
        (!selectedSubcategoryId ||
          product.sub_categoryId === selectedSubcategoryId) &&
        (user.isWholesaler ? isWholesaleProduct : isRetailProduct)
      );
    }

    // If user is not logged in, show only retail products
    return (
      product.categoryId === selectedCategoryId &&
      (!selectedSubcategoryId ||
        product.sub_categoryId === selectedSubcategoryId) &&
      isRetailProduct
    );
  });

  const getDynamicFilters = () => {
    if (!selectedCategory || categoryProducts.length === 0) return {};

    const filters: Record<string, string[]> = {};

    categoryProducts.forEach((product) => {
      product.filterOptions?.forEach((keyword: string) => {
        const [key, value] = keyword.split(":");
        if (key && value) {
          if (!filters[key]) filters[key] = [];
          if (!filters[key].includes(value)) {
            filters[key].push(value);
          }
        }
      });
    });

    return filters;
  };

  const dynamicFilters = getDynamicFilters();

  // Handle Filter Change
  const [filterState, setFilterState] = React.useState<
    Record<string, string[]>
  >({});

  const handleFilterChange = (filter: string, value: string) => {
    setFilterState((prev) => {
      const updatedFilters = { ...prev };
      if (updatedFilters[filter]?.includes(value)) {
        updatedFilters[filter] = updatedFilters[filter].filter(
          (v) => v !== value,
        );
      } else {
        updatedFilters[filter] = [...(updatedFilters[filter] || []), value];
      }
      setFilters(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <section className="relative row-start-1 ml-auto flex md:row-start-2 lg:row-auto">
      <div className="w-full">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              Filter <Filter />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex w-full flex-col items-center overflow-y-auto p-0 sm:max-w-[500px] lg:hidden"
          >
            <h1 className="my-6 px-4 text-2xl font-medium">Filter Products</h1>
            <ScrollArea className="w-full px-5 text-lg font-medium">
              <div className="flex w-full flex-col">
                <Link to="/Shop" className="text-md px-2 text-secondary">
                  Categories
                </Link>

                <Accordion
                  type="single"
                  className="my-4"
                  collapsible
                  defaultValue={selectedCategoryId || ""}
                >
                  {/* Show all categories if no category is selected */}
                  {!categoryId
                    ? categories.map((cat) => (
                        <Link
                          key={cat._id}
                          to={`/shop/${encodeURIComponent(cat.name)}`}
                          className="flex w-full items-center justify-between gap-3 border-b border-secondary/15 p-2 text-sm transition-transform duration-300 hover:text-primary"
                        >
                          {cat.name}
                          <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                        </Link>
                      ))
                    : selectedCategory && (
                        <AccordionItem
                          className="!border-none"
                          value={selectedCategory._id}
                        >
                          {/* Category is always expanded */}
                          <AccordionTrigger className="flex items-center gap-3 border-b border-secondary/15 p-2 text-sm transition-transform duration-300 hover:text-primary hover:no-underline">
                            {selectedCategory.name}
                            <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col rounded-md">
                            {filteredSubCategories.length > 0 ? (
                              filteredSubCategories.map((sub) => (
                                <Link
                                  to={`/shop/${encodeURIComponent(selectedCategory.name)}/${encodeURIComponent(sub.name)}`}
                                  key={sub._id}
                                  className="!justify-start !p-2 text-left hover:text-primary"
                                >
                                  {sub.name}
                                </Link>
                              ))
                            ) : (
                              <p className="p-2 text-sm text-gray-500">
                                No subcategories
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      )}
                </Accordion>
                <div className="mb-4 flex w-full items-center justify-between px-2 text-2xl font-bold">
                  Filters
                  <button
                    className="mt-1 rounded-2xl bg-primary/10 p-1.5 px-2 text-xs text-primary/90"
                    onClick={() => {
                      setFilterState({});
                      setFilters({});
                      setLocalPriceRange([0, 500000]);
                      setPriceRange([0, 500000]);
                    }}
                  >
                    Clear All
                  </button>
                </div>
                {/* Price Filter */}
                <div className="mb-4 mt-4 flex flex-col gap-2 px-2">
                  <h2 className="text-xl font-semibold"> Price</h2>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={500000}
                    step={100}
                    min={0}
                    className="mt-2 w-full"
                  />
                  <p className="mt-2 text-xs">
                    Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </p>
                </div>
                {/* Category-Specific Filters */}
                {selectedCategory && Object.keys(dynamicFilters).length > 0 && (
                  <div className="flex flex-col gap-4 capitalize">
                    {Object.entries(dynamicFilters).map(
                      ([filterName, options]) => (
                        <div key={filterName} className="px-2">
                          <h2 className="text-xl font-semibold capitalize">
                            {filterName}
                          </h2>
                          <div className="mt-2 flex flex-col gap-2">
                            {options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Checkbox
                                  checked={
                                    filterState[filterName]?.includes(option) ||
                                    false
                                  }
                                  onCheckedChange={() =>
                                    handleFilterChange(filterName, option)
                                  }
                                />
                                {option}
                              </label>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="mx-auto mt-8 w-full py-4">
                  <img
                    className="mx-auto h-[45vh] w-[52] rounded-lg object-center lg:w-full"
                    src="/ban.png"
                    alt="banner"
                  />
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}

// {/* <nav className="text-lg font-medium">
// <div className="flex w-full flex-col px-2.5">
//   <p className="text-md p-2 text-secondary">Categories</p>

//   <Accordion type="single" className="mt-4" collapsible>
//     {/* All Products */}
//     <AccordionItem className="!border-none" value="all-products">
//       <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b p-2 text-[16px] shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
//         All Products
//         <ChevronRight className="w-4 shrink-0 text-secondary/50" />
//       </AccordionTrigger>
//       <AccordionContent className="flex flex-col rounded-md">
//         {subCategory.map((subcategory) => (
//           <button
//             key={subcategory._id}
//             onClick={() =>
//               navigate(
//                 `/shop/${subcategory.categoryId}/${subcategory._id}`,
//               ) && isSetSheetOpen(false)
//             }
//             className="!justify-start !p-2 text-left hover:text-primary"
//           >
//             {subcategory.name}
//           </button>
//         ))}
//       </AccordionContent>
//     </AccordionItem>

//     {/* Categories with Subcategories */}
//     {categorySubcategoryMap.map((category) => (
//       <AccordionItem
//         className="!border-none"
//         value={category._id}
//         key={category._id}
//       >
//         <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b border-secondary/15 p-2 text-[16px] shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
//           {category.name}
//           <ChevronRight className="w-4 shrink-0 text-secondary/50" />
//         </AccordionTrigger>
//         <AccordionContent className="flex flex-col rounded-md">
//           {category.subcategories.map((subcategory) => (
//             <button
//               key={subcategory._id}
//               onClick={() =>
//                 navigate(
//                   `/shop/${subcategory.categoryId}/${subcategory._id}`,
//                 ) && isSetSheetOpen(false)
//               }
//               className="!justify-start !p-2 text-left hover:text-primary"
//             >
//               {subcategory.name}
//             </button>
//           ))}
//         </AccordionContent>
//       </AccordionItem>
//     ))}
//   </Accordion>
//   <h1 className="mb-4 mt-8 px-2 text-xl"> Price</h1>
//   <Slider
//     value={priceRange}
//     onValueChange={handlePriceChange} // Update on change
//     max={500000}
//     step={100}
//     min={0}
//     className="w-full px-2"
//   />
//   <p className="mt-3 px-2 text-xs">
//     Price: ₹{priceRange[0]} - ₹{priceRange[1]}
//   </p>
//   <div className="mt-8 py-4">
//     <img
//       className="h-[45vh] w-[300px] rounded-lg object-center"
//       src="/ban.png"
//       alt="banner"
//     />
//   </div>
// </div>
// </nav> */}
