
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  variants?: { name: string; price: number }[];
}

export const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Chicken Burger',
      category: 'main',
      price: 12.99,
      description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
      available: true,
      variants: [
        { name: 'Regular', price: 12.99 },
        { name: 'Large', price: 15.99 }
      ]
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
      available: true,
      variants: [
        { name: 'Small', price: 2.99 },
        { name: 'Medium', price: 3.99 },
        { name: 'Large', price: 4.99 }
      ]
    },
    {
      id: '4',
      name: 'Chocolate Cake',
      category: 'desserts',
      price: 6.99,
      description: 'Rich chocolate cake with cream frosting',
      available: false
    },
    {
      id: '5',
      name: 'Margherita Pizza',
      category: 'main',
      price: 14.99,
      description: 'Fresh mozzarella, tomato sauce, and basil',
      available: true
    },
    {
      id: '6',
      name: 'Garlic Bread',
      category: 'starters',
      price: 4.99,
      description: 'Toasted bread with garlic butter and herbs',
      available: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Items', count: menuItems.length },
    { id: 'starters', name: 'Starters', count: menuItems.filter(item => item.category === 'starters').length },
    { id: 'main', name: 'Main Course', count: menuItems.filter(item => item.category === 'main').length },
    { id: 'beverages', name: 'Beverages', count: menuItems.filter(item => item.category === 'beverages').length },
    { id: 'desserts', name: 'Desserts', count: menuItems.filter(item => item.category === 'desserts').length }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items and categories.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="flex flex-col gap-1 py-3 data-[state=active]:bg-white"
            >
              <span className="font-medium">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count} items</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </CardTitle>
                      <Badge 
                        variant={item.available ? "default" : "secondary"}
                        className={`mt-1 ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="p-2">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="p-2 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                    <Button
                      size="sm"
                      variant={item.available ? "outline" : "default"}
                      onClick={() => toggleAvailability(item.id)}
                      className={item.available ? "" : "bg-green-600 hover:bg-green-700 text-white"}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                  
                  {item.variants && item.variants.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Variants:</p>
                      <div className="space-y-1">
                        {item.variants.map((variant, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{variant.name}</span>
                            <span className="font-medium">${variant.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
