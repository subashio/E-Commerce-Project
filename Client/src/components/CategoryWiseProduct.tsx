// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { createLookup } from "@/lib/lookUpMap";
// import { RootState } from "@/store/store";
// import React from "react";
// import { useSelector } from "react-redux";
// import MaxWidthWrapper from "./MaxWidthWrapper";
// import ProductCardVariant from "./ProductCardVariant";

// export default function CategoryWiseProduct() {
//   const product = useSelector(
//     (state: RootState) => state.product.product || [],
//   );
//   const category = useSelector(
//     (state: RootState) => state.product.category || [],
//   );

//   const categoryTypes = [
//     { label: "Mobile ", value: "Mobile " },
//     { label: "Tablets", value: "Tablets" },
//     { label: "Laptops", value: "Laptops" },
//     { label: "Desktops", value: "Desktops" },
//   ];

//   const categoryLookup = React.useMemo(
//     () => createLookup(category, "_id", "name"),
//     [category],
//   );
//   const user = useSelector((state: RootState) => state.user.currentUser);

//   // Helper function to calculate discount percentage
//   const calculateDiscountPercentage = (
//     listPrice: number,
//     salePrice: number,
//   ): number => {
//     if (!listPrice || !salePrice || listPrice <= salePrice) return 0;
//     return Math.round(((listPrice - salePrice) / listPrice) * 100);
//   };
//   const products = React.useMemo(() => {
//     return product
//       .filter((product: any) => product !== null && product !== undefined) // Filter out null or undefined entries
//       .filter((product: any) => {
//         // Check if the user is a wholesaler and filter accordingly
//         if (user?.isWholesaler) {
//           return product.productType === "wholesale";
//         } else {
//           return product.productType !== "wholesale";
//         }
//       })
//       .map((product: any) => {
//         const discount = calculateDiscountPercentage(
//           product.salePrice,
//           product.price,
//         );

//         return {
//           _id: product._id,
//           name: product.name || "Unknown Product",
//           discount: discount > 0 ? `${discount}%` : null,
//           to: "/",
//           image: product.image?.[0] || "default.jpg",
//           category:
//             categoryLookup.get(product.categoryId) || "Unknown Category",
//           price: product.price || 0,
//           salePrice: product.salePrice || 0,
//           wholesalePrice: product.wholesalePrice || 0,
//           status: product.status ?? false,
//         };
//       });
//   }, [product, categoryLookup, user]);
//   return (
//     <div className="rounded-lg bg-secondary/5 md:p-6">
//       <MaxWidthWrapper className="w-full">
//         <h1 className="flex items-center gap-3 px-2 py-2 text-xl font-medium md:text-3xl">
//           Recommended for you
//         </h1>

//         <Tabs defaultValue="account" className="my-4 w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-transparent pl-2 md:grid-cols-10">
//             {categoryTypes.map((item, index) => (
//               <TabsTrigger
//                 className="bg-transparent text-sm"
//                 value={item.label}
//               >
//                 {item.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//           <TabsContent
//             value="Mobile "
//             className="mt-6 grid gap-4 sm:grid-cols-2 md:p-6 lg:grid-cols-3"
//           >
//             {products
//               ?.filter((item) => item.status === true)
//               .slice(0, 6)
//               .map((item, index) => (
//                 <ProductCardVariant
//                   discount={item.discount}
//                   _id={item._id}
//                   key={index}
//                   category={item.category}
//                   name={item.name}
//                   image={item.image}
//                   price={user?.isWholesaler ? item.wholesalePrice : item.price}
//                   salePrice={item.salePrice}
//                   //   className="flex-shrink-0 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-[24%]"
//                 />
//               ))}
//           </TabsContent>
//         </Tabs>
//       </MaxWidthWrapper>
//     </div>
//   );
// }

export default function CategoryWiseProduct() {
  return <div>CategoryWiseProduct</div>;
}
