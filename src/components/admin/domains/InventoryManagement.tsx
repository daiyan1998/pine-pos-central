import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const inventorySchema = z.object({
  menuItemId: z.string().min(1, 'Menu item is required'),
  currentStock: z.number().min(0, 'Current stock must be 0 or greater'),
  minStock: z.number().min(0, 'Minimum stock must be 0 or greater'),
  maxStock: z.number().min(0, 'Maximum stock must be 0 or greater').optional(),
  unit: z.string().min(1, 'Unit is required'),
  isActive: z.boolean().default(true),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

const InventoryManagement = () => {
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: '1',
      menuItemId: '1',
      menuItemName: 'Caesar Salad',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'servings',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      isLowStock: false,
    },
    {
      id: '2',
      menuItemId: '2',
      menuItemName: 'Grilled Chicken',
      currentStock: 5,
      minStock: 8,
      maxStock: 30,
      unit: 'portions',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      isLowStock: true,
    },
  ]);

  const [menuItems] = useState([
    { id: '1', name: 'Caesar Salad' },
    { id: '2', name: 'Grilled Chicken' },
    { id: '3', name: 'Chocolate Cake' },
    { id: '4', name: 'Coffee' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      isActive: true,
    }
  });

  const filteredItems = inventoryItems.filter(item =>
    item.menuItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setValue('menuItemId', item.menuItemId);
    setValue('currentStock', item.currentStock);
    setValue('minStock', item.minStock);
    setValue('maxStock', item.maxStock);
    setValue('unit', item.unit);
    setValue('isActive', item.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
  };

  const updateStock = (itemId: string, newStock: number) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            currentStock: newStock, 
            isLowStock: newStock <= item.minStock 
          }
        : item
    ));
  };

  const onSubmit = (data: InventoryFormData) => {
    const menuItemName = menuItems.find(m => m.id === data.menuItemId)?.name || '';
    
    if (editingItem) {
      setInventoryItems(inventoryItems.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...data, 
              menuItemName,
              isLowStock: data.currentStock <= data.minStock,
              updatedAt: new Date() 
            }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now().toString(),
        menuItemId: data.menuItemId,
        menuItemName,
        currentStock: data.currentStock,
        minStock: data.minStock,
        maxStock: data.maxStock,
        unit: data.unit,
        isActive: data.isActive,
        createdAt: new Date(),
        isLowStock: data.currentStock <= data.minStock,
      };
      setInventoryItems([...inventoryItems, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              {lowStockItems.length} item(s) are running low on stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="font-medium">{item.menuItemName}</span>
                  <span className="text-orange-700">
                    {item.currentStock} {item.unit} remaining (min: {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track stock levels and manage inventory</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingItem(null); reset(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Inventory Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update inventory information' : 'Create a new inventory tracking item'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuItemId">Menu Item</Label>
                    <Select onValueChange={(value) => setValue('menuItemId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select menu item" />
                      </SelectTrigger>
                      <SelectContent>
                        {menuItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.menuItemId && <p className="text-sm text-red-600">{errors.menuItemId.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentStock">Current Stock</Label>
                      <Input 
                        id="currentStock" 
                        type="number" 
                        {...register('currentStock', { valueAsNumber: true })} 
                      />
                      {errors.currentStock && <p className="text-sm text-red-600">{errors.currentStock.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input id="unit" {...register('unit')} placeholder="e.g., kg, pcs, servings" />
                      {errors.unit && <p className="text-sm text-red-600">{errors.unit.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input 
                        id="minStock" 
                        type="number" 
                        {...register('minStock', { valueAsNumber: true })} 
                      />
                      {errors.minStock && <p className="text-sm text-red-600">{errors.minStock.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxStock">Maximum Stock</Label>
                      <Input 
                        id="maxStock" 
                        type="number" 
                        {...register('maxStock', { valueAsNumber: true })} 
                      />
                      {errors.maxStock && <p className="text-sm text-red-600">{errors.maxStock.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isActive" {...register('isActive')} />
                    <Label htmlFor="isActive">Active</Label>
                  </div>

                  <DialogFooter>
                    <Button type="submit">
                      {editingItem ? 'Update Item' : 'Create Item'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Menu Item</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Max Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.menuItemName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{item.currentStock}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStock(item.id, item.currentStock + 1)}
                        className="h-6 w-6 p-0"
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 1))}
                        className="h-6 w-6 p-0"
                      >
                        -
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.minStock}</TableCell>
                  <TableCell>{item.maxStock || '-'}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.isLowStock ? 'destructive' : 'default'}
                      className={item.isLowStock ? '' : 'bg-green-100 text-green-800'}
                    >
                      {item.isLowStock ? 'Low Stock' : 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;