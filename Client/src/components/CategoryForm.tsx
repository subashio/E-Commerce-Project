import { categorySchema } from "@/constants/schema";
import { useProduct } from "@/hooks/useProduct";
import uploadImage from "@/lib/uploadImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DropzoneImageField from "./DropzoneImageField";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface CategoryFormProps {
  id?: string;
  initialData?: {
    name: string;
    status: boolean;
    image?: string | undefined;
    role: "edit" | "add"; // Existing image for edit mode
  };
}

export default function CategoryForm({ initialData, id }: CategoryFormProps) {
  const { handleCategory } = useProduct();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData
      ? {
          name: initialData?.name,
          status: initialData?.status,
          image: initialData.image,
          role: initialData.role,
        }
      : {
          name: "",
          status: false,
          image: undefined,
          role: "add",
        },
  });

  async function handleSubmit(data: z.infer<typeof categorySchema>) {
    try {
      await handleCategory(data, initialData, id);
      form.reset();
    } catch (error) {
      console.error("error in form submition");
    }
  }
  const [imageUrls, setImageUrls] = React.useState<string | string[]>("");
  const [isImageLoading, setImageLoading] = React.useState<boolean>(false);

  const handleImageUpload = async (
    acceptedFiles: File[],
    onChange: (value: string | string[]) => void,
  ) => {
    try {
      setImageLoading(true); // Show loading state while uploading the image

      //  Upload the first file (since it's single image upload)
      const file = acceptedFiles[0];
      const response = await uploadImage(file); // Assume uploadImage is an API call to upload the image
      const uploadedUrl = response.data.data.url; // Get URL of uploaded image
      // Update the image URL in the state
      setImageUrls([uploadedUrl]); // Store the uploaded URL in state
      // Sync with the form state (pass the single URL to form)
      onChange(uploadedUrl);

      setImageLoading(false); // Hide loading after the image is uploaded
    } catch (error) {
      console.error("Image upload failed", error);
      setImageLoading(false); // Hide loading if there's an error
    }
  };

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
                <DropzoneImageField
                  loading={isImageLoading}
                  name="image"
                  imageUrl={imageUrls}
                  form={form}
                  multiple={false}
                  handleImageUpload={handleImageUpload}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
