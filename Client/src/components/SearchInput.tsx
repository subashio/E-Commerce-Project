import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { Search } from "lucide-react";

export default function SearchInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = React.useState(false);

  React.useEffect(() => {
    setIsSearchPage(location.pathname === "/search");
  }, [location]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    navigate(`/search?q=${value}`);
  };

  return (
    <div className="group flex h-11 w-full min-w-[300px] items-center overflow-hidden rounded-lg border bg-slate-50 text-neutral-500 lg:h-12">
      <Link
        to="/"
        className="m-1 flex h-full items-center justify-center rounded-full p-2"
      >
        <Search size={20} />
      </Link>
      {/* input for mobile */}
      <div className="h-full w-full">
        {!isSearchPage ? (
          // Not on the search page
          <div
            onClick={() => navigate("/search")}
            className="flex h-full w-full cursor-pointer items-center"
          >
            <TypeAnimation
              sequence={[
                'Search "milk"',
                1000,
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "paneer"',
                1000,
                'Search "chocolate"',
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          // On the search page
          <input
            type="text"
            placeholder="Search for atta dal and more."
            autoFocus
            className="h-full w-full bg-transparent outline-none"
            onChange={handleOnChange}
            defaultValue={new URLSearchParams(location.search).get("q") || ""}
          />
        )}
      </div>
    </div>
  );
}
