import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";
import { useGetDashboard } from "@/api/queries/dashboard";
import { formatDistanceToNow } from "date-fns";

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const {data,isLoading} = useGetDashboard()

  const dashboard = data?.data || {};

  const stats = [
    {
      title: "Today's Sales",
      value: dashboard.todaysSales?.totalRevenue,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Orders",
      value: dashboard.todaysSales?.totalOrders,
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Tables",
      value: "12/20",
      change: "60% occupied",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Avg. Order Value",
      value: "$18.25",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];


  // const recentOrders = [
  //   { id: "#001", table: "Table 5", items: 3, total: "$45.50", status: "preparing", time: "2 min ago" },
  //   { id: "#002", table: "Table 2", items: 2, total: "$28.00", status: "ready", time: "5 min ago" },
  //   { id: "#003", table: "Table 8", items: 4, total: "$62.75", status: "served", time: "12 min ago" },
  //   { id: "#004", table: "Table 1", items: 1, total: "$15.25", status: "pending", time: "15 min ago" },
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PREPARATION': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-green-100 text-green-800';
      case 'SERVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <AlertCircle className="w-3 h-3" />;
      case 'IN_PREPARATION': return <Clock className="w-3 h-3" />;
      case 'READY': return <CheckCircle className="w-3 h-3" />;
      case 'SERVED': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`);
    if (onNavigate) {
      onNavigate(action);
    }
  };

  if(isLoading) return <div>Loading...</div>
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your restaurant today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>June 14, 2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs ${stat.color} font-medium mt-1`}>{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {order.table.tableNumber}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{order.orderItems.length} items</span>
                    <span className="font-medium text-gray-900">{order.total}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(order.createdAt,{addSuffix: true}) }</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button 
              onClick={() => handleQuickAction('orders')}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Take New Order</h3>
                  <p className="text-sm text-gray-600">Create a new order for a table</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('tables')}
              className="w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Tables</h3>
                  <p className="text-sm text-gray-600">View and update table status</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => handleQuickAction('reports')}
              className="w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">View Reports</h3>
                  <p className="text-sm text-gray-600">Check sales and performance</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
