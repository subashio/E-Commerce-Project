import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";

import CategoryForm from "@/components/CategoryForm";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import { Input } from "@/components/ui/input";
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
import { actions, categoryColumns } from "@/lib/Actions";
import Axios from "@/lib/Axios";
import { setCategory } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id: selectedId } = useParams();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );

  const selectedCategory = category.find((cat) => cat._id === selectedId);

  const productsData = category.map((category: any) => ({
    id: category._id || "N/A",
    image: category.image || "default.jpg",
    category: category.name || "Unnamed",
    status: category.status ?? false,
    createdAt: new Date().toISOString().split("T")[0],
  }));

  const [filteredData, setFilteredData] = React.useState(productsData);

  const filterCatergory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.filter_Category,
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
        dispatch(setCategory(response.data.data));
        setFilteredData(
          response.data.data.map((category: any) => ({
            id: category._id || "N/A",
            image: category.image || "default.jpg",
            category: category.name || "Unnamed",
            status: category.status ?? false,
            createdAt: new Date(category.createdAt).toISOString().split("T")[0], // Use actual date
          })),
        );
      }
    } catch (error) {}
  };
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_Category,
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
    } catch (error) {}
  };

  React.useEffect(() => {
    filterCatergory();
  }, [search, status]);

  let isAddCategory =
    location.pathname === "/dashboard-page/category/add-category";
  let isEditCategory =
    location.pathname ===
    `/dashboard-page/category/edit-category/${selectedId}`;

  const renderActions = (id: string) =>
    actions(id, "category/edit-category", handleDeleteCategory);

  return (
    <div className="relative mt-10 w-full">
      <div className="flex flex-wrap items-center justify-between gap-y-4 pb-10 pt-10 md:pb-10 md:pt-0">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold">
            {isAddCategory && !isEditCategory
              ? "Add New Category"
              : !isAddCategory && isEditCategory
                ? "Edit Category"
                : "Category"}
          </h1>
          <DashboardBreadcrumb
            pathName="Category"
            path="category"
            isAdd={isAddCategory}
            isEdit={isEditCategory}
          />
        </div>
        {!isAddCategory && !isEditCategory ? (
          <Link
            to="/dashboard-page/category/add-category"
            className="group flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary/50 hover:bg-white hover:text-black"
          >
            Add Category
            <Plus className="p-1 transition-all duration-300 group-hover:rotate-180" />
          </Link>
        ) : (
          <Link
            to="/dashboard-page/category"
            className="flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-secondary hover:bg-white hover:text-black"
          >
            Back
          </Link>
        )}
      </div>
      {isAddCategory && !isEditCategory ? (
        <CategoryForm />
      ) : !isAddCategory && isEditCategory ? (
        <CategoryForm
          id={selectedId}
          initialData={{
            name: selectedCategory?.name || "",
            status: selectedCategory?.status || false,
            image: selectedCategory?.image,
            role: "edit",
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
              {filteredData?.length > 0 ? (
                <GenericTable
                  columns={categoryColumns}
                  data={filteredData}
                  actions={(row) => renderActions(row.id)}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No categories found.
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
