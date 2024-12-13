// import { cn } from "@/lib/utils";
// import { RootState } from "@/store/store";
// import { ChevronDown } from "lucide-react";
// import { useSelector } from "react-redux";
// import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "./ui/accordion";
// import { buttonVariants } from "./ui/button";

// export default function ShopSide() {
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const categoryList = useSelector(
//     (state: RootState) => state.product.categoryList,
//   );
//   const productList = useSelector(
//     (state: RootState) => state.product.productList,
//   );
//   const subCategoryList = useSelector(
//     (state: RootState) => state.product.subcategoryList,
//   );

//   const filteredProducts = id
//     ? subCategoryList.filter((product: any) => product.categoryId === id) // If id is present, filter by category
//     : subCategoryList; // Otherwise, show all products

//   // If no products are found

//   const products = filteredProducts.map((product: any) => ({
//     _id: product._id,
//     name: product.name,
//   }));

//   return (
//     <aside className="hidden max-h-screen w-full flex-col gap-2 md:flex">
//       <div className=" ">
//         <nav className="text-lg font-medium">
//           <div className="flex w-full flex-col px-2.5">
//             <p className="p-4 text-sm text-secondary/50">Categories </p>

//             <Accordion type="single" collapsible>
//               <AccordionItem className="!border-none" value="item-1 ">
//                 <AccordionTrigger
//                   className={cn(
//                     "flex items-center gap-3 rounded-lg p-4 text-sm text-secondary/80 transition-all duration-700 hover:no-underline",
//                     location.pathname === `/shop`
//                       ? "bg-primary/20"
//                       : "hover:bg-accent",
//                   )}
//                 >
//                   <Link
//                     to="/shop"
//                     className="flex w-full justify-start hover:underline"
//                   >
//                     All Products
//                   </Link>
//                   <ChevronDown className="text-secondary/50" />
//                 </AccordionTrigger>
//                 <AccordionContent className="flex flex-col rounded-md border">
//                   {productList.map((_item, _index) => (
//                     <Link
//                       key={_index}
//                       to="#"
//                       className={cn(
//                         "!justify-start",
//                         buttonVariants({ variant: "ghost" }),
//                       )}
//                     >
//                       {_item.name}
//                     </Link>
//                   ))}
//                 </AccordionContent>
//               </AccordionItem>
//               {categoryList.map((item, index) => (
//                 <AccordionItem className="!border-none" value={item._id}>
//                   <AccordionTrigger
//                     className={cn(
//                       "flex items-center gap-3 rounded-lg p-4 text-sm transition-all duration-300 hover:no-underline",
//                       location.pathname === `/shop/${item._id}`
//                         ? "bg-primary/20"
//                         : "hover:bg-accent",
//                     )}
//                   >
//                     <Link
//                       key={index}
//                       to={`/shop/${item._id}`}
//                       className="flex w-full justify-start hover:underline"
//                     >
//                       {item.name}
//                     </Link>
//                     <ChevronDown className="text-secondary/50" />
//                   </AccordionTrigger>
//                   <AccordionContent className="flex flex-col rounded-md border">
//                     {products.map((_item, _index) => (
//                       <Link
//                         key={_index}
//                         to={`/shop/${item._id}`}
//                         className={cn(
//                           "!justify-start",
//                           buttonVariants({ variant: "ghost" }),
//                         )}
//                       >
//                         {_item.name}
//                       </Link>
//                     ))}
//                   </AccordionContent>
//                 </AccordionItem>
//               ))}
//             </Accordion>

//           </div>
//         </nav>
//       </div>
//     </aside>
//   );
// }

import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { buttonVariants } from "./ui/button";

export default function ShopSide() {
  const location = useLocation();
  const navigate = useNavigate();

  // Redux selectors
  const category = useSelector((state: RootState) => state.product.category);
  const subCategory = useSelector(
    (state: RootState) => state.product.subcategory,
  );

  // Map subcategories to their respective categories
  const categorySubcategoryMap = category.map((category) => ({
    ...category,
    subcategories: subCategory.filter((sub) => sub.categoryId === category._id),
  }));

  return (
    <aside className="hidden max-h-screen w-full flex-col gap-2 md:flex">
      <nav className="text-lg font-medium">
        <div className="flex w-full flex-col px-2.5">
          <p className="p-4 text-sm text-secondary/50">Categories</p>

          <Accordion type="single" collapsible>
            {/* All Products */}
            <AccordionItem className="!border-none" value="all-products">
              <AccordionTrigger
                className={cn(
                  "flex items-center gap-3 rounded-lg p-4 text-sm text-secondary/80 transition-all duration-700 hover:no-underline",
                  location.pathname === `/shop`
                    ? "bg-primary/20"
                    : "hover:bg-accent",
                )}
                onClick={() => navigate("/shop")}
              >
                All Products
                <ChevronDown className="text-secondary/50" />
              </AccordionTrigger>
            </AccordionItem>

            {/* Categories with Subcategories */}
            {categorySubcategoryMap.map((category) => (
              <AccordionItem
                className="!border-none"
                value={category._id}
                key={category._id}
              >
                <AccordionTrigger
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-4 text-sm transition-all duration-300 hover:no-underline",
                    location.pathname === `/shop/${category._id}`
                      ? "bg-primary/20"
                      : "hover:bg-accent",
                  )}
                  onClick={() => navigate(`/shop/${category._id}`)}
                >
                  {category.name}
                  <ChevronDown className="text-secondary/50" />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col rounded-md border">
                  {category.subcategories.map((subcategory) => (
                    <button
                      key={subcategory._id}
                      onClick={() => navigate(`/shop/${subcategory._id}`)}
                      className={cn(
                        "!justify-start p-2 text-left",
                        buttonVariants({ variant: "ghost" }),
                      )}
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
    </aside>
  );
}
