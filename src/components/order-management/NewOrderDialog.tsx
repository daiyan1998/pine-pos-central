
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FoodSelectionDialog } from "./FoodSelectionDialog";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useGetTables } from "@/api/queries/tables";
import { useCreateOrder } from "@/api/mutations/order";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export const NewOrderDialog = () => {
  const {  tables } = useRestaurant();
  const [open, setOpen] = useState(false);
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [tableNumber, setTableNumber] = useState("");
  const [tableId,setTableId] = useState("")
  const [customerName, setCustomerName] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const getTables = useGetTables()
  const createOrder = useCreateOrder()


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createOrder.mutate({ orderType, tableNumber, customerName, orderItems,tableId })

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setOrderType('DINE_IN');
    setTableNumber("");
    setCustomerName("");
    setOrderItems([]);
  };

  const handleAddItems = (items: OrderItem[]) => {
    setOrderItems(prev => {
      const newItems = [...prev];
      items.forEach(newItem => {
        const existingIndex = newItems.findIndex(item => item.id === newItem.id);
        if (existingIndex >= 0) {
          newItems[existingIndex].quantity += newItem.quantity;
        } else {
          newItems.push(newItem);
        }
      });
      return newItems;
    });
  };

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // --- NEW: Available tables logic
  const availableTables = getTables.data?.data.filter((t) => t.status === "AVAILABLE");


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={(value: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => setOrderType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DINE_IN">Dine In</SelectItem>
                  <SelectItem value="TAKEAWAY">Takeaway</SelectItem>
                  <SelectItem value="DELIVERY">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {orderType === 'DINE_IN' && (
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number</Label>
                {availableTables?.length === 0 && <p className="text-sm text-muted-foreground">No tables available</p>}
                {availableTables?.length > 0 && 
                <Select
                  value={tableNumber}
                  onValueChange={setTableId}
                  disabled={availableTables?.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableTables.length === 0 ? "No tables available" : "Select a table"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.length === 0 ? (
                      <SelectItem value="" disabled>No tables available</SelectItem>
                    ) : availableTables.map(table => (
                      <SelectItem key={table.id} value={String(table.id)}>
                        Table {table.tableNumber} ({table.capacity} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                }
              </div>
            )}

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

            {/* Food Items Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Food Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFoodDialogOpen(true)}
                >
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Add Items
                </Button>
              </div>
              
              {orderItems.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold text-sm">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic border rounded-md p-2">
                  No items added yet
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <FoodSelectionDialog
        open={foodDialogOpen}
        onOpenChange={setFoodDialogOpen}
        onAddItems={handleAddItems}
      />
    </>
  );
};
