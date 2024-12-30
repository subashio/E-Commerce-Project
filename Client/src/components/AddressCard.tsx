import EditAddress from "@/components/EditAddress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAddress } from "@/hooks/useAddress";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
export default function AddressCard() {
  const address = useSelector((state: RootState) => state.address.addressList);
  const { handleAddressStatus, handleDeleteAddress } = useAddress();
  return (
    <ScrollArea className="mt-8 h-[600px]">
      <div className="mb-10 mt-5 flex w-full flex-wrap justify-center gap-3">
        {address.map((item: any, index: any) => (
          <label
            onClick={() => handleAddressStatus(item._id)}
            key={index}
            className="w-full cursor-pointer px-3"
          >
            <input
              type="radio"
              className="peer sr-only"
              name="address"
              checked={item.status}
              onChange={() => handleAddressStatus(item._id)} // Update state on change
            />
            <div
              className={`w-full rounded-md border p-5 ring-2 ring-transparent transition-all hover:shadow dark:bg-gray-900 dark:text-gray-300 ${
                item.status ? "bg-primary/10 text-green-900" : ""
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase text-gray-500">
                    {item.address_title}
                  </p>
                  <div>
                    <svg width={24} height={24} viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-sm font-semibold">{item.address_line}</p>
                  <p className="text-sm font-semibold">
                    {item.city}, <span>{item.country}</span>
                  </p>
                </div>
                <p className="text-sm font-semibold">{item.mobile},</p>
              </div>
              <div className="z-10 flex w-full items-center justify-end gap-2">
                <Button
                  onClick={(e) => handleDeleteAddress(item._id, e)}
                  className=""
                  variant="destructive"
                >
                  Delete
                </Button>
                <EditAddress
                  button={
                    <Button onClick={(e) => e.stopPropagation()}>Edit</Button>
                  }
                  data={item}
                />
              </div>
            </div>
          </label>
        ))}
      </div>
    </ScrollArea>
  );
}
