import React, { useEffect, useState } from "react";
import Dropzone, { DropzoneState } from "shadcn-dropzone";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { ACCEPTED_IMAGE } from "@/constants/details";
import { Loader, X } from "lucide-react"; // Adjust icons based on your project setup

interface DropzoneImageFieldProps {
  name: string;
  form: any; // Adjust to your form type, e.g., React Hook Form's control
  handleImageUpload: (
    acceptedFiles: File[],
    onChange: (value: string | string[]) => void,
    value: string | string[],
  ) => Promise<void>;
  imageUrl?: string | string[];
  loading: boolean;
  multiple?: boolean; // Toggle for single or multiple images
}

const DropzoneImageField: React.FC<DropzoneImageFieldProps> = ({
  name,
  form,
  handleImageUpload,
  imageUrl,
  loading,
  multiple = false, // Set default to false for single image
}) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  // Populate `imageUrls` for editing
  useEffect(() => {
    if (imageUrl) {
      setImageUrls(Array.isArray(imageUrl) ? imageUrl : [imageUrl]); // Handle both single and multiple URLs
    }
  }, [imageUrl]);

  // Remove image from the list
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imageUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);

    // Update form state
    form.setValue(name, multiple ? updatedImages : updatedImages[0] || "");
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => {
        useEffect(() => {
          if (value) {
            setImageUrls(Array.isArray(value) ? value : [value]);
          }
        }, [value]);
        return (
          <FormItem>
            <FormControl>
              <Dropzone
                onDrop={(acceptedFiles: File[]) =>
                  handleImageUpload(acceptedFiles, onChange, value)
                }
                accept={ACCEPTED_IMAGE}
                dropZoneClassName="h-auto"
              >
                {(dropzone: DropzoneState) => (
                  <div
                    {...dropzone.getRootProps()}
                    className="h-auto cursor-pointer p-4 text-center"
                  >
                    <input
                      onBlur={onBlur}
                      type="file"
                      accept=".jpg,.png,.jpeg,.web"
                      {...dropzone.getInputProps()}
                    />
                    {dropzone.isDragAccept ? (
                      <p className="text-sm font-medium">
                        Drop your files here!
                      </p>
                    ) : (
                      <p className="text-sm font-medium">
                        Drag & drop files or click to upload.
                      </p>
                    )}
                    <div className="mt-1 text-xs">
                      {imageUrls.length} file(s) selected.
                    </div>

                    {loading ? (
                      <p className="mt-2 flex items-center justify-center gap-2 text-sm text-primary">
                        <Loader className="w-5 animate-spin" />
                        Fetching Please wait
                      </p>
                    ) : (
                      <div className="mt-2 flex h-full justify-center text-xs text-primary">
                        {imageUrls.length > 0 ? (
                          <ul className="flex max-w-full flex-wrap justify-center gap-x-2 gap-y-1.5 overflow-auto">
                            {imageUrls.map((url: string, index: number) => (
                              <li
                                key={index}
                                className="relative flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-2 py-1"
                              >
                                <img
                                  src={url}
                                  alt="Uploaded"
                                  className="h-12 w-12 rounded object-cover"
                                />

                                <X
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                  }}
                                  className="z-10 w-4 text-red-300 hover:text-red-500"
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No files selected</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DropzoneImageField;
