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
import { RegisterSchema, WholesaleRegisterSchema } from "@/constants/schema";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

export default function Register() {
  const { registerUser } = useUser();
  const [isWholesale, setIsWholesale] = React.useState(false);
  const form = useForm<
    z.infer<typeof RegisterSchema | typeof WholesaleRegisterSchema>
  >({
    resolver: zodResolver(
      isWholesale ? WholesaleRegisterSchema : RegisterSchema,
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      officeAddress: "",
      officePhone: "",
      GSTIN: "",
      isWholesale: false,
    },
  });
  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      const payload = {
        ...data,
        isWholesale, // Include the wholesaler status
      };
      await registerUser(payload);
      form.reset();
      console.log("data submited:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <div className="mt-10 flex w-full items-center justify-center py-10">
      <div className="flex max-w-xl flex-col gap-10 rounded-xl px-8">
        <h1 className="mb-4 mt-10 text-center text-3xl font-bold dark:text-gray-200">
          {isWholesale ? "Create a Wholesale Account" : "Create an Account"}
          <span className="mt-4 flex w-full justify-center">
            <button
              type="button"
              onClick={() => {
                setIsWholesale(!isWholesale);
                form.setValue("isWholesale", !isWholesale); // Update form state
              }}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {isWholesale
                ? "Switch to Regular Account"
                : "Create a Wholesaler Account"}
            </button>
          </span>
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[350px] pb-24 md:w-[300px] lg:w-[500px]"
          >
            <div className="mb-4 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="Enter Name"
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
                        type="password"
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
            {isWholesale && (
              <>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Enter Company Name"
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
                    name="GSTIN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GSTIN/UIN of the Taxpayer</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Enter GSTIN"
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
                    name="officeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office Address</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full rounded-md border border-gray-300 px-4 py-6 shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Enter Office Address"
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
                    name="officePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="no-arrows w-full rounded-md border border-gray-300 px-4 py-6 text-sm shadow-sm focus:border-none focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            placeholder="Enter Office Phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-md border-2 border-transparent bg-primary px-8 py-6 font-bold text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
            >
              Register
              {form.formState.isSubmitting && (
                <Loader className="ml-2 h-6 w-6 animate-spin" />
              )}
            </Button>

            <div className="mt-4 flex w-full justify-center gap-1">
              <p className="text-sm text-foreground hover:no-underline">
                Already have an account!
              </p>
              <Link
                to="/login"
                className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
