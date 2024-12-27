import { variantSchema } from "@/constants/schema";
import { useProduct } from "@/hooks/useProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface VariantFormProps {
  id?: string;
  initialData?: {
    variant_name: string | undefined;
    brand_name: string[] | undefined;
    material_type: string[] | undefined;
    role: "edit" | "add"; // Existing image for edit mode
  };
}

export default function VariantForm({ initialData, id }: VariantFormProps) {
  const { handleVariant } = useProduct();
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: initialData
      ? {
          variant_name: initialData?.variant_name,
          brand_name: initialData?.brand_name,
          material_type: initialData?.material_type,
          role: initialData?.role,
        }
      : {
          variant_name: "",
          brand_name: [],
          material_type: [],
          role: "add",
        },
  });

  async function handleSubmit(data: z.infer<typeof variantSchema>) {
    try {
      await handleVariant(data, initialData, id);
      form.reset();
    } catch (error) {
      console.error("error in form submition");
    }
  }

  const [newOption, setNewOption] = React.useState<string>("");
  const [newBrand, setNewBrand] = React.useState<string>("");

  return (
    <Card className="mt-4 border-none">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Card>
              <CardContent className="my-4 p-4">
                <h1 className="mb-6 text-xl font-semibold text-secondary/70">
                  {initialData?.role !== "edit"
                    ? "Add New Category"
                    : "Edit Category"}
                </h1>

                <FormField
                  control={form.control}
                  name="variant_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 flex w-full flex-col gap-2">
                  <Label className="mb-2">Material Type </Label>
                  <div className="flex w-full items-center gap-2">
                    <Input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option"
                      className=" "
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission
                          if (newOption.trim()) {
                            form.setValue("material_type", [
                              ...form.getValues("material_type"),
                              newOption,
                            ]);
                            setNewOption(""); // Clear the input field after adding
                          }
                        }
                      }}
                    />

                    <Button
                      onClick={() => {
                        if (newOption.trim()) {
                          form.setValue("material_type", [
                            ...form.getValues("material_type"),
                            newOption,
                          ]);
                          setNewOption(""); // Clear the input field after adding
                        }
                      }}
                      type="button"
                      className="h-9 rounded-lg"
                    >
                      Add Option
                    </Button>
                  </div>
                  <ul className="flex flex-wrap gap-1">
                    {form.getValues("material_type").map((option, index) => (
                      <li key={index} className="flex items-center">
                        <Badge className="mr-2 flex items-center gap-2">
                          {option}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              // Filter out the option that matches the current index
                              const updatedMaterialType = form
                                .getValues("material_type")
                                .filter((_, i) => i !== index);
                              // Update the form state with the new array
                              form.setValue(
                                "material_type",
                                updatedMaterialType,
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
                  <Label className="mb-2">Brand Name </Label>
                  <div className="flex w-full items-center gap-2">
                    <Input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="Add new brand"
                      className=" "
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission
                          if (newBrand.trim()) {
                            form.setValue("brand_name", [
                              ...form.getValues("brand_name"),
                              newBrand,
                            ]);
                            setNewBrand(""); // Clear the input field after adding
                          }
                        }
                      }}
                      autoComplete="on"
                    />

                    <Button
                      onClick={() => {
                        if (newBrand.trim()) {
                          form.setValue("brand_name", [
                            ...form.getValues("brand_name"),
                            newBrand,
                          ]);
                          setNewBrand(""); // Clear the input field after adding
                        }
                      }}
                      type="button"
                      className="h-9 rounded-lg"
                    >
                      Add Brand
                    </Button>
                  </div>
                  <ul className="flex flex-wrap gap-1">
                    {form.getValues("brand_name").map((option, index) => (
                      <li key={index} className="flex items-center">
                        <Badge className="mr-2 flex items-center gap-2">
                          {option}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => {
                              // Filter out the option that matches the current index
                              const updatedMaterialType = form
                                .getValues("brand_name")
                                .filter((_, i) => i !== index);
                              // Update the form state with the new array
                              form.setValue("brand_name", updatedMaterialType, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                          />
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full tracking-wide"
            >
              {initialData?.role !== "edit"
                ? "Add Category"
                : "Update Category"}
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
