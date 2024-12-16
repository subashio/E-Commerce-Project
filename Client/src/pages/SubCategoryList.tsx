import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import SubCategoryForm from "@/components/SubCategoryForm";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SummaryApi } from "@/constants/SummaryApi";
import { actions, subCategoryColumns } from "@/lib/Actions";
import Axios from "@/lib/Axios";
import { setSubCategory } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import { Plus } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createLookup } from "@/lib/lookUpMap";

export default function SubCategoryList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id: selectedId } = useParams();
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const Subcategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );
  let isAddCategory =
    location.pathname == "/dashboard-page/sub-category/add-sub-category";
  let isEditCategory =
    location.pathname ==
    `/dashboard-page/sub-category/edit-sub-category/${selectedId}`;

  // Create a lookup map for categories
  const categoryLookup = React.useMemo(
    () => createLookup(category, "_id", "name"),
    [category],
  );

  //this is used for table
  const selectedSubCategory = React.useMemo(() => {
    return Subcategory.find(
      (item) => item._id === selectedId && categoryLookup.has(item.categoryId),
    );
  }, [Subcategory, categoryLookup, selectedId]);

  // Use SubcategoryList directly for productsData mapping
  const productsData = Subcategory.map((subcategory: any) => ({
    id: subcategory._id || "N/A",
    subcategory: subcategory.name || "Unnamed Subcategory",
    category: categoryLookup.get(subcategory.categoryId) || "Unknown Category", // Look up the category name
    createdAt: new Date().toISOString().split("T")[0],
  }));

  const [filteredData, setFilteredData] = React.useState(productsData);
  //seting the values for the select
  const categoryTypes = Array.isArray(category)
    ? category.map((category: any) => ({
        value: category._id || "N/A",
        label: category.name || "N/A",
      }))
    : [];

  async function fetchFilteresSubCategory() {
    try {
      const response = await Axios({
        ...SummaryApi.filter_SubCategory,
        params: {
          search,
          category: selectedCategory,
        },
      });

      if (response.data.data) {
        dispatch(setSubCategory(response.data.data));
        setFilteredData(
          response.data.data.map((subcategory: any) => ({
            id: subcategory._id || "N/A",
            subcategory: subcategory.name || "Unnamed Subcategory",
            category:
              categoryLookup.get(subcategory.categoryId) || "Unknown Category",
            createdAt: new Date().toISOString().split("T")[0],
          })),
        );
      }
    } catch (error) {}
  }
  async function handleDelete(id: string) {
    try {
      const response = await Axios({
        ...SummaryApi.delete_SubCategory,
        data: { _id: id },
      });
      if (response.data) {
        window.location.reload();
        setFilteredData(filteredData.filter((item) => item.id !== id));
        toast({
          variant: "default",
          title: "Sub-category deleted",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting sub-category",
      });
    }
  }

  React.useEffect(() => {
    fetchFilteresSubCategory();
  }, [search, selectedCategory]);

  const renderActions = (id: string) =>
    actions(id, "sub-category/edit-sub-category", handleDelete);

  return (
    <div className="relative mt-10 w-full">
      <div className="flex flex-wrap items-center justify-between gap-y-4 pb-10 pt-10 md:pb-10 md:pt-0">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold">
            {isAddCategory && !isEditCategory
              ? "Add New Sub-Category"
              : !isAddCategory && isEditCategory
                ? "Edit Sub-Category"
                : "Sub_Category"}
          </h1>
          <DashboardBreadcrumb
            pathName="Sub-Category"
            path="sub-category"
            isAdd={isAddCategory}
            isEdit={isEditCategory}
          />
        </div>
        {!isAddCategory && !isEditCategory ? (
          <Link
            to="/dashboard-page/sub-category/add-sub-category"
            className="group flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary/50 hover:bg-white hover:text-black"
          >
            Add Sub_Category
            <Plus className="p-1 transition-all duration-300 group-hover:rotate-180" />
          </Link>
        ) : (
          <Link
            to="/dashboard-page/sub-category"
            className="flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-secondary hover:bg-white hover:text-black"
          >
            Back
          </Link>
        )}
      </div>
      {isAddCategory && !isEditCategory ? (
        <SubCategoryForm />
      ) : !isAddCategory && isEditCategory ? (
        <SubCategoryForm
          id={selectedId}
          initialData={{
            role: "edit",
            name: selectedSubCategory?.name || "",
            category: selectedSubCategory?.categoryId || "",
          }}
        />
      ) : (
        <Card className="my-10">
          <CardHeader className="w-full items-center justify-between gap-2 sm:flex-row">
            <Input
              placeholder="search"
              className="w-full sm:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              onValueChange={(value) => setSelectedCategory(value)}
              defaultValue={selectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Product Category" />
              </SelectTrigger>
              <SelectContent className="">
                {categoryTypes.map((item) => (
                  <SelectItem value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
              {filteredData?.length > 0 ? (
                <GenericTable
                  columns={subCategoryColumns}
                  data={filteredData}
                  actions={(row) => renderActions(row.id)}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No sub-categories found.
                </div>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
