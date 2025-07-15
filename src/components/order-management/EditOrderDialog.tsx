
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { Order } from "@/types/order.type";



interface EditOrderDialogProps {
  order: Order;
}

export const EditOrderDialog = ({ order }: EditOrderDialogProps) => {
  const { updateOrder } = useRestaurant();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(order.orderItems);
  const { toast } = useToast();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTotal = items.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    
    updateOrder(order.id, {
      items,
      total: newTotal
    });

    toast({
      title: "Order Updated",
      description: `Order ${order.id} has been updated successfully`,
    });

    setOpen(false);
  };

  const canEdit = order.status === 'PENDING' || order.status === 'IN_PREPARATION';

  if (!canEdit) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Order {order.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.menuItem.name}</span>
                  <span className="text-sm text-gray-600">${item.totalPrice} each</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Label className="text-sm">Quantity:</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="ml-auto font-medium">
                    ${(item.unitPrice * item.quantity)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm">Special Notes:</Label>
                  <Input
                    value={item.notes || ''}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                    placeholder="Add special instructions..."
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-lg font-semibold">
              Total: ${items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)}
            </span>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
