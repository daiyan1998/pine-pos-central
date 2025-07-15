import { Order } from "./order.type";
import { Payment } from "./payment.type";

export interface Bill {
  id: string;
  billNumber: string;
  orderId: string;
  totalAmount: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  finalAmount: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  order?: Order;
  payments?: Payment[];
}
