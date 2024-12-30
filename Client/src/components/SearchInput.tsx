import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import { Search } from "lucide-react";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function SearchInput({ button }: { button?: ReactNode }) {
  const [query, setQuery] = React.useState("");
  const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");

  const product = useSelector(
    (state: RootState) => state.product.product || [],
  );
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

  const productsData = React.useMemo(() => {
    return product
      ?.filter((product: Products) => product !== null && product !== undefined) // Filter out null or undefined entries
      .filter((product: Products) => {
        // Check if the user is a wholesaler and filter accordingly
        return user?.isWholesaler
          ? product.productType === "wholesale"
          : product.productType !== "wholesale";
      })
      .map((product: any) => ({
        id: product._id,
        image: product.image[0],
        name: product.name,
        category: categoryLookup.get(product.categoryId) || "NA",
        subCategory: subCategoryLookup.get(product.sub_categoryId) || "NA",
        status: product.status,
        brandName: product.brandName,
        productType: product.productType,
        wholesalePrice: product.wholesalePrice,
        salePrice: product.salePrice,
        price: product.price,
        createdAt: new Date(product.createdAt).toISOString().split("T")[0], // Use product's created date
      }));
  }, [product, user, categoryLookup, subCategoryLookup]);

  const [filteredData, setFilteredData] = React.useState(productsData);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearch(value);

    if (value.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    setShowDropdown(false);
  };

  const handleSearchClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault(); // Prevent default form submission if inside a form
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`); // Navigate to the search page with the query parameter
      setIsSheetOpen(false); // Close the sheet if open
    }
  };
  React.useEffect(() => {
    // Ensure filteredData updates whenever productsData or search changes
    if (search.trim()) {
      setFilteredData(
        productsData.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setFilteredData(productsData);
    }
  }, [productsData, search]);
  return (
    <>
      {!button ? (
        <div className="relative h-auto w-full">
          <div className="group relative flex h-10 w-full items-center overflow-hidden rounded-lg border bg-background text-neutral-500 shadow-sm">
            <Select
            // onValueChange={(e) => setSelectedCategory(e)}
            >
              <SelectTrigger className="w-[300px] rounded-none">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent defaultValue="All Categories">
                {category.map((item, index) => (
                  <SelectItem key={index} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <div className="h-full w-full"> */}
            <Input
              type="text"
              placeholder="Search for atta dal and more."
              autoFocus
              className="ml-1 h-full w-full rounded-none border-none bg-transparent outline-none focus-visible:ring-0"
              value={query}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSearchClick(e); // Trigger search on Enter key press
                }
              }}
              onChange={handleOnChange}
              onFocus={() => setShowDropdown(!!query.trim())}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {/* </div> */}
            <Button
              onClick={handleSearchClick}
              className="items-center justify-center rounded-lg bg-primary text-primary-foreground"
            >
              <Search size={20} /> Search
            </Button>
          </div>
          {/* Dropdown for categories */}
          {showDropdown && (
            <div className="absolute -left-20 top-full z-50 grid max-h-[40vh] w-[800px] grid-cols-2 overflow-auto rounded-lg border bg-background p-6 shadow-lg">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <Link
                    key={index}
                    onClick={() => handleCategoryClick(item.category)}
                    to={`/product/${item.id}`}
                    className="group relative flex flex-col gap-6 rounded-lg"
                  >
                    <div className="flex cursor-pointer items-center justify-start gap-4 px-10 py-2 text-sm hover:bg-primary/30">
                      <img
                        src={item.image}
                        className="w-20 object-center duration-300 group-hover:scale-105"
                      />
                      <div className="flex flex-col">
                        <p className="max-w-60 truncate font-semibold">
                          {item.name}
                        </p>
                        <p className="flex w-full flex-col font-bold">
                          ₹{item.price ? item.price : item.wholesalePrice}
                          <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
                            ₹{item.salePrice}
                          </del>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No categories found.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}
        >
          <SheetTrigger className="">{button}</SheetTrigger>
          <SheetContent side="top" className="pt-8">
            <div className="relative h-auto">
              <div className="group flex h-12 w-full items-center overflow-hidden rounded-full bg-background text-neutral-500 shadow-sm">
                <div className="m-1 flex h-full items-center justify-center rounded-full p-2">
                  <Search size={20} />
                </div>
                <div className="h-full w-full">
                  <Input
                    type="text"
                    placeholder="Search for atta dal and more."
                    autoFocus
                    className="h-full w-full bg-transparent outline-none"
                    value={query}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        handleSearchClick(e); // Trigger search on Enter key press
                      }
                    }}
                    onChange={handleOnChange}
                    onFocus={() => setShowDropdown(!!query.trim())}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </div>

                <Button
                  onClick={handleSearchClick}
                  variant="default"
                  className="text-md !justify-start gap-4 rounded-full shadow-md"
                >
                  <Search size={20} /> Search
                </Button>
              </div>
              {/* Dropdown for categories */}
              {showDropdown && (
                <div className="absolute left-0 top-full z-50 grid max-h-[60vh] overflow-auto rounded-lg border bg-background p-6 shadow-lg md:-left-10 md:w-full md:grid-cols-2">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <Link
                        key={index}
                        onClick={() => handleCategoryClick(item.category)}
                        to={`/product/${item.id}`}
                        className="group relative flex flex-col gap-6 rounded-lg"
                      >
                        <div className="flex cursor-pointer items-center justify-start gap-4 px-10 py-2 text-sm hover:bg-primary/30">
                          <img
                            src={item.image}
                            className="w-20 object-center duration-300 group-hover:scale-105"
                          />
                          <div className="flex flex-col">
                            <p className="max-w-60 truncate font-semibold">
                              {item.name}
                            </p>
                            <p className="flex w-full flex-col font-bold">
                              ₹{item.price ? item.price : item.wholesalePrice}
                              <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
                                ₹{item.salePrice}
                              </del>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
