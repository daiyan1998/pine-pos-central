import { Order, OrderItem } from "./order.type";
import { Table } from "./table.type";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  WAITER = "WAITER",
}

export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // Usually omitted on frontend for security
  firstName: string;
  lastName: string;
  phone?: string;
  refreshToken?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  orders?: OrderItem[];
  createdTables?: Table[];
}
