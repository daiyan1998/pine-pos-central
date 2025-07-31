
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  status: 'pending' | 'preparing' | 'ready' | 'served';
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  total: number;
  createdAt: string;
  customerName?: string;
}

interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  currentOrder?: string;
  reservationTime?: string;
}

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
    tableNumber: number; 
    orderType: 'dine-in' | 'takeaway' | 'delivery'; 
    customerName?: string;
    items: OrderItem[];
  }) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  addTable: (newTable: { number: number; seats: number }) => void;
  updateTableStatus: (tableId: string, status: Table['status'], orderId?: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'orderHistory'>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  printReceipt: (orderId: string) => void;
  getTodaysSales: () => { totalRevenue: number; totalOrders: number; };
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider = ({ children }: RestaurantProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      tableNumber: 5,
      items: [
        { id: '1', name: 'Chicken Burger', price: 12.99, quantity: 2 },
        { id: '2', name: 'Coca Cola', price: 2.99, quantity: 2 }
      ],
      status: 'preparing',
      orderType: 'dine-in',
      total: 31.96,
      createdAt: '2025-06-14 12:30',
    },
    {
      id: 'ORD002',
      tableNumber: 2,
      items: [
        { id: '3', name: 'Caesar Salad', price: 8.99, quantity: 1 },
        { id: '4', name: 'Margherita Pizza', price: 14.99, quantity: 1 }
      ],
      status: 'ready',
      orderType: 'dine-in',
      total: 23.98,
      createdAt: '2025-06-14 12:15',
    },
    {
      id: 'ORD003',
      tableNumber: 0,
      items: [
        { id: '5', name: 'Chicken Burger', price: 12.99, quantity: 1 }
      ],
      status: 'pending',
      orderType: 'takeaway',
      total: 12.99,
      createdAt: '2025-06-14 12:45',
      customerName: 'John Doe'
    }
  ]);

  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, seats: 2, status: 'available' },
    { id: '2', number: 2, seats: 4, status: 'occupied', currentOrder: 'ORD002' },
    { id: '3', number: 3, seats: 2, status: 'available' },
    { id: '4', number: 4, seats: 6, status: 'reserved', reservationTime: '7:30 PM' },
    { id: '5', number: 5, seats: 4, status: 'occupied', currentOrder: 'ORD001' },
    { id: '6', number: 6, seats: 2, status: 'available' },
    { id: '7', number: 7, seats: 4, status: 'available' },
    { id: '8', number: 8, seats: 4, status: 'available' },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'John Doe', phone: '123-456-7890', orderHistory: ['ORD003'] },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', orderHistory: [] }
  ]);

  const addOrder = (newOrder: { 
    tableNumber: number; 
    orderType: 'dine-in' | 'takeaway' | 'delivery'; 
    customerName?: string;
    items: OrderItem[];
  }) => {
    const total = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order: Order = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      tableNumber: newOrder.tableNumber,
      items: newOrder.items,
      status: 'pending',
      orderType: newOrder.orderType,
      total,
      createdAt: new Date().toLocaleString(),
      customerName: newOrder.customerName
    };

    setOrders(prev => [...prev, order]);

    // Update table status if it's a dine-in order
    if (newOrder.orderType === 'dine-in' && newOrder.tableNumber > 0) {
      setTables(prev => prev.map(table => 
        table.number === newOrder.tableNumber 
          ? { ...table, status: 'occupied' as const, currentOrder: order.id }
          : table
      ));
    }

    // Add customer if not exists
    if (newOrder.customerName && (newOrder.orderType === 'takeaway' || newOrder.orderType === 'delivery')) {
      const existingCustomer = customers.find(c => c.name.toLowerCase() === newOrder.customerName!.toLowerCase());
      if (!existingCustomer) {
        addCustomer({ name: newOrder.customerName });
      }
      // Update customer order history
      setCustomers(prev => prev.map(customer => 
        customer.name.toLowerCase() === newOrder.customerName!.toLowerCase()
          ? { ...customer, orderHistory: [...customer.orderHistory, order.id] }
          : customer
      ));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    // If order is served, free up the table
    if (newStatus === 'served') {
      const order = orders.find(o => o.id === orderId);
      if (order && order.orderType === 'dine-in') {
        setTables(prev => prev.map(table => 
          table.number === order.tableNumber 
            ? { ...table, status: 'available' as const, currentOrder: undefined }
            : table
        ));
      }
    }
  };

  const addTable = (newTable: { number: number; seats: number }) => {
    const table: Table = {
      id: `${Date.now()}`,
      number: newTable.number,
      seats: newTable.seats,
      status: 'available'
    };
    setTables(prev => [...prev, table]);
  };

  const updateTableStatus = (tableId: string, status: Table['status'], orderId?: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status, currentOrder: orderId }
        : table
    ));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'orderHistory'>) => {
    const newCustomer: Customer = {
      id: `CUST${Date.now()}`,
      ...customer,
      orderHistory: []
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  const printReceipt = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const receiptContent = `
=== POSPine Restaurant ===
Receipt #${order.id}
Date: ${order.createdAt}
${order.orderType === 'dine-in' ? `Table: ${order.tableNumber}` : `Customer: ${order.customerName}`}

Items:
${order.items.map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Total: $${order.total.toFixed(2)}

Thank you for your visit!
`;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${order.id}</title>
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
    const todaysOrders = orders.filter(order => 
      order.status === 'served' && new Date(order.createdAt).toDateString() === today
    );
    
    return {
      totalRevenue: todaysOrders.reduce((sum, order) => sum + order.total, 0),
      totalOrders: todaysOrders.length
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
