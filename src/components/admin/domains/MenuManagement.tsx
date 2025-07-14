import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  basePrice: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      basePrice: 12.99,
      categoryId: '1',
      categoryName: 'Appetizers',
      imageUrl: null,
      isAvailable: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      variants: 2,
    },
    {
      id: '2',
      name: 'Grilled Chicken',
      description: 'Perfectly grilled chicken breast with herbs',
      basePrice: 18.99,
      categoryId: '2',
      categoryName: 'Main Courses',
      imageUrl: null,
      isAvailable: true,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      variants: 3,
    },
  ]);

  const [categories] = useState([
    { id: '1', name: 'Appetizers' },
    { id: '2', name: 'Main Courses' },
    { id: '3', name: 'Desserts' },
    { id: '4', name: 'Beverages' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      isAvailable: true,
      isActive: true,
    }
  });

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setValue('name', item.name);
    setValue('description', item.description || '');
    setValue('basePrice', item.basePrice);
    setValue('categoryId', item.categoryId);
    setValue('imageUrl', item.imageUrl || '');
    setValue('isAvailable', item.isAvailable);
    setValue('isActive', item.isActive);
    setIsDialogOpen(true);
  };

  const handleDelete = (itemId: string) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  const onSubmit = (data: MenuItemFormData) => {
    const categoryName = categories.find(c => c.id === data.categoryId)?.name || '';
    
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...data, categoryName, updatedAt: new Date() }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || '',
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        categoryName,
        imageUrl: data.imageUrl || null,
        isAvailable: data.isAvailable,
        isActive: data.isActive,
        createdAt: new Date(),
        variants: 0,
      };
      setMenuItems([...menuItems, newItem]);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Item Management</CardTitle>
              <CardDescription>Manage your restaurant menu items and pricing</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingItem(null); reset(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update menu item information' : 'Create a new menu item'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register('description')} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="basePrice">Base Price ($)</Label>
                      <Input 
                        id="basePrice" 
                        type="number" 
                        step="0.01"
                        {...register('basePrice', { valueAsNumber: true })} 
                      />
                      {errors.basePrice && <p className="text-sm text-red-600">{errors.basePrice.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category</Label>
                      <Select onValueChange={(value) => setValue('categoryId', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input id="imageUrl" {...register('imageUrl')} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="isAvailable" {...register('isAvailable')} />
                      <Label htmlFor="isAvailable">Available for Order</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="isActive" {...register('isActive')} />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
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
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.categoryName}</TableCell>
                  <TableCell>${item.basePrice.toFixed(2)}</TableCell>
                  <TableCell>{item.variants} variants</TableCell>
                  <TableCell>
                    <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.createdAt.toLocaleDateString()}</TableCell>
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

export default MenuManagement;