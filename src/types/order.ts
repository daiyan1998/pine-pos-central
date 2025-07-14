export interface OrderItem {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string; // optional
}

export interface OrderPayload {
  orderNumber: string;
  tableId: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  status: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'SERVED' | 'CANCELLED'; // adjust as per your domain
  customerName: string;
  customerPhone?: string; // optional if not always provided
  totalAmount: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  finalAmount: number;
  notes?: string;
  kotPrinted: boolean;
  createdBy: string;
  orderItems: OrderItem[];
}