import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import ProductForm from "@/components/ProductForm";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusTypes } from "@/constants/details";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import {
  actions,
  productColumns,
  wholesaleproductColumns,
} from "@/lib/Actions";
import Axios from "@/lib/Axios";
import { createLookup } from "@/lib/lookUpMap";
import { setProduct } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import { Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductList() {
  const location = useLocation();
  const { id: selectedId } = useParams();
  const dispatch = useDispatch();

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const { toast } = useToast();
  const product = useSelector(
    (state: RootState) => state.product?.product || [],
  );
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const subCategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );

  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  const subCategoryLookup = React.useMemo(
    () => createLookup(subCategory, "_id", "name"),
    [subCategory],
  );

  const selectedProduct =
    // React.useMemo(() => {
    product.find(
      (item) =>
        item._id === selectedId &&
        categoryLookup.has(item.categoryId) &&
        subCategoryLookup.has(item.sub_categoryId),
    );
  // }, [product, selectedId, categoryLookup, subCategoryLookup]);

  const productsData = product.map((product: any) => ({
    id: product._id,
    image: product.image[0],
    name: product.name,
    category: categoryLookup.get(product.categoryId) || "NA", // Look
    subCategory: subCategoryLookup.get(product.sub_categoryId) || "NA", // Look
    status: product.status,
    brandName: product.brandName,
    productType: product.productType,
    wholesalePrice: product.wholesalePrice,
    maxQuantity: product.maxQuantity,
    price: product.price,
    createdAt: new Date().toISOString().split("T")[0],
  }));
  const [filteredData, setFilteredData] = React.useState(productsData);

  async function filterProduct() {
    try {
      const response = await Axios({
        ...SummaryApi.fileter_product,
        params: {
          search: search || "", // Ensure this is a valid string
          status:
            status === "active"
              ? true
              : status === "disabled"
                ? false
                : undefined, // Boolean or empty
        },
      });

      if (response.data) {
        // Update Redux state and filtered data

        dispatch(setProduct(response.data.data));
        setFilteredData(
          response.data.data.map((product: any) => ({
            id: product._id,
            image: product.image[0],
            name: product.name,
            productType: product.productType,
            category: categoryLookup.get(product.categoryId),
            subCategory: subCategoryLookup.get(product.sub_categoryId),
            status: product.status,
            wholesalePrice: product.wholesalePrice,
            price: product.price,
            createdAt: new Date(product.createdAt).toISOString().split("T")[0], // Use actual date
          })),
        );
      }
    } catch (error) {}
  }
  async function handleDeleteProduct(id: string) {
    try {
      const response = await Axios({
        ...SummaryApi.delete_product,
        data: {
          _id: id,
        },
      });

      if (response.data) {
        setFilteredData(filteredData.filter((item) => item.id !== id));
        window.location.reload();
        toast({
          variant: "default",
          title: "category Removed successful ",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Token Expired login again",
      });
    }
  }
  React.useEffect(() => {
    filterProduct();
  }, [search, status]);

  let isAddProduct =
    location.pathname == "/dashboard-page/products/add-product";
  let isEditProduct =
    location.pathname == `/dashboard-page/products/edit-product/${selectedId}`;
  const renderActions = (id: string) =>
    actions(id, "products/edit-product", handleDeleteProduct);
  console.log(selectedProduct?.variantId);
  return (
    <div className="relative mt-10 w-full">
      <div className="flex flex-wrap items-center justify-between gap-y-4 pb-10 pt-10 md:pb-10 md:pt-0">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold">
            {isAddProduct && !isEditProduct
              ? "Add New Product"
              : !isAddProduct && isEditProduct
                ? "Edit Product"
                : "Products"}
          </h1>

          <DashboardBreadcrumb
            pathName="Product"
            path="products"
            isAdd={isAddProduct}
            isEdit={isEditProduct}
          />
        </div>
        {!isAddProduct && !isEditProduct ? (
          <Link
            to="/dashboard-page/products/add-product"
            className="group flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary/50 hover:bg-white hover:text-black"
          >
            Add Product
            <Plus className="p-1 transition-all duration-300 group-hover:rotate-180" />
          </Link>
        ) : (
          <Link
            to="/dashboard-page/products"
            className="flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-secondary hover:bg-white hover:text-black"
          >
            Back
          </Link>
        )}
      </div>
      {isAddProduct ? (
        <ProductForm />
      ) : isEditProduct ? (
        <ProductForm
          id={selectedId}
          initialData={
            selectedProduct
              ? {
                  name: selectedProduct.name,
                  image: selectedProduct.image,
                  categoryId: selectedProduct.categoryId,
                  sub_categoryId: selectedProduct.sub_categoryId,
                  wholesalePrice: selectedProduct.wholesalePrice,
                  stock: selectedProduct.stock,
                  status: selectedProduct.status,
                  price: selectedProduct.price,
                  salePrice: selectedProduct.salePrice,
                  brandName: selectedProduct.brandName,
                  maxQuantity: selectedProduct.maxQuantity,
                  minQuantity: selectedProduct.minQuantity,
                  description: selectedProduct.description,
                  filterOptions: selectedProduct.filterOptions,
                  searchTags: selectedProduct.searchTags,
                  role: "edit",
                  specifications: selectedProduct.specifications,
                  variantId: selectedProduct?.variantId,
                  productType: selectedProduct.productType || "retail",
                }
              : undefined
          }
        />
      ) : (
        <Tabs defaultValue="retail" className="w-full">
          <TabsList className="m-0 grid h-10 w-full grid-cols-2 bg-primary/20 p-0">
            <TabsTrigger
              value="retail"
              className="data-[state=active]:bg-primary/70 data-[state=active]:text-white"
            >
              Retail Products
            </TabsTrigger>
            <TabsTrigger
              value="wholesale"
              className="data-[state=active]:bg-primary/70 data-[state=active]:text-white"
            >
              Wholesale Products
            </TabsTrigger>
          </TabsList>
          <TabsContent value="retail">
            <Card className="my-10">
              <CardHeader className="w-full items-center justify-between gap-2 sm:flex-row">
                <Input
                  placeholder="search"
                  className="w-full sm:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  onValueChange={(value) => setStatus(value)} // Update status on selection
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
                  {filteredData?.filter(
                    (product) => product.productType === "retail",
                  ).length > 0 ? (
                    <GenericTable
                      columns={productColumns}
                      data={filteredData?.filter(
                        (product) => product.productType === "retail",
                      )}
                      actions={(row) => renderActions(row.id)}
                    />
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No Products found.
                    </div>
                  )}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wholesale">
            <Card className="my-10">
              <CardHeader className="w-full items-center justify-between gap-2 sm:flex-row">
                <Input
                  placeholder="search"
                  className="w-full sm:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Select
                  onValueChange={(value) => setStatus(value)} // Update status on selection
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusTypes.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
                  {filteredData?.filter(
                    (product) => product.productType === "wholesale",
                  ).length > 0 ? (
                    <GenericTable
                      columns={wholesaleproductColumns}
                      data={filteredData.filter(
                        (product) => product.productType === "wholesale",
                      )}
                      actions={(row) => renderActions(row.id)}
                    />
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No Wholesale Products found.
                    </div>
                  )}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
