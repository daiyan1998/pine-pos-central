import { Bill } from "./bill.type";
import { MenuItem, MenuVariant } from "./menu.type";
import { Table } from "./table.type";
import { User } from "./user.type";

export enum OrderType {
  DINE_IN = "DINE_IN",
  TAKEAWAY = "TAKEAWAY",
  DELIVERY = "DELIVERY",
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  SERVED = "SERVED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  orderType: OrderType;
  status: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  totalAmount: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  finalAmount: number;
  notes?: string;
  kotPrinted: boolean;
  kotPrintedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Relations
  creator?: User;
  table?: Table;
  orderItems?: OrderItem[];
  bills?: Bill[];
}

export enum OrderItemStatus {
  PENDING = "PENDING",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  SERVED = "SERVED",
  CANCELLED = "CANCELLED",
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  variantId?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  status: OrderItemStatus;

  // Relations
  order?: Order;
  menuItem?: MenuItem;
  variant?: MenuVariant;
}
