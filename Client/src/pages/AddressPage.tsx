import AddAddress from "@/components/AddAddress";
import AddressCard from "@/components/AddressCard";

export default function AddressPage() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between pb-10 pt-10 md:pb-10 md:pt-0">
        <h1 className="px-4 text-3xl font-semibold">My Address</h1>
        <AddAddress />
      </div>
      <AddressCard />
    </div>
  );
}
