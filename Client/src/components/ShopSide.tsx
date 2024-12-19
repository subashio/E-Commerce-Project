import { RootState } from "@/store/store";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Slider } from "./ui/slider";

export default function ShopSide({
  setPriceRange,
}: {
  setPriceRange: (range: [number, number]) => void;
}) {
  const [priceRange, setLocalPriceRange] = React.useState<[number, number]>([
    0, 500000,
  ]);
  const navigate = useNavigate();

  // Function to handle slider value change
  const handlePriceChange = (value: [number, number]) => {
    setLocalPriceRange(value);
    setPriceRange(value); // Update the parent component's state
  };
  // Redux selectors
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );

  // Map subcategories to their respective categories
  const categorySubcategoryMap = category.map((category) => ({
    ...category,
    subcategories: subCategory.filter((sub) => sub.categoryId === category._id),
  }));

  return (
    <aside className="hidden max-h-screen w-full flex-col lg:flex">
      <nav className="text-lg font-medium">
        <div className="flex w-full flex-col">
          <p className="text-md px-2 text-secondary">Categories</p>

          <Accordion type="single" className="my-4" collapsible>
            {/* All Products */}
            <AccordionItem className="!border-none" value="all-products">
              <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b p-2 text-sm shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
                All Products
                <ChevronRight className="w-4 shrink-0 text-secondary/50" />
              </AccordionTrigger>
              <AccordionContent className="flex flex-col">
                {subCategory.map((subcategory) => (
                  <button
                    key={subcategory._id}
                    onClick={() =>
                      navigate(
                        `/shop/${subcategory.categoryId}/${subcategory._id}`,
                      )
                    }
                    className="!justify-start !p-2 text-left hover:text-primary"
                  >
                    {subcategory.name}
                  </button>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Categories with Subcategories */}
            {categorySubcategoryMap.map((category) => (
              <AccordionItem
                className="!border-none"
                value={category._id}
                key={category._id}
              >
                <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b border-secondary/15 p-2 text-sm shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
                  {category.name}
                  <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col rounded-md">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      to={`/shop/${subcategory.categoryId}/${subcategory._id}`}
                      key={subcategory._id}
                      className="!justify-start !p-2 text-left hover:text-primary"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <h1 className="mb-4 mt-8 px-2 text-xl"> Price</h1>
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange} // Update on change
            max={500000}
            step={100}
            min={0}
            className="w-full px-2"
          />
          <p className="mt-3 px-2 text-xs">
            Price: ₹{priceRange[0]} - ₹{priceRange[1]}
          </p>
          <div className="mt-8 py-4">
            <img
              className="h-[45vh] w-full rounded-lg object-center"
              src="/ban.png"
              alt="banner"
            />
          </div>
        </div>
      </nav>
    </aside>
  );
}
