import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  CheckCircle,
  ChefHat,
  Utensils,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewOrderDialog } from "./NewOrderDialog";
import { EditOrderDialog } from "./EditOrderDialog";
import { useRestaurant } from "@/contexts/RestaurantContext";
import { useGetOrders } from "@/api/queries/order";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: "pending" | "IN_PREPARATION" | "READY" | "SERVED";
  orderType: "dine-in" | "takeaway" | "delivery";
  total: number;
  createdAt: string;
  customerName?: string;
}

export const OrderManagement = () => {
  const { toast } = useToast();
  const { updateOrderStatus, printReceipt } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const getOrders = useGetOrders()
  console.log('orders',getOrders.data)
  const orders = getOrders.data?.data

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "IN_PREPARATION":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "READY":
        return "bg-green-100 text-green-800 border-green-200";
      case "SERVED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "IN_PREPARATION":
        return <ChefHat className="w-4 h-4" />;
      case "READY":
        return <CheckCircle className="w-4 h-4" />;
      case "SERVED":
        return <Utensils className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handlePrintReceipt = (orderId: string) => {
    printReceipt(orderId);
    toast({
      title: "Receipt Printed",
      description: `Receipt for order ${orderId} has been sent to printer`,
    });
  };
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  console.log("filteredOrders",filteredOrders)

  const getNextStatus = (currentStatus: any) => {
    switch (currentStatus) {
      case "PENDING":
        return "IN_PREPARATION";
      case "IN_PREPARATION":
        return "READY";
      case "READY":
        return "SERVED";
      default:
        return null;
    }
  };

 if(getOrders.isLoading){
   return(
    <div>is loading</div>
   )
 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">
            Track and manage all customer orders in real-time.
          </p>
        </div>
        <NewOrderDialog />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PREPARATION">Preparing</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
            <SelectItem value="SERVED">Served</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          {
            status: "PENDING",
            label: "Pending",
            count: orders.filter((o) => o.status === "PENDING").length,
          },
          {
            status: "IN_PREPARATION",
            label: "Preparing",
            count: orders.filter((o) => o.status === "IN_PREPARATION").length,
          },
          {
            status: "READY",
            label: "READY",
            count: orders.filter((o) => o.status === "READY").length,
          },
          {
            status: "SERVED",
            label: "SERVED",
            count: orders.filter((o) => o.status === "SERVED").length,
          },
        ].map((stat) => (
          <Card key={stat.status} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(
                    stat.status
                  )
                    .replace("text-", "text-")
                    .replace("border-", "bg-")
                    .replace("bg-", "bg-")
                    .replace("-800", "-100")
                    .replace("-100", "-100")}`}
                >
                  {getStatusIcon(stat.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stat.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {order.orderNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {order.orderType === "DINE_IN"
                      ? `Table ${order.table?.tableNumber}`
                      : order.orderType === "TAKEAWAY"
                      ? `Takeaway - ${order.customerName}`
                      : `Delivery - ${order.customerName}`}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    order.status
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span>
                        {item.quantity}x {item.menuItem?.name}
                      </span>
                      {item.notes && (
                        <p className="text-xs text-orange-600 italic">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-medium">
                      ${(item.menuItem.basePrice * item.quantity)}
                    </span>
                  </div>
                ))}
                {order.orderItems.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No items added yet
                  </p>
                )}
              </div>

              {/* Order Total */}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${parseFloat( order.totalAmount )}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {getNextStatus(order.status) && (
                  <Button
                    size="sm"
                    onClick={() =>
                      handleUpdateOrderStatus(
                        order.id,
                        getNextStatus(order.status)!
                      )
                    }
                    className="flex-1"
                  >
                    Mark as{" "}
                    {getNextStatus(order.status)?.charAt(0).toUpperCase() +
                      getNextStatus(order.status)?.slice(1)}
                  </Button>
                )}

                <EditOrderDialog order={order} />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintReceipt(order.id)}
                >
                  <Printer className="w-4 h-4 mr-1" />
                  Receipt
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Created: {order.createdAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No orders found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};
