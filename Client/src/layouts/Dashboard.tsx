import DashboardHeader from "@/components/DashboardHeder";
import DashboardSide from "@/components/DashboardSide";
import GlobleContextProvider from "@/context/GlobleContextProvider";
import { Outlet } from "react-router-dom";

export default function Dasboard() {
  return (
    <GlobleContextProvider>
      <div>
        <div className="grid w-full xl:grid-cols-[300px_1fr]">
          <div className="hidden justify-center rounded-lg border-r xl:flex xl:min-h-screen">
            <DashboardSide />
          </div>
          <div className="flex w-full flex-col">
            <div className="flex h-16 items-center justify-center border-b px-5 xl:items-start xl:px-5">
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
