import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setDialogOpen } from "@/store/ProductSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

interface AlertDialogProps {
  handleBanWholesaler: () => void; // Function to handle ban action
}

export default function AlertDialog({ handleBanWholesaler }: AlertDialogProps) {
  const dialogOpen = useSelector(
    (state: RootState) => state.product.dialogOpen,
  );
  const dispatch = useDispatch();
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open: boolean) => dispatch(setDialogOpen(open))}
    >
      <DialogTrigger>
        <button className="text-red-500">Delete</button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Are you sure you want to ban this user?</DialogTitle>
          <DialogDescription>
            This action will permanently ban the user from the platform.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full items-center justify-center gap-2">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleBanWholesaler(); // Perform the ban action
              dispatch(setDialogOpen(false)); // Close the dialog
            }}
            variant="destructive"
            className="w-full"
          >
            Ban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
