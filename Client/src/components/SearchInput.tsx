import { createLookup } from "@/lib/lookUpMap";
import { RootState } from "@/store/store";
import { Search } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export default function SearchInput() {
  const [query, setQuery] = React.useState("");
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
  const user = useSelector((state: RootState) => state.user.currentUser);

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );
  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );

  const productsData = React.useMemo(() => {
    return product
      ?.filter((product: Products) => product !== null && product !== undefined)
      .filter((product: Products) =>
        user?.isWholesaler
          ? product.productType === "wholesale"
          : product.productType !== "wholesale",
      )
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
        searchTags: product.searchTags || [], // Ensure searchTags is an array
        price: product.price,
        createdAt: new Date(product.createdAt).toISOString().split("T")[0],
      }));
  }, [product, user, categoryLookup, subCategoryLookup]);

  // Extract unique search tags from all products
  const allSearchTags = React.useMemo(() => {
    return [...new Set(productsData.flatMap((p) => p.searchTags))]; // Flatten and remove duplicates
  }, [productsData]);

  // // Filter products based on search input
  // const filteredData = React.useMemo(() => {
  //   if (!search.trim()) return productsData;
  //   return productsData.filter((item) =>
  //     item.name.toLowerCase().includes(search.toLowerCase()),
  //   );
  // }, [productsData, search]);

  const filteredData = React.useMemo(() => {
    if (!search.trim()) return productsData;

    return productsData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.searchTags.some((tag: string) =>
            tag.toLowerCase().includes(search.toLowerCase()),
          ),
      )
      .sort((a, b) => {
        const aStartsWith = a.name
          .toLowerCase()
          .startsWith(search.toLowerCase());
        const bStartsWith = b.name
          .toLowerCase()
          .startsWith(search.toLowerCase());

        if (aStartsWith && !bStartsWith) return -1; // a comes first
        if (!aStartsWith && bStartsWith) return 1; // b comes first

        return a.name.localeCompare(b.name); // Default alphabetical order
      });
  }, [productsData, search]);

  // Filter search tags based on query
  const filteredSearchTags = React.useMemo(() => {
    if (!query.trim()) return [];

    return allSearchTags
      .filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const aStartsWith = a.toLowerCase().startsWith(query.toLowerCase());
        const bStartsWith = b.toLowerCase().startsWith(query.toLowerCase());

        if (aStartsWith && !bStartsWith) return -1; // a comes first
        if (!aStartsWith && bStartsWith) return 1; // b comes first

        return a.localeCompare(b); // Default alphabetical order
      });
  }, [query, allSearchTags]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearch(value);
    setShowDropdown(value.trim() !== "");
  };

  const handleSearchClick = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setSearch(tag);
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  const location = useLocation();

  React.useEffect(() => {
    setQuery("");
    setSearch("");
  }, [location.pathname]);

  return (
    <div className="relative z-[52] h-auto w-full">
      <div className="group flex h-10 w-full items-center gap-1 overflow-hidden rounded-full border bg-background px-4 py-2 font-semibold text-secondary shadow-sm">
        <button
          onClick={handleSearchClick}
          className="items-center justify-center rounded-full text-secondary"
        >
          <Search className="w-5" />
        </button>
        <Input
          type="text"
          placeholder="Search for Mobiles, Accessories & more.."
          autoFocus
          className="!focus-visible:ring-0 h-full w-full rounded-none border-none outline-none focus-visible:ring-0"
          value={query}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick(e)}
          onChange={handleOnChange}
          onFocus={() => setShowDropdown(!!query.trim())}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full z-[52] grid w-full overflow-auto rounded-lg border bg-background p-6 shadow-lg lg:w-[800px]">
          <ScrollArea className="max-h-[70vh] w-full">
            <div className="flex flex-col gap-4">
              {/* Display matching search tags */}
              {filteredSearchTags.length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-secondary">
                    Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-x-2 gap-y-4">
                    {filteredSearchTags.slice(0, 10).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagClick(tag)}
                        className="flex cursor-pointer gap-1 rounded-lg bg-primary/5 p-1.5 px-2 text-xs font-medium capitalize text-primary hover:bg-primary/10"
                      >
                        {tag}
                        {/* <span>
                    <TrendingUp className="h-4 w-4" />
                  </span> */}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <h3 className="text-sm font-semibold text-secondary">Products</h3>
              {/* Display filtered products */}
              <div className="grid grid-cols-1 place-content-center gap-4 md:grid-cols-2">
                {filteredData.length > 0 ? (
                  filteredData.slice(0, 15).map((item, index) => (
                    <Link
                      key={index}
                      to={`/product/${item.name}`}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="group flex flex-col gap-6 rounded-lg border border-primary/10"
                    >
                      <div className="flex cursor-pointer items-center justify-start gap-4 p-2 text-sm hover:bg-primary/10">
                        <img
                          src={item.image}
                          className="w-20 object-center duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                          <p className="max-w-60 truncate font-semibold">
                            {item.name}
                          </p>
                          <p className="flex w-full flex-col font-bold">
                            ₹{item.price || item.wholesalePrice}
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
                    No products found.
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

{
  /* <Select
            onValueChange={(e) => setSelectedCategory(e)}
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
            </Select> */
}

{
  /* <div className="h-full w-full"> */
}

//   <Sheet
//     open={isSheetOpen}
//     onOpenChange={(isOpen) => setIsSheetOpen(isOpen)}
//   >
//     <SheetTrigger className="">{button}</SheetTrigger>
//     <SheetContent side="top" className="pt-8">
//       <div className="relative h-auto">
//         <div className="group flex h-12 w-full items-center overflow-hidden rounded-full bg-background text-neutral-500 shadow-sm">
//           <div className="m-1 flex h-full items-center justify-center rounded-full p-2">
//             <Search size={20} />
//           </div>
//           <div className="h-full w-full">
//             <Input
//               type="text"
//               placeholder="Search for atta dal and more."
//               autoFocus
//               className="h-full w-full bg-transparent outline-none"
//               value={query}
//               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
//                 if (e.key === "Enter") {
//                   handleSearchClick(e); // Trigger search on Enter key press
//                 }
//               }}
//               onChange={handleOnChange}
//               onFocus={() => setShowDropdown(!!query.trim())}
//               onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//             />
//           </div>

//           <Button
//             onClick={handleSearchClick}
//             variant="default"
//             className="text-md !justify-start gap-4 rounded-full shadow-md"
//           >
//             <Search size={20} /> Search
//           </Button>
//         </div>
//         {/* Dropdown for categories */}
//         {showDropdown && (
//           <div className="absolute left-0 top-full z-50 grid max-h-[60vh] overflow-auto rounded-lg border bg-background p-6 shadow-lg md:-left-10 md:w-full md:grid-cols-2">
//             {filteredData.length > 0 ? (
//               filteredData.map((item, index) => (
//                 <Link
//                   key={index}
//                   onClick={() => handleCategoryClick(item.category)}
//                   to={`/product/${item.id}`}
//                   className="group relative flex flex-col gap-6 rounded-lg"
//                 >
//                   <div className="flex cursor-pointer items-center justify-start gap-4 px-10 py-2 text-sm hover:bg-primary/30">
//                     <img
//                       src={item.image}
//                       className="w-20 object-center duration-300 group-hover:scale-105"
//                     />
//                     <div className="flex flex-col">
//                       <p className="max-w-60 truncate font-semibold">
//                         {item.name}
//                       </p>
//                       <p className="flex w-full flex-col font-bold">
//                         ₹{item.price ? item.price : item.wholesalePrice}
//                         <del className="text-xs text-secondary/50 dark:text-secondary-foreground/70">
//                           ₹{item.salePrice}
//                         </del>
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="px-4 py-2 text-sm text-gray-500">
//                 No categories found.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </SheetContent>
//   </Sheet>
