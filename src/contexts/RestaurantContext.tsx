import { Order, OrderItem, OrderType, OrderStatus, OrderItemStatus } from "@/types/order.type";
import { Table, TableStatus } from "@/types/table.type";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  orderHistory: string[];
}

interface RestaurantContextType {
  orders: Order[];
  tables: Table[];
  customers: Customer[];
  addOrder: (newOrder: {
    tableId?: string;
    orderType: OrderType;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
      menuItemId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }>;
    notes?: string;
  }) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addTable: (newTable: { tableNumber: string; capacity: number; location?: string }) => void;
  updateTableStatus: (
    tableId: string,
    status: TableStatus
  ) => void;
  addCustomer: (customer: Omit<Customer, "id" | "orderHistory">) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  printReceipt: (orderId: string) => void;
  getTodaysSales: () => { totalRevenue: number; totalOrders: number };
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider = ({ children }: RestaurantProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1",
      orderNumber: "001",
      tableId: "table-1",
      orderType: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      customerName: "John Doe",
      totalAmount: 25.98,
      taxAmount: 2.60,
      serviceCharge: 1.00,
      discountAmount: 0,
      finalAmount: 29.58,
      notes: "No onions",
      kotPrinted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-1",
      orderItems: [
        {
          id: "item-1",
          orderId: "order-1",
          menuItemId: "menu-1",
          quantity: 2,
          unitPrice: 12.99,
          totalPrice: 25.98,
          status: OrderItemStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ]);
  
  const [tables, setTables] = useState<Table[]>([
    {
      id: "table-1",
      tableNumber: "1",
      capacity: 4,
      status: TableStatus.AVAILABLE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-1",
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "123-456-7890",
      orderHistory: ["order-1"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      orderHistory: [],
    },
  ]);

  const addOrder = (newOrder: {
    tableId?: string;
    orderType: OrderType;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
      menuItemId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      notes?: string;
    }>;
    notes?: string;
  }) => {
    const id = `order-${Date.now()}`;
    const orderNumber = `${orders.length + 1}`.padStart(3, "0");
    const totalAmount = newOrder.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const taxAmount = +(totalAmount * 0.1).toFixed(2); // Example 10% tax
    const serviceCharge = +(totalAmount * 0.05).toFixed(2); // Example 5% service charge
    const discountAmount = 0;
    const finalAmount = +(totalAmount + taxAmount + serviceCharge - discountAmount).toFixed(2);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const createdBy = "user-1";
    const orderItems: OrderItem[] = newOrder.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId: id,
      menuItemId: item.menuItemId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: +(item.unitPrice * item.quantity).toFixed(2),
      notes: item.notes,
      status: OrderItemStatus.PENDING,
      createdAt,
      updatedAt,
    }));
    const order: Order = {
      id,
      orderNumber,
      tableId: newOrder.tableId,
      orderType: newOrder.orderType,
      status: OrderStatus.PENDING,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      totalAmount,
      taxAmount,
      serviceCharge,
      discountAmount,
      finalAmount,
      notes: newOrder.notes,
      kotPrinted: false,
      createdAt,
      updatedAt,
      createdBy,
      orderItems,
    };
    setOrders((prev) => [...prev, order]);
    // Update table status if it's a dine-in order
    if (newOrder.orderType === OrderType.DINE_IN && newOrder.tableId) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === newOrder.tableId
            ? { ...table, status: TableStatus.OCCUPIED }
            : table
        )
      );
    }
    // Add customer if not exists
    if (newOrder.customerName) {
      const existingCustomer = customers.find(
        (c) => c.name.toLowerCase() === newOrder.customerName!.toLowerCase()
      );
      if (!existingCustomer) {
        addCustomer({ name: newOrder.customerName, phone: newOrder.customerPhone });
      }
      // Update customer order history
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.name.toLowerCase() === newOrder.customerName!.toLowerCase()
            ? {
                ...customer,
                orderHistory: [...customer.orderHistory, id],
              }
            : customer
        )
      );
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // If order is served, free up the table
    if (newStatus === OrderStatus.SERVED) {
      const order = orders.find((o) => o.id === orderId);
      if (order && order.orderType === OrderType.DINE_IN && order.tableId) {
        setTables((prev) =>
          prev.map((table) =>
            table.id === order.tableId
              ? { ...table, status: TableStatus.AVAILABLE }
              : table
          )
        );
      }
    }
  };

  const addTable = (newTable: { tableNumber: string; capacity: number; location?: string }) => {
    const table: Table = {
      id: `table-${Date.now()}`,
      tableNumber: newTable.tableNumber,
      capacity: newTable.capacity,
      status: TableStatus.AVAILABLE,
      location: newTable.location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "user-1",
    };
    setTables((prev) => [...prev, table]);
  };

  const updateTableStatus = (
    tableId: string,
    status: TableStatus
  ) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  const addCustomer = (customer: Omit<Customer, "id" | "orderHistory">) => {
    const newCustomer: Customer = {
      id: `CUST${Date.now()}`,
      ...customer,
      orderHistory: [],
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const printReceipt = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const receiptContent = `
=== POSPine Restaurant ===
Receipt #${order.orderNumber}
Date: ${order.createdAt}
${order.orderType === OrderType.DINE_IN ? `Table: ${order.tableId}` : `Customer: ${order.customerName}`}

Items:
${order.orderItems?.map(
  (item) =>
    `${item.quantity}x ${item.menuItemId} - $${(item.unitPrice * item.quantity).toFixed(2)}`
  ).join("\n")}

Total: $${order.finalAmount.toFixed(2)}

Thank you for your visit!
`;
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${order.orderNumber}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${receiptContent}</pre>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const getTodaysSales = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter(
      (order) =>
        order.status === OrderStatus.SERVED &&
        new Date(order.createdAt).toDateString() === today
    );
    return {
      totalRevenue: todaysOrders.reduce((sum, order) => sum + order.finalAmount, 0),
      totalOrders: todaysOrders.length,
    };
  };

  const value: RestaurantContextType = {
    orders,
    tables,
    customers,
    addOrder,
    updateOrderStatus,
    addTable,
    updateTableStatus,
    addCustomer,
    updateOrder,
    printReceipt,
    getTodaysSales,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};
