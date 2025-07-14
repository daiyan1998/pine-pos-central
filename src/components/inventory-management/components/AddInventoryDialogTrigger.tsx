import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const AddInventoryDialogTrigger = () => {
  return (
    <DialogTrigger asChild>
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
    </DialogTrigger>
  );
};