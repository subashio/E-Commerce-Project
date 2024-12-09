import { Outlet, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GlobleContextProvider from "./context/GlobleContextProvider";
import { ThemeProvider } from "./context/theme-provider";

export default function () {
  const location = useLocation();

  return (
    <GlobleContextProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="relative flex min-h-screen flex-col overflow-visible font-sans">
          <Navbar />
          <main className="flex-grow">
            <Outlet />
          </main>
          {location.pathname === "/" && <Footer />}
        </div>
      </ThemeProvider>
    </GlobleContextProvider>
  );
}
