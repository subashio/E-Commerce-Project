import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Slider } from "./ui/slider";

export default function ShopSide({
  setPriceRange,
  setFilters, // Function to update filters in parent component
}: {
  setPriceRange: (range: [number, number]) => void;
  setFilters: (filters: Record<string, string[]>) => void;
}) {
  const [priceRange, setLocalPriceRange] = React.useState<[number, number]>([
    0, 500000,
  ]);

  const { categoryId, subCategoryId } = useParams<{
    categoryId?: string;
    subCategoryId?: string;
  }>();

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

  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    setPriceRange(value);
  };

  const decodedCategoryName = categoryId ? decodeURIComponent(categoryId) : "";
  const decodedSubcategoryName = subCategoryId
    ? decodeURIComponent(subCategoryId)
    : "";

  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase() === decodedCategoryName.toLowerCase(),
  );
  const selectedCategoryId = selectedCategory?._id;

  const selectedSubcategory = subCategories.find(
    (sub) => sub.name.toLowerCase() === decodedSubcategoryName.toLowerCase(),
  );
  const selectedSubcategoryId = selectedSubcategory?._id;

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
    <aside className="sticky top-20 z-10 hidden max-h-screen w-full flex-col overflow-y-auto lg:flex">
      <ScrollArea className="text-lg font-medium">
        <div className="flex w-full flex-col">
          <Link to="/shop" className="text-md px-2 text-secondary">
            Categories
          </Link>

          <Accordion
            type="single"
            className="my-4"
            collapsible
            defaultValue={selectedCategoryId || ""}
          >
            {!categoryId
              ? categories.map((cat, index) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    key={cat._id}
                    href={`/shop/${encodeURIComponent(cat.name)}`}
                    className="flex w-full items-center justify-between gap-3 border-b border-secondary/15 p-2 text-sm transition-transform duration-300 hover:text-primary"
                  >
                    {cat.name}
                    <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                  </motion.a>
                ))
              : selectedCategory && (
                  <AccordionItem
                    className="!border-none"
                    value={selectedCategory._id}
                  >
                    <AccordionTrigger className="flex items-center gap-3 border-b border-secondary/15 p-2 text-sm transition-transform duration-300 hover:text-primary hover:no-underline">
                      {selectedCategory.name}
                      <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col rounded-md">
                      {filteredSubCategories.length > 0 ? (
                        filteredSubCategories
                          .slice() // Avoid mutating original state
                          .sort((a, b) => b._id.localeCompare(a.name))
                          .map((sub, index) => (
                            <motion.a
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                              href={`/shop/${encodeURIComponent(selectedCategory.name)}/${encodeURIComponent(sub.name)}`}
                              key={sub._id}
                              className="!justify-start !p-2 text-left hover:text-primary"
                            >
                              {sub.name}
                            </motion.a>
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
              {Object.entries(dynamicFilters).map(([filterName, options]) => (
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
                            filterState[filterName]?.includes(option) || false
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
              ))}
            </div>
          )}

          <div className="mt-8 py-4">
            <img
              className="h-[45vh] w-full rounded-lg object-center"
              src="/ban.png"
              alt="banner"
            />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
