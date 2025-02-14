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
import { loginSchema } from "@/constants/schema";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function Login() {
  const { loginUser } = useUser();
  const errorMessage = useSelector(
    (state: RootState) => state.user.error || [],
  );
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      await loginUser(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <Card className="flex h-full w-full flex-col items-center justify-center gap-10 rounded-xl border-none bg-white px-8 shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] dark:bg-gray-900">
      <h1 className="mb-4 mt-10 text-center text-3xl font-bold dark:text-gray-200">
        Welcome Back!
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[350px] pb-24 md:w-[300px] lg:w-[500px]"
        >
          {errorMessage.length > 0 && (
            <Alert
              className="mb-6 rounded-lg bg-destructive/10 p-3.5"
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm">Error</AlertTitle>
              <AlertDescription className="text-xs">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
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
                      type="password"
                      className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              to="/forgot-password"
              className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-md border-2 border-transparent bg-primary px-8 py-6 font-bold text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
          >
            Login{" "}
            {form.formState.isSubmitting && (
              <Loader className="ml-2 h-6 w-6 animate-spin" />
            )}
          </Button>

          <div className="mt-4 flex w-full justify-center gap-1">
            <p className="text-sm text-foreground hover:no-underline">
              Don't have an account yet?
            </p>
            <Link
              to="/register"
              className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </Card>
  );
}
