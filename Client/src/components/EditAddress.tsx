import DialogForm from "@/components/DialogForm";
import { useAddress } from "@/hooks/useAddress";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const addressSchema = z.object({
  _id: z.any(),
  address_title: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),

  address_line: z.string().min(1, { message: "Address is required." }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long." }),
  state: z
    .string()
    .min(2, { message: "statr must be at least 2 characters long." }),
  pincode: z
    .string()
    .length(6, { message: "Pincode must be exactly 6 digits long." }) // Assumes pincode is a 6-digit number.
    .regex(/^\d+$/, { message: "Pincode must contain only numbers." }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters long." }),
  mobile: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits long." })
    .regex(/^\d+$/, { message: "Mobile number must contain only numbers." }),
});

export type EditAddressProp = {
  _id?: string;
  address_line: string;
  address_title: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  mobile: string;
};

export default function EditAddress({
  data,
  button,
}: {
  data: EditAddressProp;
  button: ReactNode;
}) {
  const { editAddressDetails } = useAddress();

  async function handleSubmit(
    data: z.infer<typeof addressSchema>,
    form: UseFormReturn<z.infer<typeof addressSchema>>,
    closeDialog: () => void,
  ) {
    try {
      await editAddressDetails(data, closeDialog);
    } catch (error) {
      form.setError("address_title", {
        type: "manual",
        message: "Submission failed.",
      });
    }
  }
  return (
    <DialogForm
      button={button}
      title="Edit Address"
      description=" Edit your Address here. Click save when you're done."
      schema={addressSchema}
      defaultValues={{
        _id: data._id || "",
        address_title: data.address_title || "",
        address_line: data.address_line || "",
        mobile: data.mobile || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        pincode: data.pincode || "",
      }}
      fields={[
        {
          name: "address_title",
          label: "Save address as",
          placeholder:
            "Enter a name for your address, e.g., Home, Work, or Other",
        },
        {
          name: "address_line",
          label: "Address",
          placeholder: "Enter your Address",
        },
        { name: "city", label: "City", placeholder: "Enter your  City" },
        { name: "state", label: "State", placeholder: "Enter your  State" },
        {
          name: "country",
          label: "Country",
          placeholder: "Enter your  Country",
        },
        {
          name: "pincode",
          label: "Pincode",
          placeholder: "Enter your  Pincode",
          type: "number",
        },
        {
          name: "mobile",
          label: "Mobile",
          placeholder: "Enter your  Mobile",
          type: "number",
        },
      ]}
      onSubmit={handleSubmit}
    />
  );
}
