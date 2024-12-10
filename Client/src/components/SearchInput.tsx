import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const categories = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Smartwatches",
  "Headphones",
  "Bluetooth Speakers",
  "Digital Cameras",
  "Gaming Consoles",
  "Smart TVs",
  "Home Automation Devices",
];

export default function SearchInput() {
  const [query, setQuery] = React.useState("");
  const [filteredCategories, setFilteredCategories] = React.useState<string[]>(
    [],
  );
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setFilteredCategories(
        categories.filter((category) =>
          category.toLowerCase().includes(value.toLowerCase()),
        ),
      );
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setQuery(category);
    setShowDropdown(false);
  };

  const handleSearchClick = (e: any) => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      e.preventDefault();
    }
  };

  return (
    <div className="relative h-auto w-full">
      <div className="group relative flex h-12 w-full min-w-[300px] items-center overflow-hidden rounded-full bg-background text-neutral-500 shadow-sm">
        <div className="m-1 flex h-full items-center justify-center rounded-full p-2">
          <Search size={20} />
        </div>
        <div className="h-full w-full">
          <input
            type="text"
            placeholder="Search for atta dal and more."
            autoFocus
            className="h-full w-full bg-transparent outline-none"
            value={query}
            onChange={handleOnChange}
            onFocus={() => setShowDropdown(!!query.trim())}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
        </div>
        <Button
          onClick={handleSearchClick}
          variant="default"
          className="text-md !justify-start gap-4 rounded-full shadow-md"
        >
          <Search size={20} /> Search
        </Button>
      </div>
      {/* Dropdown for categories */}
      {showDropdown && (
        <div className="absolute left-0 top-full z-50 max-h-40 w-full overflow-auto rounded-md border bg-background shadow-lg">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/30"
              >
                {category}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No categories found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
