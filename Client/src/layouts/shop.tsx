import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ShopHeader from "@/components/ShopHeader";
import ShopSide from "@/components/ShopSide";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import { Outlet } from "react-router-dom";

export default function Shop() {
  return (
    <GlobleContextProvider>
      <MaxWidthWrapper className="grid w-full grid-flow-col">
        <div className="col-span-0 hidden justify-center rounded-lg border-r md:w-[300px] lg:flex lg:min-h-screen lg:w-[400px]">
          <ShopSide />
        </div>
        <div className="col-span-12 flex w-full flex-col">
          <div className="m-10 flex h-24 flex-col items-center justify-center gap-2 rounded-xl bg-primary/10 px-5 text-3xl font-semibold lg:px-5">
            Snacks & Munchies
          </div>
          <ShopHeader />
          <div className="px-5">
            <Outlet />
          </div>
        </div>
      </MaxWidthWrapper>
    </GlobleContextProvider>
  );
}
