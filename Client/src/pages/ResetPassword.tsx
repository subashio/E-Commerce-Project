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
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import Axios from "@/lib/Axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z
  .object({
    password: z.string().max(8, { message: "This field has to be filled." }),
    confirmPassword: z
      .string()
      .max(8, { message: "This field has to be filled." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await Axios({
        ...SummaryApi.reset_password,
        data: {
          email: location?.state?.email,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        },
      });
      if (response.data) {
        form.reset();
        navigate("/login");
        return toast({
          variant: "default",
          title: " Password Reset Successful ",
          description:
            "Your Password has been modifiyed successfully. Welcome aboard!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went Wrong",
        description: "We couldn't able to sign. Please try again.",
      });
    }
  }
  return (
    <div className="my-10 flex w-full items-center justify-center dark:bg-gray-950">
      <div className="flex max-w-xl flex-col gap-10 rounded-lg bg-white px-8 shadow-2xl dark:bg-gray-900">
        <h1 className="mb-4 mt-10 text-center text-3xl font-bold dark:text-gray-200">
          Enter New Password
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[350px] pb-24 sm:w-[500px]"
          >
            <div className="mb-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="Enter Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-md border-2 border-transparent bg-teal-500 px-8 py-6 font-bold text-white transition duration-200 hover:border-teal-500 hover:bg-white hover:text-black"
            >
              Register
              {form.formState.isSubmitting && (
                <Loader className="ml-2 h-6 w-6 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
