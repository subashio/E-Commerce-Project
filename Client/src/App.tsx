import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GlobleContextProvider from "./context/GlobleContextProvider";

export default function () {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <GlobleContextProvider>
      <div className="relative flex min-h-screen flex-col overflow-visible scroll-smooth font-sans">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        {location.pathname == "/" && <Footer />}
        {/* <Footer /> */}
      </div>
    </GlobleContextProvider>
  );
}
