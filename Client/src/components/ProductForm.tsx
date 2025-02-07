import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductSchema } from "@/constants/schema";
import { useProduct } from "@/hooks/useProduct";
import uploadImage from "@/lib/uploadImage";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import DropzoneImageField from "./DropzoneImageField";
import RichTextEditor from "./RichTextEditor";
import { Card, CardContent } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface ProductProps {
  initialData?: {
    name: string;
    brandName: string;
    image: Array<any> | undefined;
    categoryId: string;
    sub_categoryId: string;
    maxQuantity: number | undefined;
    minQuantity: number | undefined;
    status: boolean;
    stock: number | undefined;
    price: number | undefined;
    salePrice: number | undefined;
    wholesalePrice: number | undefined;
    specifications: Array<any> | undefined;
    filterOptions: Array<any> | undefined;
    searchTags: Array<any> | undefined;
    description: string | TrustedHTML | undefined;
    role: "edit" | "add";
    productType: string;
    variantId: string;
  };
  id?: string;
}
export default function ProductForm({ initialData, id }: ProductProps) {
  const [isImageLoading, setImageLoading] = React.useState<boolean>(false);
  const { handleProduct } = useProduct();
  const [isWholesale, setIsWholesale] = React.useState(false);
  const category = useSelector(
    (state: RootState) => state.product?.category || [],
  );
  const Subcategory = useSelector(
    (state: RootState) => state.product?.subcategory || [],
  );
  const variant = useSelector(
    (state: RootState) => state.product?.variant || [],
  );

  const editPayload =
    initialData?.productType === "wholesale"
      ? {
          name: initialData.name,
          image: initialData.image,
          description: initialData.description || undefined,
          status: initialData.status,
          categoryId: initialData.categoryId,
          variantId: initialData?.variantId,
          sub_categoryId: initialData.sub_categoryId,
          wholesalePrice: initialData.wholesalePrice ?? undefined,
          minQuantity: initialData.minQuantity ?? undefined,
          maxQuantity: initialData.maxQuantity ?? undefined,
          salePrice: initialData.salePrice,
          isWholesale: true,
          specifications: initialData.specifications,
          filterOptions: initialData.filterOptions,
          searchTags: initialData.searchTags,
          stock: initialData.stock,
          brandName: initialData.brandName ?? undefined,
          role: initialData.role,
        }
      : {
          name: initialData?.name,
          image: initialData?.image,
          description: initialData?.description || undefined,
          status: initialData?.status,
          categoryId: initialData?.categoryId,
          sub_categoryId: initialData?.sub_categoryId,
          wholesalePrice: initialData?.wholesalePrice ?? undefined,
          price: initialData?.price,
          salePrice: initialData?.salePrice,
          specifications: initialData?.specifications,
          isWholesale: false,
          stock: initialData?.stock,
          filterOptions: initialData?.filterOptions,
          searchTags: initialData?.searchTags,
          brandName: initialData?.brandName ?? undefined,
          role: initialData?.role,
        };

  const addPayload = (isWholesale: boolean) => ({
    name: "",
    image: [] as string[],
    minQuantity: isWholesale ? 1 : undefined, // Set default minQuantity for wholesale
    maxQuantity: isWholesale ? undefined : undefined, // Set default maxQuantity for wholesale
    description: "",
    status: false,
    isWholesale, // Set based on the parameter
    categoryId: "",
    sub_categoryId: "",
    specifications: [],
    filterOptions: [],
    searchTags: [],
    wholesalePrice: isWholesale ? undefined : undefined, // Ensure this is set for wholesale
    price: undefined as number | undefined, // Regular price for non-wholesale
    salePrice: isWholesale ? undefined : undefined,
    stock: undefined as number | undefined,
    brandName: undefined,
    role: "add" as const,
    variantId: isWholesale ? undefined : undefined,
    productType: isWholesale ? "wholesale" : "retail",
  });

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData ? editPayload : addPayload(isWholesale),
  });

  const [newKeyword, setNewKeyword] = React.useState<string>("");
  const [newSearchTag, setNewSearchTag] = React.useState<string>("");

  const categoryTypes = React.useMemo(
    () =>
      Array.isArray(category)
        ? category.map(({ _id, name }: { _id: string; name: string }) => ({
            value: _id || "N/A",
            label: name || "N/A",
          }))
        : [],
    [category], // Dependency array ensures it's recomputed only when category changes
  );
  const subCategoryTypes = React.useMemo(
    () =>
      Array.isArray(Subcategory)
        ? Subcategory.map(({ _id, name }: { _id: string; name: string }) => ({
            value: _id || "N/A",
            label: name || "N/A",
          }))
        : [],
    [Subcategory],
  );
  const variantTypes = React.useMemo(
    () =>
      Array.isArray(variant)
        ? variant.map(
            ({ _id, variant_name }: { _id: string; variant_name: string }) => ({
              value: _id || "N/A",
              label: variant_name || "N/A",
            }),
          )
        : [],
    [variant],
  );

  const handleImageUpload = async (
    acceptedFiles: File[],
    onChange: (value: string | string[]) => void,
    value: string | string[],
  ) => {
    try {
      setImageLoading(true); // Show loading state while uploading images
      // Upload all the files
      const uploadedUrls = await Promise.all(
        acceptedFiles.map(async (file: File) => {
          const response = await uploadImage(file); // Assume uploadImage is an API call to upload the image
          return response.data.data.url; // Get URL of uploaded image
        }),
      );
      // Sync with the form state (pass the array of URLs to form)
      const currentImages = value || [];
      const updatedImages = [...currentImages, ...uploadedUrls];
      onChange(updatedImages);
      setImageLoading(false); // Hide loading after the images are uploaded
    } catch (error) {
      console.error("Image upload failed", error);
      setImageLoading(false); // Hide loading if there's an error
    }
  };
  async function onSubmit(data: z.infer<typeof ProductSchema>) {
    try {
      const payload = {
        ...data,
        isWholesale: isWholesale,
      };
      await handleProduct(payload, initialData, id);
      console.log("payload", payload);
      form.reset();
    } catch (error) {
      console.log("error in form submition");
    }
  }
  console.log("payload", isWholesale);

  const toggleWholesale = () => {
    const newIsWholesale = !isWholesale;
    setIsWholesale(newIsWholesale);
    form.setValue("isWholesale", newIsWholesale); // Update form state

    if (newIsWholesale) {
      form.setValue("wholesalePrice", initialData?.wholesalePrice ?? undefined);
      form.setValue("maxQuantity", initialData?.maxQuantity ?? undefined);
    } else {
      form.setValue("price", initialData?.price ?? undefined);
    }
  };

  return (
    <Card className="mx-6 mb-10 p-6">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <h1 className="text-xl font-semibold text-secondary/70">
              Product Information
              {!initialData && (
                <span className="mt-4 flex w-full justify-start">
                  <button
                    type="button"
                    onClick={toggleWholesale}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    {isWholesale
                      ? "Switch to Regular Product"
                      : "Create a Wholesaler Product"}
                  </button>
                </span>
              )}
            </h1>
            <Card className="my-10 grid gap-4 border-none shadow-none lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Product Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryTypes.map((item, _index) => (
                          <SelectItem key={_index} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Brand Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(isWholesale || initialData?.variantId) && (
                <FormField
                  control={form.control}
                  name="variantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Variant Name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {variantTypes.map((item: any, _index: any) => (
                            <SelectItem key={_index} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="sub_categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Sub_Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Product sub-category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategoryTypes.map((item, _index) => (
                          <SelectItem key={_index} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 flex w-full flex-col gap-2">
                <Label className="mb-2">Filter Options</Label>
                <div className="flex w-full items-center gap-2">
                  <Input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Enter a keyword"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newKeyword.trim()) {
                          form.setValue("filterOptions", [
                            ...form.getValues("filterOptions"),
                            newKeyword,
                          ]);
                          setNewKeyword("");
                        }
                      }
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (newKeyword.trim()) {
                        form.setValue("filterOptions", [
                          ...form.getValues("filterOptions"),
                          newKeyword,
                        ]);
                        setNewKeyword("");
                      }
                    }}
                    type="button"
                    className="h-9 rounded-lg"
                  >
                    Add
                  </Button>
                </div>

                <ul className="flex flex-wrap gap-1">
                  {form.getValues("filterOptions").map((keyword, index) => (
                    <li key={index} className="flex items-center">
                      <Badge className="mr-2 flex items-center gap-2">
                        {keyword}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            form.setValue(
                              "filterOptions",
                              form
                                .getValues("filterOptions")
                                .filter((_, i) => i !== index),
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              },
                            );
                          }}
                        />
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex w-full flex-col gap-2">
                <Label className="mb-2">Search Tags</Label>
                <div className="flex w-full items-center gap-2">
                  <Input
                    type="text"
                    value={newSearchTag}
                    onChange={(e) => setNewSearchTag(e.target.value)}
                    placeholder="Enter a keyword"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newSearchTag.trim()) {
                          form.setValue("searchTags", [
                            ...form.getValues("searchTags"),
                            newSearchTag,
                          ]);
                          setNewSearchTag("");
                        }
                      }
                    }}
                  />

                  <Button
                    onClick={() => {
                      if (newSearchTag.trim()) {
                        form.setValue("searchTags", [
                          ...form.getValues("searchTags"),
                          newSearchTag,
                        ]);
                        setNewSearchTag("");
                      }
                    }}
                    type="button"
                    className="h-9 rounded-lg"
                  >
                    Add
                  </Button>
                </div>

                <ul className="flex flex-wrap gap-1">
                  {form.getValues("searchTags").map((tag, index) => (
                    <li key={index} className="flex items-center">
                      <Badge className="mr-2 flex items-center gap-2">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            form.setValue(
                              "searchTags",
                              form
                                .getValues("searchTags")
                                .filter((_, i) => i !== index),
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              },
                            );
                          }}
                        />
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <h1 className="mb-4 text-xl font-semibold text-secondary/70">
              Product Image
            </h1>
            <DropzoneImageField
              loading={isImageLoading}
              name="image"
              form={form}
              handleImageUpload={handleImageUpload}
              multiple={true}
            />
            <h1 className="my-4 text-xl font-semibold text-secondary/70">
              Product Descriptions
            </h1>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      content={
                        typeof field.value === "string" ? field.value : ""
                      }
                      onChange={(value: any) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Specifications Section */}
            <Card className="my-4 flex flex-col p-4">
              <FormLabel className="my-4 text-xl font-semibold text-secondary/70">
                Specifications
              </FormLabel>
              {form.watch("specifications")?.map((_, index) => (
                <div key={index} className="mb-4 flex space-x-4">
                  <FormControl>
                    <Input
                      placeholder="Specification Name"
                      {...form.register(`specifications.${index}.key`)}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Specification Value"
                      {...form.register(`specifications.${index}.value`)}
                    />
                  </FormControl>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  form.setValue("specifications", [
                    ...(form.watch("specifications") || []),
                    { key: "", value: "" },
                  ])
                }
                className="mt-2"
              >
                Add Specification
              </Button>
            </Card>
            {/* gird */}
            <Card className="mb-6 grid gap-10 border-none md:grid-cols-2">
              {/* product price card */}
              <Card className="my-4 p-2">
                <CardContent>
                  <h1 className="my-4 text-xl font-semibold text-secondary/70">
                    Product Price
                  </h1>
                  {(initialData?.price || !isWholesale) && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="my-5">
                          <FormLabel>Regular Price</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!!initialData?.wholesalePrice}
                              className="no-arrows"
                              type="number"
                              placeholder="₹0.00"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {(isWholesale || initialData?.wholesalePrice) && (
                    <FormField
                      control={form.control}
                      name="wholesalePrice"
                      render={({ field }) => (
                        <FormItem
                          defaultValue={initialData?.wholesalePrice}
                          className="my-2"
                        >
                          <FormLabel>WholesalePrice</FormLabel>
                          <FormControl>
                            <Input
                              className="no-arrows"
                              type="number"
                              placeholder="₹0.00"
                              {...field}
                              value={field.value?.toString() ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Price (M.R.P)</FormLabel>
                        <FormControl>
                          <Input
                            className="no-arrows"
                            type="number"
                            placeholder="₹0.00"
                            {...field}
                            value={field.value || ""} // Prevent uncontrolled component issues
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Other details card */}
              <Card className="my-4 p-2">
                <CardContent>
                  <h1 className="my-4 text-xl font-semibold text-secondary/70">
                    Other Details
                  </h1>

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="my-2">
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            className="no-arrows"
                            type="number"
                            placeholder="₹0.00"
                            {...field}
                            value={field.value ?? ""} // Convert null/undefined to empty string
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || null)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(isWholesale || initialData?.maxQuantity) && (
                    <FormField
                      control={form.control}
                      name="maxQuantity"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <FormLabel>Max Quantity</FormLabel>
                          <FormControl>
                            <Input
                              className="no-arrows"
                              type="number"
                              placeholder="Max Quantity"
                              {...field}
                              value={field.value?.toString() ?? ""} // Convert number to string or empty string
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {(isWholesale || initialData?.minQuantity) && (
                    <FormField
                      control={form.control}
                      name="minQuantity"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <FormLabel>Min Quantity</FormLabel>
                          <FormControl>
                            <Input
                              className="no-arrows"
                              type="number"
                              placeholder="Min Quantity"
                              {...field}
                              value={field.value?.toString() ?? ""} // Convert number to string or empty string
                              onChange={(e) =>
                                field.onChange(
                                  e.target.valueAsNumber || undefined,
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="my-5">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            defaultValue={field.value ? "true" : "false"}
                            className="flex items-center space-x-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Active
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Disabled
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </Card>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full tracking-wide"
            >
              {initialData?.role === "edit" ? "Update Product" : "Add Product"}
              {form.formState.isSubmitting && (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
