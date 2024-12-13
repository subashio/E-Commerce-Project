import MaxWidthWrapper from "@/components/MaxWidthWrapper";

import Header from "@/components/Header";
import Side from "@/components/Side";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import React from "react";
import { Outlet } from "react-router-dom";

export default function Profile() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <GlobleContextProvider>
      <MaxWidthWrapper>
        <div className="grid w-full md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden justify-center rounded-lg border-r md:flex md:min-h-screen">
            <Side />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-20 items-center gap-4 overflow-hidden rounded-lg border-b md:hidden">
              <Header />
            </div>
            <div className="md:mt-10">
              <Outlet />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </GlobleContextProvider>
  );
}
