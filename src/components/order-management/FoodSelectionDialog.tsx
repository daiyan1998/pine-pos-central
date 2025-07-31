
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface FoodSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItems: (items: OrderItem[]) => void;
}

export const FoodSelectionDialog = ({ open, onOpenChange, onAddItems }: FoodSelectionDialogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

  // Mock menu items - in real app this would come from props or API
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Burger',
      category: 'main',
      price: 12.99,
      description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
      available: true
    },
    {
      id: '2',
      name: 'Caesar Salad',
      category: 'starters',
      price: 8.99,
      description: 'Fresh romaine lettuce with caesar dressing and croutons',
      available: true
    },
    {
      id: '3',
      name: 'Coca Cola',
      category: 'beverages',
      price: 2.99,
      description: 'Refreshing soft drink',
      available: true
    },
    {
      id: '4',
      name: 'Margherita Pizza',
      category: 'main',
      price: 14.99,
      description: 'Fresh mozzarella, tomato sauce, and basil',
      available: true
    },
    {
      id: '5',
      name: 'Garlic Bread',
      category: 'starters',
      price: 4.99,
      description: 'Toasted bread with garlic butter and herbs',
      available: true
    }
  ];

  const filteredItems = menuItems.filter(item => 
    item.available && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQuantity = (itemId: string, change: number) => {
    setSelectedItems(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);
      if (newQty === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleAddToOrder = () => {
    const orderItems: OrderItem[] = Object.entries(selectedItems).map(([itemId, quantity]) => {
      const menuItem = menuItems.find(item => item.id === itemId)!;
      return {
        id: itemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity
      };
    });

    if (orderItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item",
        variant: "destructive",
      });
      return;
    }

    onAddItems(orderItems);
    setSelectedItems({});
    setSearchTerm("");
    onOpenChange(false);
    
    toast({
      title: "Items added",
      description: `${orderItems.length} item(s) added to order`,
    });
  };

  const getTotalPrice = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Food Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Menu Items */}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900">${item.price}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedItems[item.id] > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {selectedItems[item.id] > 0 && (
                        <span className="w-8 text-center font-medium">
                          {selectedItems[item.id]}
                        </span>
                      )}
                      
                      <Button
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          {Object.keys(selectedItems).length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total Items: {Object.values(selectedItems).reduce((a, b) => a + b, 0)}</span>
                <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedItems({});
                setSearchTerm("");
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddToOrder}>
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
