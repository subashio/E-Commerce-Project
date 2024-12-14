import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { dashboardLinks } from "@/pages/data/links";
import { Filter } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export default function ShopHeader() {
  const [isSheetOpen, isSetSheetOpen] = React.useState<boolean>(false);
  const location = useLocation();

  return (
    <section className="relative ml-auto flex px-10">
      <div className="w-full">
        <Sheet
          open={isSheetOpen}
          onOpenChange={(isOpen) => isSetSheetOpen(isOpen)}
        >
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              Filter <Filter />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <nav className="text-lg font-medium">
              <Link to="/">
                <img src="/logo.png" className="h-20" alt="Globo-green logo" />
              </Link>
              <div className="flex w-full flex-col px-2.5">
                <p className="p-4 text-sm text-secondary/70"></p>
                {dashboardLinks.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => isSetSheetOpen(false)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-4 text-sm transition-all",
                      location.pathname === item.to
                        ? "bg-primary/20"
                        : "hover:bg-accent",
                    )}
                  >
                    {item.logo}
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
