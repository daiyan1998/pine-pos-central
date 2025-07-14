
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { InventoryFormData, MenuItem } from "./types";
import { useInventoryForm } from "./hooks/useInventoryForm";
import { InventoryFormFields } from "./components/InventoryFormFields";
import { AddInventoryDialogTrigger } from "./components/AddInventoryDialogTrigger";

interface AddInventoryItemDialogProps {
  onAddItem: (item: InventoryFormData) => void;
  menuItems: MenuItem[];
}

export const AddInventoryItemDialog = ({ onAddItem, menuItems }: AddInventoryItemDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useInventoryForm();

  const handleSubmit = (data: InventoryFormData) => {
    onAddItem(data);
    
    const selectedMenuItem = menuItems.find(item => item.id === data.menuItemId);
    toast({
      title: "Inventory Item Added",
      description: `${selectedMenuItem?.name} has been added to inventory`,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AddInventoryDialogTrigger />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <InventoryFormFields control={form.control} menuItems={menuItems} />
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
