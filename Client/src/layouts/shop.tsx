import Breadcrumbs from "@/components/Breadcrumbs";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ShopHeader from "@/components/ShopHeader";
import ShopSide from "@/components/ShopSide";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import { ThemeProvider } from "@/context/theme-provider";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useParams } from "react-router-dom";

export default function Shop() {
  const { id } = useParams<{ id: string }>();
  const [categoryName, setCategoryName] = React.useState<string>("");

  const categoryList = useSelector(
    (state: RootState) => state.product.categoryList,
  );
  // Set category name based on the category ID in the URL
  React.useEffect(() => {
    if (id) {
      const category = categoryList.find((category) => category._id === id);
      if (category) {
        setCategoryName(category.name);
      } else {
        setCategoryName("Category");
      }
    }
    window.scrollTo(0, 0);
  }, [id, categoryList]);
  const location = useLocation();

  return (
    <GlobleContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Breadcrumbs
          className="mx-36 my-8"
          path="/shop"
          pathName="shop"
          finalPathName={
            location.pathname == "/shop" ? "All Produts" : `${categoryName}`
          }
        />
        <MaxWidthWrapper className="mx-36 mb-10 flex h-24 max-w-screen-2xl flex-col items-center justify-center rounded-xl bg-primary/10 text-3xl font-semibold">
          {location.pathname == "/shop" ? "All Produts" : `${categoryName}`}
        </MaxWidthWrapper>
        <MaxWidthWrapper className="grid w-full grid-flow-col">
          <div className="col-span-0 hidden justify-center rounded-lg border-r md:w-[300px] lg:flex lg:min-h-screen lg:w-[250px]">
            <ShopSide />
          </div>
          <div className="col-span-12 flex w-full flex-col">
            <ShopHeader />
            <div className="px-5">
              <Outlet />
            </div>
          </div>
        </MaxWidthWrapper>
      </ThemeProvider>
    </GlobleContextProvider>
  );
}
