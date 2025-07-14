import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, DollarSign, CreditCard } from 'lucide-react';

const BillingManagement = () => {
  const [bills, setBills] = useState([
    {
      id: '1',
      billNumber: 'BILL-001',
      orderId: '1',
      orderNumber: 'ORD-001',
      totalAmount: 42.50,
      taxAmount: 3.40,
      serviceCharge: 2.13,
      finalAmount: 48.03,
      isPaid: true,
      paidAt: new Date('2024-01-01T13:00:00'),
      createdAt: new Date('2024-01-01T12:45:00'),
      payments: [
        {
          id: '1',
          amount: 48.03,
          paymentMethod: 'CARD',
          status: 'COMPLETED',
          paidAt: new Date('2024-01-01T13:00:00'),
        }
      ]
    },
    {
      id: '2',
      billNumber: 'BILL-002',
      orderId: '2',
      orderNumber: 'ORD-002',
      totalAmount: 25.00,
      taxAmount: 2.00,
      serviceCharge: 1.25,
      finalAmount: 28.25,
      isPaid: false,
      paidAt: null,
      createdAt: new Date('2024-01-01T13:15:00'),
      payments: []
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: '1',
      billId: '1',
      billNumber: 'BILL-001',
      amount: 48.03,
      paymentMethod: 'CARD',
      transactionId: 'TXN-12345',
      status: 'COMPLETED',
      paidAt: new Date('2024-01-01T13:00:00'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(bill =>
    bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      CASH: 'bg-green-100 text-green-800',
      CARD: 'bg-blue-100 text-blue-800',
      BKASH: 'bg-pink-100 text-pink-800',
      NAGAD: 'bg-orange-100 text-orange-800',
      ROCKET: 'bg-purple-100 text-purple-800',
    };
    return <Badge className={colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{method}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'PENDING': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'FAILED': return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED': return <Badge className="bg-gray-100 text-gray-800">Refunded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalRevenue = bills.filter(b => b.isPaid).reduce((sum, bill) => sum + bill.finalAmount, 0);
  const pendingAmount = bills.filter(b => !b.isPaid).reduce((sum, bill) => sum + bill.finalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Paid bills only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Unpaid bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bills.length}</div>
            <p className="text-xs text-muted-foreground">Today's bills</p>
          </CardContent>
        </Card>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bills & Invoices</CardTitle>
              <CardDescription>Track and manage billing information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Final Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.billNumber}</TableCell>
                  <TableCell>{bill.orderNumber}</TableCell>
                  <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>${bill.taxAmount.toFixed(2)}</TableCell>
                  <TableCell>${bill.serviceCharge.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">${bill.finalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={bill.isPaid ? 'default' : 'secondary'}>
                      {bill.isPaid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{bill.createdAt.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!bill.isPaid && (
                        <Button size="sm" variant="outline">
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.billNumber}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell>{payment.transactionId || '-'}</TableCell>
                  <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                  <TableCell>{payment.paidAt.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingManagement;