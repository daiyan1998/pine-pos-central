
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTableDialogProps {
  onAddTable: (table: { number: number; seats: number }) => void;
}

export const AddTableDialog = ({ onAddTable }: AddTableDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableNumber || !seats) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onAddTable({
      number: parseInt(tableNumber),
      seats: parseInt(seats),
    });

    toast({
      title: "Success",
      description: `Table ${tableNumber} added successfully`,
    });

    setTableNumber("");
    setSeats("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seats">Number of Seats</Label>
            <Input
              id="seats"
              type="number"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              placeholder="Enter number of seats"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Table</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
