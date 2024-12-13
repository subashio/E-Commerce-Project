import DashboardHeader from "@/components/DashboardHeder";
import DashboardSide from "@/components/DashboardSide";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import React from "react";
import { Outlet } from "react-router-dom";

export default function Dasboard() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <GlobleContextProvider>
      <div>
        <div className="grid w-full xl:grid-cols-[300px_1fr]">
          <div className="hidden justify-center rounded-lg border-r xl:flex xl:min-h-screen">
            <DashboardSide />
          </div>
          <div className="flex w-full flex-col">
            <div className="sticky top-0 z-50 flex h-16 items-center justify-center border-b bg-background px-5 transition-all duration-200 xl:items-start xl:px-5">
              <DashboardHeader />
            </div>
            <div className="px-5">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </GlobleContextProvider>
  );
}
