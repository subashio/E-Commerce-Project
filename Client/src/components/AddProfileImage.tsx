import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { imageSchema } from "@/constants/schema";
import { useUser } from "@/hooks/useUser";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, UserRoundPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function AddProfileImage() {
  const user = useSelector((state: RootState) => state.user);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { uploadUserProfile } = useUser();

  const form = useForm<z.infer<typeof imageSchema>>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      image: undefined,
    },
  });

  const imageRef = form.register("image");

  const handleClose = () => {
    setIsDialogOpen(false);
    form.reset(); // Reset the form upon dialog close
  };

  async function onSubmit(data: z.infer<typeof imageSchema>) {
    try {
      uploadUserProfile(data, handleClose);
    } catch (error) {
      console.error("Error in form submition!!");
    }
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger>
        <div className="group relative h-28 w-28 rounded-full border">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="h-28 w-28 rounded-full object-contain object-center"
          />
          <UserRoundPen className="absolute right-2 top-2 hidden rounded-full bg-gray-950/80 p-1.5 text-white group-hover:block dark:bg-white dark:text-gray-950" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-md">
        <DialogHeader>
          <DialogTitle className="flex justify-start">
            Add Profile Image
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Add Profile</FormLabel>
                  <FormControl>
                    <Input
                      accept=".jpg,.png,.jpeg,.webp"
                      type="file"
                      {...imageRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="w-full tracking-wide"
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
