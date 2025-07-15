import { Bill } from "./bill.type";

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  BKASH = "BKASH",
  NAGAD = "NAGAD",
  ROCKET = "ROCKET",
  UPAY = "UPAY",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  reference?: string;
  status: PaymentStatus;
  paidAt: string;
  createdAt: string;

  // Relations
  bill?: Bill;
}
