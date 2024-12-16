import ProductCard from "@/components/ProductCard";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const product = useSelector(
    (state: RootState) => state.product?.product || [],
  );
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );

  if (!product || !category) {
    return <p>Loading products...</p>; // Display loading message if data is not yet available
  }

  const categoryLookup = new Map(
    category.map((category: { _id: string; name: string }) => [
      category._id,
      category.name,
    ]),
  );

  // Filter products based on the category ID from the URL or show all products if no ID is given
  const filteredProducts = id
    ? product.filter((product: any) => product.categoryId === id) // If id is present, filter by category
    : product; // Otherwise, show all products

  // If no products are found
  if (filteredProducts.length === 0) {
    return <p>No products found.</p>;
  }
  const products = filteredProducts.map((product: any) => ({
    _id: product._id,
    name: product.name,
    discount: product.discount,
    to: "/",
    image: product.image[0] || "default.jpg",
    category: categoryLookup.get(product.categoryId), // Look
    price: product.price,
    salePrice: product.salePrice,
  }));

  return (
    <div className="mx-6">
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="mb-20 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product: ProductCartProps, index: number) => (
            <ProductCard
              _id={product._id}
              discount={product.discount}
              name={product.name}
              salePrice={product.salePrice}
              price={product.price}
              image={product.image}
              key={index}
              category={product.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
