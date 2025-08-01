
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant } from "@/contexts/RestaurantContext";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
}

export const NewOrderDialog = () => {
  const { addOrder, tables } = useRestaurant();
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in');
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();

  // Mock menu items
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

    addOrder({
      tableNumber: orderType === 'dine-in' ? parseInt(tableNumber) : 0,
      orderType,
      customerName: orderType !== 'dine-in' ? customerName : undefined,
      items: orderItems,
    });

    toast({
      title: "Success",
      description: "New order created successfully",
    });

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setOrderType('dine-in');
    setTableNumber("");
    setCustomerName("");
    setOrderItems([]);
    setSearchTerm("");
    setActiveTab("details");
  };

  const addMenuItem = (menuItem: MenuItem) => {
    setOrderItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === menuItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1
        }];
      }
    });
    
    toast({
      title: "Item added",
      description: `${menuItem.name} added to order`,
    });
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    setOrderItems(prev => {
      const updated = [...prev];
      const index = updated.findIndex(item => item.id === itemId);
      if (index >= 0) {
        updated[index].quantity += change;
        if (updated[index].quantity <= 0) {
          return updated.filter(item => item.id !== itemId);
        }
      }
      return updated;
    });
  };

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Available tables logic
  const availableTables = tables.filter((t) => t.status === "available");

  const filteredMenuItems = menuItems.filter(item => 
    item.available && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(menuItems.map(item => item.category))];
  const getItemsByCategory = (category: string) => 
    filteredMenuItems.filter(item => item.category === category);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="menu">Add Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                      <Select
                        value={tableNumber}
                        onValueChange={setTableNumber}
                        disabled={availableTables.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={availableTables.length === 0 ? "No tables available" : "Select a table"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTables.length === 0 ? (
                            <SelectItem value="" disabled>No tables available</SelectItem>
                          ) : availableTables.map(table => (
                            <SelectItem key={table.id} value={String(table.number)}>
                              Table {table.number} ({table.seats} seats)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                </div>

                {/* Order Items Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Order Items ({orderItems.length})</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("menu")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Items
                    </Button>
                  </div>
                  
                  {orderItems.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{item.name}</span>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, -1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground italic border rounded-md p-4 text-center">
                      No items added yet. Click "Add Items" to browse the menu.
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={orderItems.length === 0}>
                    Create Order
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="menu" className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Menu Items by Category */}
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {categories.map(category => {
                  const categoryItems = getItemsByCategory(category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-lg capitalize">{category}</h3>
                      <div className="grid gap-2">
                        {categoryItems.map((item) => (
                          <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold">${item.price}</span>
                                    <Badge variant="secondary" className="text-xs capitalize">
                                      {item.category}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <Button
                                  onClick={() => addMenuItem(item)}
                                  size="sm"
                                  className="ml-4"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Order Details
                </Button>
                <span className="font-medium">
                  {orderItems.length} item(s) selected • ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

    </>
  );
};
