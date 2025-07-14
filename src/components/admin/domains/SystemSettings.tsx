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
import { Plus, Edit, Trash2, Search, Settings, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const settingSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: z.string().min(1, 'Setting value is required'),
  dataType: z.enum(['string', 'number', 'boolean', 'json']),
  category: z.string().min(1, 'Category is required'),
});

type SettingFormData = z.infer<typeof settingSchema>;

const SystemSettings = () => {
  const [settings, setSettings] = useState([
    {
      id: '1',
      key: 'restaurant_name',
      value: 'POSPine Restaurant',
      dataType: 'string',
      category: 'general',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      key: 'tax_rate',
      value: '8.5',
      dataType: 'number',
      category: 'tax',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      key: 'service_charge_rate',
      value: '5.0',
      dataType: 'number',
      category: 'service',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '4',
      key: 'auto_print_kot',
      value: 'true',
      dataType: 'boolean',
      category: 'general',
      createdAt: new Date('2024-01-01'),
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
  });

  const dataType = watch('dataType');

  const categories = Array.from(new Set(settings.map(s => s.category)));

  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || setting.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (setting: any) => {
    setEditingSetting(setting);
    setValue('key', setting.key);
    setValue('value', setting.value);
    setValue('dataType', setting.dataType);
    setValue('category', setting.category);
    setIsDialogOpen(true);
  };

  const handleDelete = (settingId: string) => {
    setSettings(settings.filter(setting => setting.id !== settingId));
  };

  const onSubmit = (data: SettingFormData) => {
    if (editingSetting) {
      setSettings(settings.map(setting => 
        setting.id === editingSetting.id 
          ? { ...setting, ...data, updatedAt: new Date() }
          : setting
      ));
    } else {
      const newSetting = {
        id: Date.now().toString(),
        key: data.key,
        value: data.value,
        dataType: data.dataType,
        category: data.category,
        createdAt: new Date(),
      };
      setSettings([...settings, newSetting]);
    }
    setIsDialogOpen(false);
    setEditingSetting(null);
    reset();
  };

  const getDataTypeBadge = (type: string) => {
    const colors = {
      string: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      boolean: 'bg-purple-100 text-purple-800',
      json: 'bg-orange-100 text-orange-800',
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      general: 'bg-gray-100 text-gray-800',
      tax: 'bg-red-100 text-red-800',
      service: 'bg-yellow-100 text-yellow-800',
      payment: 'bg-green-100 text-green-800',
    };
    return <Badge className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{category}</Badge>;
  };

  const renderValueInput = () => {
    switch (dataType) {
      case 'number':
        return <Input id="value" type="number" step="0.01" {...register('value')} />;
      case 'boolean':
        return (
          <Select onValueChange={(value) => setValue('value', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select boolean value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'json':
        return <Input id="value" placeholder='{"key": "value"}' {...register('value')} />;
      default:
        return <Input id="value" {...register('value')} />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure application settings and preferences</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingSetting(null); reset(); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Setting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>{editingSetting ? 'Edit Setting' : 'Add New Setting'}</DialogTitle>
                  <DialogDescription>
                    {editingSetting ? 'Update system setting' : 'Create a new system setting'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Setting Key</Label>
                    <Input id="key" {...register('key')} placeholder="e.g., restaurant_name" />
                    {errors.key && <p className="text-sm text-red-600">{errors.key.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataType">Data Type</Label>
                      <Select onValueChange={(value) => setValue('dataType', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="json">JSON</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.dataType && <p className="text-sm text-red-600">{errors.dataType.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input id="category" {...register('category')} placeholder="e.g., general" />
                      {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    {renderValueInput()}
                    {errors.value && <p className="text-sm text-red-600">{errors.value.message}</p>}
                  </div>

                  <DialogFooter>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingSetting ? 'Update Setting' : 'Create Setting'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSettings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium font-mono text-sm">{setting.key}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{setting.value}</TableCell>
                  <TableCell>{getDataTypeBadge(setting.dataType)}</TableCell>
                  <TableCell>{getCategoryBadge(setting.category)}</TableCell>
                  <TableCell>{setting.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(setting.id)}
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

export default SystemSettings;