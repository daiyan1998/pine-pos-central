import { Order } from "./order.type";
import { User } from "./user.type";

export enum TableStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  status: TableStatus;
  location?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Relations
  creator?: User;
  orders?: Order[];
}
