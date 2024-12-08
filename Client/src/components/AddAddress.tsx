import DialogForm from "@/components/DialogForm";
import { Button } from "@/components/ui/button";
import { addressSchema } from "@/constants/schema";
import { useAddress } from "@/hooks/useAddress";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export default function AddAddress() {
  const { addAddressDetails } = useAddress();

  async function handleSubmit(
    data: z.infer<typeof addressSchema>,
    form: UseFormReturn<z.infer<typeof addressSchema>>,
    closeDialog: () => void,
  ) {
    try {
      await addAddressDetails(data, closeDialog);
    } catch (error) {
      form.setError("address_title", {
        type: "manual",
        message: "Submission failed.",
      });
    }
  }
  return (
    <DialogForm
      button={
        <Button
          size="sm"
          className="rounded-md border-2 border-transparent bg-primary font-bold tracking-wider text-white transition duration-200 hover:border-primary hover:bg-white hover:text-black"
        >
          <Plus /> Add
        </Button>
      }
      title="New Address"
      description=" Add a new Address here. Click save when you're done."
      schema={addressSchema}
      defaultValues={{
        address_title: "",
        address_line: "",
        mobile: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
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
