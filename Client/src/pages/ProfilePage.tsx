import AddProfileImage from "@/components/AddProfileImage";
import DialogForm from "@/components/DialogForm";
import EditAddress from "@/components/EditAddress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SummaryApi } from "@/constants/SummaryApi";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import Axios from "@/lib/Axios";
import { RootState } from "@/store/store";
import { setUserDetails } from "@/store/userSlice";
import { Pencil, UserRoundPen } from "lucide-react";
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
  const user = useSelector((state: RootState) => state?.user.currentUser);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { fetchUserDetails } = useUser();
  const address = useSelector((state: RootState) => state.address.addressList);

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
      <div className="flex items-center justify-between pb-10 pt-4 md:pb-10 lg:pt-0">
        <h1 className="px-4 text-3xl font-semibold xl:px-6">My Profile</h1>
      </div>
      {/* Profile Card */}
      {!user?.isWholesaler ? (
        <Card className="relative mx-2 mr-auto flex w-full flex-row items-center justify-between gap-4 border p-3 shadow-none xl:mx-6">
          <div className="flex items-center justify-center gap-4">
            {/* user image */}
            <div className="group relative h-20 w-20 rounded-full border">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="h-20 w-20 rounded-full object-contain object-center"
              />
              <UserRoundPen className="absolute right-2 top-2 hidden rounded-full bg-gray-950/80 p-1.5 text-white group-hover:block dark:bg-white dark:text-gray-950" />
            </div>
            <div className="">
              <p className="text-md font-semibold">{user?.name}</p>
              <p className="text-sm font-medium text-secondary/50">
                {user?.isWholesaler ? "Wholesaler" : "Retailer"}
              </p>
              <p className="text-sm font-medium capitalize text-primary/50">
                Role : {user?.role === "ADMIN" ? "admin" : "user"}
              </p>
            </div>
          </div>

          <AddProfileImage />
        </Card>
      ) : (
        <Card className="relative mx-2 mr-auto flex w-auto flex-row items-center justify-between gap-4 border p-3 shadow-none xl:mx-6">
          <div className="flex items-center gap-3">
            <div className="group relative h-20 w-20 rounded-full border">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="h-20 w-20 rounded-full object-contain object-center"
              />
              <UserRoundPen className="absolute right-2 top-2 hidden rounded-full bg-gray-950/80 p-1.5 text-white group-hover:block dark:bg-white dark:text-gray-950" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-md font-semibold">
                {user?.name}{" "}
                <span className="text-xs font-medium capitalize text-primary/50">
                  {user?.role === "USER" ? "user" : "admin"}
                </span>
              </p>
              <p className="text-xs font-medium text-secondary/50">
                {user?.companyName}
              </p>
              <p className="text-xs font-medium text-secondary/50">
                Type: {user?.isWholesaler ? "Wholesaler" : "Retailer"}
              </p>
            </div>
          </div>
          <AddProfileImage />
        </Card>
      )}
      {/* Personal Information */}
      <section className="mx-2 mr-auto mt-4 flex w-full justify-between gap-4 rounded-md border p-4 py-6 xl:mx-6">
        <Card className="border-none px-4 shadow-none">
          <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
          <div className="mb-4">
            <p className="text-sm font-semibold text-secondary/50">Name</p>
            <p className="text-sm font-medium text-secondary/70">
              {user?.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold text-secondary/50">Email</p>
            <p className="text-sm font-medium text-secondary/70">
              {user?.email}
            </p>
          </div>
          {user?.mobile && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-secondary/50">
                Mobile
              </h2>
              <p className="text-sm font-medium text-secondary/70">
                {user?.mobile ? user?.mobile : user?.officePhone}
              </p>
            </div>
          )}
          {user?.officeAddress && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-secondary/50">
                Office Address
              </p>
              <p className="text-sm font-medium text-secondary/70">
                {user?.officeAddress}
              </p>
            </div>
          )}
        </Card>
        <DialogForm
          button={
            <Button
              size="sm"
              variant="outline"
              className=""
              // className="rounded-md border-2 border-transparent bg-primary font-bold tracking-wider text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
            >
              <Pencil /> Edit
            </Button>
          }
          title="Edit Profile"
          description=" Make changes to your profile here. Click save when you're done."
          schema={ProfileSchema}
          defaultValues={{
            name: user?.name || "",
            mobile: user?.mobile || "",
            email: user?.email || "",
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
            ...(user?.isWholesaler === true
              ? [
                  {
                    name: "companyName",
                    label: "Company Name",
                    placeholder: "Enter your company name",
                  },
                ]
              : []),
            {
              name: "password",
              label: "Password",
              placeholder: "Enter your password",
              type: "password",
            },
          ]}
          onSubmit={handleSubmit}
        />
      </section>
      {/* Address Section */}
      {address.length > 0 && (
        <section className="mx-2 my-4 mr-auto flex w-full justify-center border px-4 py-6 xl:mx-6">
          <Card className="w-full rounded-lg border-none px-4 shadow-none">
            <h2 className="mb-4 text-xl font-semibold">
              {address.filter((item) => item.status == true).length > 0 &&
                "Address"}
            </h2>
            {address
              .filter((item) => item.status == true) // Show only active addresses
              .map((item, index) => (
                <div key={index} className="mb-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="font-semibold text-secondary/50">
                      Address Line
                    </p>
                    <p className="text-sm font-medium text-secondary/70">
                      {item.address_line}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary/50">
                      City
                    </p>
                    <p className="text-sm font-medium text-secondary/70">
                      {item.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary/50">
                      State
                    </p>
                    <p className="text-sm font-medium text-secondary/70">
                      {item.state} - {item.pincode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary/50">
                      Country
                    </p>
                    <p className="text-sm font-medium text-secondary/70">
                      {item.country}
                    </p>
                  </div>
                </div>
              ))}
          </Card>
          {address
            .filter((item) => item.status == true)
            .map((item: any, index: any) => (
              <EditAddress
                key={index}
                button={
                  <Button
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Pencil /> Edit
                  </Button>
                }
                data={item}
              />
            ))}
        </section>
      )}
    </section>
  );
}
