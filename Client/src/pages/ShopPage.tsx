import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import React from "react";
import { useParams } from "react-router-dom";

export default function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const [products, setProduct] = React.useState([]);
  const fetchProductByCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.filter_product_by_category,
        params: {
          id: id, // Make sure this is correctly passed
        },
      });

      if (response.data?.data) {
        setProduct(response.data.data);
        console.log("this is the filter data : ", response.data);
      }
    } catch (error) {
      console.error("error fetching product by categoryId");
    }
  };
  React.useEffect(() => {
    if (id) {
      fetchProductByCategory();
    }
  }, [id]);
  return (
    <div className="mx-6">
      <h1>Shop - {id}</h1>
      <p>Showing products for: {id}</p>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div>
          <ul>
            {products.map((product: any) => (
              <li key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>${product.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
