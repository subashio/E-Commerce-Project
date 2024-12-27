import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import GenericTable from "@/components/GenericTable";
import { Input } from "@/components/ui/input";
import VariantForm from "@/components/VartiantForm";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import { actions, variantColumns } from "@/lib/Actions";
import Axios from "@/lib/Axios";
import { setVariant } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function VariantList() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id: selectedId } = useParams();
  const [search, setSearch] = React.useState("");

  const variant = useSelector(
    (state: RootState) => state.product?.variant || [],
  );

  const selectedCategory = variant.find(
    (variant) => variant._id === selectedId,
  );

  const productsData = variant.map((variant: any) => ({
    id: variant._id || "N/A",
    variant_name: variant.variant_name || "Unnamed",
    brand_name: variant.brand_name.join(", ") || [],
    material_type: variant.material_type.join(", ") || [],
    createdAt: new Date().toISOString().split("T")[0],
  }));

  const [filteredData, setFilteredData] = React.useState(productsData);

  const filterCatergory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.filter_variant,
        params: {
          search: search || "", // Ensure this is a valid string
        },
      });

      if (response.data) {
        // Update Redux state and filtered data
        dispatch(setVariant(response.data.data));
        setFilteredData(
          response.data.data.map((variant: any) => ({
            id: variant._id || "N/A",
            variant_name: variant.variant_name || "Unnamed",
            brand_name: variant.brand_name.join(", ") || [],
            material_type: variant.material_type.join(", ") || [],
            createdAt: new Date(variant.createdAt).toISOString().split("T")[0], // Use actual date
          })),
        );
      }
    } catch (error) {}
  };
  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await Axios({
        ...SummaryApi.delete_variant,
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
  }, [search]);

  let isAddCategory =
    location.pathname === "/dashboard-page/variant/add-variant";
  let isEditCategory =
    location.pathname === `/dashboard-page/variant/edit-variant/${selectedId}`;

  const renderActions = (id: string) =>
    actions(id, "variant/edit-variant", handleDeleteCategory);

  return (
    <div className="relative mt-10 w-full">
      <div className="flex flex-wrap items-center justify-between gap-y-4 pb-10 pt-10 md:pb-10 md:pt-0">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-semibold">
            {isAddCategory && !isEditCategory
              ? "Add New Variant"
              : !isAddCategory && isEditCategory
                ? "Edit Variant"
                : "Variant"}
          </h1>
          <DashboardBreadcrumb
            pathName="Variant"
            path="variant"
            isAdd={isAddCategory}
            isEdit={isEditCategory}
          />
        </div>
        {!isAddCategory && !isEditCategory ? (
          <Link
            to="/dashboard-page/variant/add-variant"
            className="group flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:border-primary/50 hover:bg-white hover:text-black"
          >
            Add Variant
            <Plus className="p-1 transition-all duration-300 group-hover:rotate-180" />
          </Link>
        ) : (
          <Link
            to="/dashboard-page/variant"
            className="flex h-10 items-center gap-2 rounded-md border-2 border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-secondary hover:bg-white hover:text-black"
          >
            Back
          </Link>
        )}
      </div>
      {isAddCategory && !isEditCategory ? (
        <VariantForm />
      ) : !isAddCategory && isEditCategory ? (
        <VariantForm
          id={selectedId}
          initialData={{
            variant_name: selectedCategory?.variant_name || "",
            brand_name: selectedCategory?.brand_name || [],
            material_type: selectedCategory?.material_type || [],
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
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="min-w-full max-w-sm whitespace-nowrap sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-xl">
              {filteredData?.length > 0 ? (
                <GenericTable
                  columns={variantColumns}
                  data={filteredData}
                  actions={(row) => renderActions(row.id)}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No variant found.
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
