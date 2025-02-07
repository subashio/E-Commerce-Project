import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid Email."),
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data) {
        toast({
          variant: "default",
          title: "Otp Generated successfully ",
          description: "Welcome back! You have successfully logged in.",
        });
      }
      form.reset();
      navigate("/verify-forgot-password-otp", {
        state: { email: data.email },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went Wrong",
        description: "We couldn't able to sign. Please try again.",
      });
    }
  }
  return (
    <Card className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-xl border-none bg-white px-8 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] dark:bg-gray-900">
      <h1 className="mb-4 mt-10 text-center text-3xl font-bold dark:text-gray-200">
        Forgot password
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[350px] pb-24 md:w-[300px] lg:w-[500px]"
        >
          <div className="mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="your@email.com"
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
            className="w-full rounded-md border-2 border-transparent bg-primary px-8 py-6 font-bold text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
          >
            Reset Password
            {form.formState.isSubmitting && (
              <Loader className="ml-2 h-6 w-6 animate-spin" />
            )}
          </Button>
          <div className="mt-4 flex w-full justify-center">
            <Link
              to="/login"
              className="flex gap-1 text-sm text-blue-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="text-foreground hover:no-underline">
                Remember your password?
              </span>
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
