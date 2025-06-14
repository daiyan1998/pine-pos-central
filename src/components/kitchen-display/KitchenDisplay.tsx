import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRestaurant } from "@/contexts/RestaurantContext";

interface KitchenOrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
}

interface KitchenOrder {
  id: string;
  tableNumber: number;
  items: KitchenOrderItem[];
  status: 'pending' | 'preparing' | 'ready';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  orderTime: string;
  customerName?: string;
  priority: 'normal' | 'urgent';
  waitTime: number;
}

export const KitchenDisplay = () => {
  const { toast } = useToast();
  const { orders, updateOrderStatus } = useRestaurant();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Convert orders to kitchen format
  const kitchenOrders: KitchenOrder[] = orders
    .filter(order => order.status !== 'served')
    .map(order => ({
      id: order.id,
      tableNumber: order.tableNumber,
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        notes: item.notes,
        category: 'Main' // Default category
      })),
      status: order.status as 'pending' | 'preparing' | 'ready',
      orderType: order.orderType,
      orderTime: order.createdAt.split(' ')[1] || '00:00',
      customerName: order.customerName,
      priority: 'normal' as const,
      waitTime: Math.floor((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60))
    }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'preparing' | 'ready') => {
    updateOrderStatus(orderId, newStatus);
    
    const statusMessages = {
      preparing: "started preparing",
      ready: "marked as ready"
    };

    toast({
      title: "Order Updated",
      description: `Order ${orderId} ${statusMessages[newStatus]}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string, waitTime: number) => {
    if (waitTime > 20 || priority === 'urgent') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = kitchenOrders.filter(order => order.status !== 'ready');
  const readyOrders = kitchenOrders.filter(order => order.status === 'ready');

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              Kitchen Display
            </h1>
            <p className="text-gray-600 mt-1">Monitor and manage orders in real-time</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kitchenOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Preparing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kitchenOrders.filter(o => o.status === 'preparing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ready</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kitchenOrders.filter(o => o.status === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className={`border-0 shadow-sm ${order.waitTime > 20 ? 'ring-2 ring-red-200' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {order.id}
                      {order.waitTime > 20 && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : 
                       order.orderType === 'takeaway' ? `Takeaway - ${order.customerName}` :
                       `Delivery - ${order.customerName}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 mb-1`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <Badge className={getPriorityColor(order.priority, order.waitTime)}>
                      {order.waitTime}m
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="border-l-4 border-blue-200 pl-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.quantity}x {item.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {item.category}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-orange-600 font-medium mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {order.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">Ordered at {order.orderTime}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ready Orders */}
      {readyOrders.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready for Pickup</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {readyOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-green-800">{order.id}</h3>
                    <p className="text-sm text-green-600">
                      {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : order.customerName}
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && readyOrders.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders in the kitchen queue</p>
        </div>
      )}
    </div>
  );
};
