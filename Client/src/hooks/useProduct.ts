import {
  categorySchema,
  ProductSchema,
  subCategorySchema,
  variantSchema,
} from "@/constants/schema";
import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "@/lib/Axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "./use-toast";
import { useGlobleContext } from "@/context/GlobleContextProvider";

export function useProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchAllViewedProduct, fetchAllWishlist } = useGlobleContext();

  // add and update  product
  const handleProduct = async (
    data: z.infer<typeof ProductSchema>,
    initialData: any,
    id: string | undefined,
  ) => {
    try {
      let response;
      //handle update product
      if (initialData) {
        response = await Axios({
          ...SummaryApi.update_product, // update  product link
          data: {
            _id: id,
            ...data,
          },
        });
      } else {
        //handle app-product
        response = await Axios({
          ...SummaryApi.add_product, //add product link
          data: data,
        });
      }
      console.log("response data: ", response);
      navigate("/dashboard-page/products");
      window.location.reload();
      toast({
        title:
          initialData?.role === "edit" ? "Category Update" : "Category Added",
        description: "The category has been successfully saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the category. Please try again.",
      });
    }
  };

  // add and update category
  const handleCategory = async (
    data: z.infer<typeof categorySchema>,
    initialData: any,
    id: string | undefined,
  ) => {
    try {
      let response;

      if (initialData) {
        response = await Axios({
          ...SummaryApi.update_Category,
          data: {
            _id: id,
            ...data,
          },
        });
      } else {
        response = await Axios({ ...SummaryApi.add_Category, data: data });
      }

      console.log("response data: ", response);

      navigate("/dashboard-page/category");
      window.location.reload();
      toast({
        title:
          initialData?.role === "edit" ? "Category Update" : "Category Added",
        description: "The category has been successfully saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the category. Please try again.",
      });
    }
  };

  // add and update sub-categoy

  const handleSubCategory = async (
    data: z.infer<typeof subCategorySchema>,
    initialData: any,
    id: string | undefined,
  ) => {
    try {
      let response;
      if (initialData) {
        response = await Axios({
          ...SummaryApi.update_SubCategory,
          data: {
            _id: id,
            categoryId: data.category,
            name: data.name,
          },
        });
      } else {
        response = await Axios({
          ...SummaryApi.add_SubCategory,
          data: {
            categoryId: data.category,
            name: data.name,
          },
        });
      }
      console.log(" Aub-category response Data", response);

      navigate("/dashboard-page/sub-category");
      window.location.reload();
      toast({
        title:
          initialData?.role === "add"
            ? "Sub-Category Added"
            : "Sub-Category Updated",
        description: "The category has been successfully saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the category. Please try again.",
      });
    }
  };

  const handleVariant = async (
    data: z.infer<typeof variantSchema>,
    initialData: any,
    id: string | undefined,
  ) => {
    let response;
    try {
      if (initialData) {
        response = await Axios({
          ...SummaryApi.update_variant,
          data: {
            _id: id,
            ...data,
          },
        });
      } else {
        response = await Axios({
          ...SummaryApi.add_variant,
          data: data,
        });
      }
      if (response && response.data) {
        navigate("/dashboard-page/variant");
        window.location.reload();
        toast({
          title:
            initialData?.role === "add" ? "Variant Added" : "Variant Updated",
          description: "The variant has been successfully saved.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the variant. Please try again.",
      });
    }
  };

  const createViewiedProducts = async (id: any) => {
    const response = await Axios({
      ...SummaryApi.create_viewed_products,
      data: {
        productId: id,
      },
    });
    if (response && response.data) {
      if (fetchAllViewedProduct) {
        fetchAllViewedProduct();
      }
    }
  };

  const createWishlist = async (id: string | undefined) => {
    const response = await Axios({
      ...SummaryApi.create_wishlist,
      data: {
        productId: id,
      },
    });
    if (response && response.data) {
      if (fetchAllWishlist) {
        fetchAllWishlist();
      }
    }
  };
  const deleteWishlist = async (id: string) => {
    const response = await Axios({
      ...SummaryApi.delete_wishlist,
      data: {
        productId: id,
      },
    });
    if (response && response.data) {
      if (fetchAllWishlist) {
        fetchAllWishlist();
      }
    }
  };

  return {
    handleProduct,
    handleCategory,
    handleSubCategory,
    createViewiedProducts,
    handleVariant,
    createWishlist,
    deleteWishlist,
  };
}
