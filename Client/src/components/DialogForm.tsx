import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React, { ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button, ButtonProps } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input, InputProps } from "./ui/input";

type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  inputProps?: InputProps;
};

type DialogFormProps<T extends ZodType<any>> = {
  button: ReactNode;
  title?: string;
  description?: string;
  schema: T;
  defaultValues: z.infer<T>;
  fields: Field[];
  onSubmit: (
    data: z.infer<T>,
    form: UseFormReturn<z.infer<T>>,
    closeDialog: () => void, // Add the closeDialog argument here
  ) => Promise<void>;
  dialogClassName?: string;
  buttonProps?: ButtonProps;
};

export default function DialogForm<T extends ZodType<any>>({
  button,
  title,
  description,
  schema,
  defaultValues,
  fields,
  onSubmit,
  dialogClassName,
  buttonProps,
}: DialogFormProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleClose = () => {
    setIsDialogOpen(false);
    form.reset(); // Reset the form upon dialog close
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className={`max-w-2xl rounded-md ${dialogClassName}`}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-start">{title}</DialogTitle>
          <DialogDescription className="flex justify-start">
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data, form, handleClose),
            )}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name as any}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          className="no-arrows text-sm"
                          placeholder={field.placeholder || ""}
                          type={field.type || "text"}
                          {...field.inputProps}
                          {...inputField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full tracking-wide"
              {...buttonProps}
            >
              Save
              {form.formState.isSubmitting && (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
