import { Card } from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const productList = useSelector(
    (state: RootState) => state.product.productList,
  );

  // Filter the data based on the query
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(query),
  );

  return (
    <div className="block p-4">
      <h1 className="text-xl font-semibold">Search Results</h1>
      <div className="mt-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product: any) => (
              <Link to="/" className="border-none p-6" key={product._id}>
                <Card className="mt-6 flex w-full flex-col items-center p-4">
                  <img src={product.image[0]} className="mx-auto h-32 w-32" />
                  <div className="mt-4">
                    <h1 className="text-xs">{product.category}</h1>
                    <h1 className="text-md font-bold">{product.name}</h1>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
}
