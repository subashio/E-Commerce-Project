import AddProfileImage from "@/components/AddProfileImage";
import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { setUserDetails } from "@/store/userSlice";
import { Pencil } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid Email."),
  mobile: z.string().max(10, { message: "mobile must be at least 10 number." }),
  password: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 8, {
      message: "Password must be at least 8 characters long.",
    }),
});

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state?.user);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { fetchUserDetails } = useUser();
  const addressList = useSelector(
    (state: RootState) => state.address.addressList,
  );

  async function handleSubmit(
    data: z.infer<typeof ProfileSchema>,
    form: UseFormReturn<z.infer<typeof ProfileSchema>>,
    closeDialog: () => void,
  ) {
    try {
      const response = await Axios({
        ...SummaryApi.update_user_details,
        data: data,
      });

      if (response.data) {
        toast({
          variant: "default",
          title: "Registration Successful ",
          description:
            "Your account has been created successfully. Welcome aboard!",
        });
        closeDialog();
        const userDetails = await fetchUserDetails();
        if (userDetails?.data) {
          dispatch(setUserDetails(userDetails.data));
          window.location.reload();
          console.log("User details fetched successfully:");
        } else {
          console.error("Error fetching user details:");
        }
      }
    } catch (error) {
      form.setError("name", { type: "manual", message: "Submission failed." });
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          "There was an error updating your profile. Please try again.",
      });
    }
  }
  return (
    <section className="relative">
      <div className="flex items-center justify-between pb-10 pt-10 md:pb-10 md:pt-0">
        <h1 className="px-4 text-3xl font-semibold">My Profile</h1>

        <DialogForm
          button={
            <Button
              size="sm"
              className="rounded-md border-2 border-transparent bg-primary font-bold tracking-wider text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
            >
              <Pencil /> Edit
            </Button>
          }
          title="Edit Profile"
          description=" Make changes to your profile here. Click save when you're done."
          schema={ProfileSchema}
          defaultValues={{
            name: user.name || "",
            mobile: user.mobile || "",
            email: user.email || "",
            password: "",
          }}
          fields={[
            { name: "name", label: "Name", placeholder: "Enter your Name" },
            {
              name: "email",
              label: "Email",
              placeholder: "Enter your email",
            },
            {
              name: "mobile",
              label: "Mobile",
              placeholder: "Enter your mobile",
              type: "number",
            },
            {
              name: "password",
              label: "Password",
              placeholder: "Enter your password",
              type: "password",
            },
          ]}
          onSubmit={handleSubmit}
        />
      </div>
      {/* Profile Card */}
      <Card className="relative mr-auto flex w-auto flex-row items-center gap-4 border-none p-3 shadow-none">
        <div className="flex items-center justify-center">
          <AddProfileImage />
        </div>
        <div className=" ">
          <h3 className="text-md font-medium">
            <span className="text-xl font-semibold">{user?.name} </span>
          </h3>
          <h3 className="text-sm font-medium text-secondary/50">
            {user?.status}
          </h3>
          <h3 className="text-sm font-medium text-primary/50">
            Role : {user?.role}
          </h3>
        </div>
      </Card>
      {/* Personal Information */}
      <section className="py-6">
        <h2 className="mb-4 px-4 text-xl font-semibold">
          Personal Information
        </h2>
        <Card className="border-none p-4 shadow-none">
          <div className="mb-4">
            <h3 className="font-semibold text-secondary/50">Name</h3>
            <p className="font-medium text-secondary/70">{user?.name}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-secondary/50">Email</h3>
            <p className="font-medium text-secondary/70">{user?.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary/50">Mobile</h3>
            <p className="font-medium text-secondary/70">{user?.mobile}</p>
          </div>
        </Card>
      </section>
      {/* Address Section */}
      <section className="py-6">
        <h2 className="mb-4 px-4 text-xl font-semibold">Address</h2>
        <Card className="border-none p-4 shadow-none">
          {addressList
            .filter((item) => item.status == true) // Show only active addresses
            .map((item, index) => (
              <div key={index} className="mb-4 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-secondary/50">
                    Address Line
                  </h3>
                  <p className="font-medium text-secondary/70">
                    {item.address_line}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary/50">City</h3>
                  <p className="font-medium text-secondary/70">{item.city}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary/50">State</h3>
                  <p className="font-medium text-secondary/70">
                    {item.state} - {item.pincode}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary/50">Country</h3>
                  <p className="font-medium text-secondary/70">
                    {item.country}
                  </p>
                </div>
              </div>
            ))}
        </Card>
      </section>
    </section>
  );
}
