import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GlobleContextProvider from "./context/GlobleContextProvider";

export default function () {
  const location = useLocation();

  return (
    <GlobleContextProvider>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        {location.pathname === "/" && <Footer />}
      </div>
    </GlobleContextProvider>
  );
}
