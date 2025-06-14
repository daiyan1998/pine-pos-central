
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, Receipt, Download, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Bill {
  id: string;
  tableNumber: number;
  items: BillItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod?: string;
  status: 'pending' | 'paid';
  createdAt: string;
}

export const BillingPayments = () => {
  const { toast } = useToast();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 'BILL001',
      tableNumber: 5,
      items: [
        { id: '1', name: 'Chicken Burger', price: 12.99, quantity: 2 },
        { id: '2', name: 'Coca Cola', price: 2.99, quantity: 2 }
      ],
      subtotal: 31.96,
      tax: 3.20,
      serviceCharge: 1.60,
      discount: 0,
      total: 36.76,
      status: 'pending',
      createdAt: '2025-06-14 12:30',
    },
    {
      id: 'BILL002',
      tableNumber: 2,
      items: [
        { id: '3', name: 'Caesar Salad', price: 8.99, quantity: 1 },
        { id: '4', name: 'Margherita Pizza', price: 14.99, quantity: 1 }
      ],
      subtotal: 23.98,
      tax: 2.40,
      serviceCharge: 1.20,
      discount: 2.40,
      total: 25.18,
      paymentMethod: 'card',
      status: 'paid',
      createdAt: '2025-06-14 12:15',
    }
  ]);

  const calculateBill = (items: BillItem[], discountPercent: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.10; // 10% tax
    const serviceCharge = discountedSubtotal * 0.05; // 5% service charge
    const total = discountedSubtotal + tax + serviceCharge;
    
    return { subtotal, tax, serviceCharge, discount, total };
  };

  const applyDiscount = (billId: string, discount: number) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === billId) {
        const calculated = calculateBill(bill.items, discount);
        return { ...bill, ...calculated };
      }
      return bill;
    }));
    
    if (selectedBill?.id === billId) {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        const calculated = calculateBill(bill.items, discount);
        setSelectedBill({ ...bill, ...calculated });
      }
    }
    
    toast({
      title: "Discount Applied",
      description: `${discount}% discount applied to ${billId}`,
    });
  };

  const processBill = (billId: string, method: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status: 'paid', paymentMethod: method } : bill
    ));
    
    if (selectedBill?.id === billId) {
      setSelectedBill(prev => prev ? { ...prev, status: 'paid', paymentMethod: method } : null);
    }
    
    toast({
      title: "Payment Processed",
      description: `Bill ${billId} paid via ${method}`,
    });
  };

  const printBill = (bill: Bill) => {
    toast({
      title: "Bill Printed",
      description: `Invoice for ${bill.id} sent to printer`,
    });
  };

  const splitBill = (billId: string, parts: number) => {
    const originalBill = bills.find(b => b.id === billId);
    if (!originalBill) return;

    const splitAmount = originalBill.total / parts;
    
    toast({
      title: "Bill Split",
      description: `${billId} split into ${parts} parts of $${splitAmount.toFixed(2)} each`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Process payments and manage billing for your restaurant.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-xl font-bold text-gray-900">
                  ${bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Bills</p>
                <p className="text-xl font-bold text-gray-900">
                  {bills.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Bills</p>
                <p className="text-xl font-bold text-gray-900">
                  {bills.filter(b => b.status === 'paid').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bills List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Active Bills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bills.map((bill) => (
              <div 
                key={bill.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedBill?.id === bill.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedBill(bill)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{bill.id}</span>
                  <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                    {bill.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Table {bill.tableNumber}</p>
                  <p className="font-medium text-gray-900">${bill.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bill Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>
              {selectedBill ? `Bill Details - ${selectedBill.id}` : 'Select a Bill'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedBill ? (
              <div className="space-y-4">
                {/* Items */}
                <div className="space-y-2">
                  <h4 className="font-medium">Items:</h4>
                  {selectedBill.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Bill Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${selectedBill.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedBill.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-${selectedBill.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>${selectedBill.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge (5%):</span>
                    <span>${selectedBill.serviceCharge.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${selectedBill.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedBill.status === 'pending' && (
                  <>
                    <Separator />

                    {/* Discount */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Apply Discount:</h4>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Discount %"
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => applyDiscount(selectedBill.id, discountPercent)}
                        >
                          <Percent className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Payment Method:</h4>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="mobile">Mobile Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => paymentMethod && processBill(selectedBill.id, paymentMethod)}
                        disabled={!paymentMethod}
                      >
                        Process Payment
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => splitBill(selectedBill.id, 2)}>
                          Split Bill
                        </Button>
                        <Button variant="outline" onClick={() => printBill(selectedBill)}>
                          <Receipt className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {selectedBill.status === 'paid' && (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">✓ Paid via {selectedBill.paymentMethod}</p>
                    <Button variant="outline" onClick={() => printBill(selectedBill)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Select a bill from the list to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
