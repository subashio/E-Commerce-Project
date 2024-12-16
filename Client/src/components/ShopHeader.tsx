import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RootState } from "@/store/store";
import { ChevronRight, Filter } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";

export default function ShopHeader() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();

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
            className="flex w-full flex-col p-0 sm:max-w-[500px]"
          >
            <h1 className="p-4 text-xl font-medium">Filter</h1>
            <nav className="text-lg font-medium">
              <div className="flex w-full flex-col px-2.5">
                <p className="text-md p-2 text-secondary">Categories</p>

                <Accordion type="single" className="mt-4" collapsible>
                  {/* All Products */}
                  <AccordionItem className="!border-none" value="all-products">
                    <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b p-2 text-[16px] shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
                      All Products
                      <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col rounded-md">
                      {subCategory.map((subcategory) => (
                        <button
                          key={subcategory._id}
                          onClick={() =>
                            navigate(
                              `/shop/${subcategory.categoryId}/${subcategory._id}`,
                            ) && isSetSheetOpen(false)
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
                      <AccordionTrigger className="flex border-spacing-1 items-center gap-3 border-b border-secondary/15 p-2 text-[16px] shadow-none transition-transform duration-300 hover:text-primary hover:no-underline">
                        {category.name}
                        <ChevronRight className="w-4 shrink-0 text-secondary/50" />
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col rounded-md">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory._id}
                            onClick={() =>
                              navigate(
                                `/shop/${subcategory.categoryId}/${subcategory._id}`,
                              ) && isSetSheetOpen(false)
                            }
                            className="!justify-start !p-2 text-left hover:text-primary"
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
