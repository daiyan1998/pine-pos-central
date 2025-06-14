
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewOrderDialogProps {
  onAddOrder: (order: {
    tableNumber: number;
    orderType: 'dine-in' | 'takeaway' | 'delivery';
    customerName?: string;
  }) => void;
}

export const NewOrderDialog = ({ onAddOrder }: NewOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderType === 'dine-in' && !tableNumber) {
      toast({
        title: "Error",
        description: "Please select a table number for dine-in orders",
        variant: "destructive",
      });
      return;
    }

    if ((orderType === 'takeaway' || orderType === 'delivery') && !customerName) {
      toast({
        title: "Error",
        description: "Please enter customer name for takeaway/delivery orders",
        variant: "destructive",
      });
      return;
    }

    onAddOrder({
      tableNumber: orderType === 'dine-in' ? parseInt(tableNumber) : 0,
      orderType,
      customerName: orderType !== 'dine-in' ? customerName : undefined,
    });

    toast({
      title: "Success",
      description: "New order created successfully",
    });

    setOrderType('dine-in');
    setTableNumber("");
    setCustomerName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type</Label>
            <Select value={orderType} onValueChange={(value: 'dine-in' | 'takeaway' | 'delivery') => setOrderType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dine-in">Dine In</SelectItem>
                <SelectItem value="takeaway">Takeaway</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {orderType === 'dine-in' && (
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
          )}

          {(orderType === 'takeaway' || orderType === 'delivery') && (
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
