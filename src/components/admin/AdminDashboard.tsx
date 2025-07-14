import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ShoppingCart, Package, Settings, Activity, CreditCard } from 'lucide-react';

// Domain components
import UserManagement from './domains/UserManagement';
import CategoryManagement from './domains/CategoryManagement';
import MenuManagement from './domains/MenuManagement';
import OrderManagement from './domains/OrderManagement';
import BillingManagement from './domains/BillingManagement';
import InventoryManagement from './domains/InventoryManagement';
import SystemSettings from './domains/SystemSettings';
import ActivityLogs from './domains/ActivityLogs';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const dashboardStats = [
    { title: 'Total Users', value: '24', icon: Users, description: 'Active staff members' },
    { title: 'Active Orders', value: '8', icon: ShoppingCart, description: 'Currently processing' },
    { title: 'Menu Items', value: '156', icon: Package, description: 'Available items' },
    { title: 'Today\'s Revenue', value: '$2,450', icon: CreditCard, description: 'Net sales today' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Admin Dashboard</h1>
          <p className="text-gray-600">Manage your restaurant operations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <MenuManagement />
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <OrderManagement />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingManagement />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SystemSettings />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <ActivityLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;