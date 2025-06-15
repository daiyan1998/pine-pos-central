import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, AlertTriangle, Package, TrendingDown, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddInventoryItemDialog } from "./AddInventoryItemDialog";
import { EditInventoryItemDialog } from "./EditInventoryItemDialog";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
}

export const InventoryManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'INV001',
      name: 'Chicken Breast',
      category: 'meat',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: 'kg',
      costPerUnit: 8.50,
      supplier: 'Fresh Meats Co.',
      lastUpdated: '2025-06-14 10:00'
    },
    {
      id: 'INV002',
      name: 'Tomatoes',
      category: 'vegetables',
      currentStock: 5,
      minStock: 15,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 3.20,
      supplier: 'Green Valley Farms',
      lastUpdated: '2025-06-14 09:30'
    },
    {
      id: 'INV003',
      name: 'Mozzarella Cheese',
      category: 'dairy',
      currentStock: 12,
      minStock: 8,
      maxStock: 30,
      unit: 'kg',
      costPerUnit: 12.00,
      supplier: 'Dairy Fresh Ltd.',
      lastUpdated: '2025-06-14 11:15'
    },
    {
      id: 'INV004',
      name: 'Coca Cola Cans',
      category: 'beverages',
      currentStock: 45,
      minStock: 20,
      maxStock: 200,
      unit: 'units',
      costPerUnit: 0.80,
      supplier: 'Beverage Distributors',
      lastUpdated: '2025-06-14 08:45'
    },
    {
      id: 'INV005',
      name: 'Flour',
      category: 'pantry',
      currentStock: 2,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 1.50,
      supplier: 'Grain Suppliers Inc.',
      lastUpdated: '2025-06-14 07:20'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'meat', name: 'Meat & Poultry' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'dairy', name: 'Dairy Products' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'pantry', name: 'Pantry Items' }
  ];

  const addInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: `INV${String(inventory.length + 1).padStart(3, '0')}`,
      lastUpdated: new Date().toLocaleString()
    };
    
    setInventory(prev => [...prev, item]);
  };

  const editInventoryItem = (itemId: string, updatedItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...updatedItem, id: itemId, lastUpdated: new Date().toLocaleString() }
        : item
    ));
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'critical';
    if (item.currentStock <= item.minStock * 1.5) return 'low';
    return 'good';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateStock = (itemId: string, newStock: number) => {
    if (newStock < 0) {
      toast({
        title: "Error",
        description: "Stock cannot be negative",
        variant: "destructive"
      });
      return;
    }

    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: newStock, lastUpdated: new Date().toLocaleString() }
        : item
    ));
    
    toast({
      title: "Stock Updated",
      description: `Inventory updated for item ${itemId}`,
    });
  };

  const deleteItem = (itemId: string) => {
    const item = inventory.find(item => item.id === itemId);
    
    setInventory(prev => prev.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from inventory`,
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => getStockStatus(item) !== 'good');
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your restaurant's stock levels.</p>
        </div>
        <AddInventoryItemDialog onAddItem={addInventoryItem} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-xl font-bold text-gray-900">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold text-gray-900">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Needs Reorder</p>
                <p className="text-xl font-bold text-gray-900">
                  {inventory.filter(item => item.currentStock <= item.minStock).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-3">
              {lowStockItems.length} item(s) need immediate attention:
            </p>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="font-medium">{item.name}</span>
                  <Badge className={getStatusColor(getStockStatus(item))}>
                    {item.currentStock} {item.unit} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.supplier}</p>
                    <p className="text-xs text-gray-500">Last updated: {item.lastUpdated}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Current Stock</p>
                      <p className="font-bold">{item.currentStock} {item.unit}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Min Stock</p>
                      <p className="font-medium">{item.minStock} {item.unit}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Cost/Unit</p>
                      <p className="font-medium">${item.costPerUnit}</p>
                    </div>
                    
                    <Badge className={getStatusColor(getStockStatus(item))}>
                      {getStockStatus(item)}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="New stock"
                        className="w-24"
                        id={`stock-input-${item.id}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const newStock = parseInt((e.target as HTMLInputElement).value);
                            if (!isNaN(newStock)) {
                              updateStock(item.id, newStock);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const input = document.getElementById(`stock-input-${item.id}`) as HTMLInputElement;
                          const newStock = parseInt(input.value);
                          if (!isNaN(newStock)) {
                            updateStock(item.id, newStock);
                            input.value = '';
                          }
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <EditInventoryItemDialog 
                        item={item}
                        onEditItem={editInventoryItem}
                      />
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteItem(item.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No inventory items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
