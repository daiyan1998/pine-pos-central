
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useGetOrders } from "@/api/queries/order";

export const DailySalesReport = () => {
  const {  getTodaysSales } = useRestaurant();
  const { totalRevenue, totalOrders } = getTodaysSales();
  const {data} = useGetOrders();
  const orders = data?.data

  const getOrdersByStatus = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders?.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );

    return {
      pending: todaysOrders?.filter(o => o.status === 'pending').length,
      preparing: todaysOrders?.filter(o => o.status === 'preparing').length,
      ready: todaysOrders?.filter(o => o.status === 'ready').length,
      served: todaysOrders?.filter(o => o.status === 'served').length,
    };
  };

  const getTopItems = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders?.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );

    const itemCounts: { [key: string]: number } = {};
    todaysOrders?.forEach(order => {
      order.items?.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const statusCounts = getOrdersByStatus();
  const topItems = getTopItems();
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Daily Sales Report</h2>
        <Badge variant="outline" className="ml-auto">
          {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-xl font-bold text-gray-900">
                  {statusCounts.pending + statusCounts.preparing + statusCounts.ready}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <Badge className="bg-yellow-100 text-yellow-800">{statusCounts.pending}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Preparing</span>
              <Badge className="bg-blue-100 text-blue-800">{statusCounts.preparing}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ready</span>
              <Badge className="bg-green-100 text-green-800">{statusCounts.ready}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Served</span>
              <Badge className="bg-gray-100 text-gray-800">{statusCounts.served}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topItems.length > 0 ? (
              topItems.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-900">{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.count} sold</Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No items sold today yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
