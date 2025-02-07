import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileSide from "@/components/ProfileSide";
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
        <div className="mt-48 grid w-full lg:mt-52 lg:grid-cols-[280px_1fr]">
          <div className="hidden justify-center rounded-lg border-r lg:flex lg:min-h-screen">
            <ProfileSide />
          </div>
          <div className="lg:mt-10">
            <ProfileHeader />
            <Outlet />
          </div>
        </div>
      </MaxWidthWrapper>
    </GlobleContextProvider>
  );
}
