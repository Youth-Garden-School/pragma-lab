'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { MoreVertical, Search, CreditCard, Smartphone, Banknote, Building } from 'lucide-react';
import { 
  mockPayments, 
  mockTickets, 
  mockUsers, 
  PaymentMethod 
} from '@/feature/Admin/data/mockData';
import { toast } from 'sonner';

const PaymentsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Create payments with joined data
  const paymentsWithDetails = mockPayments.map(payment => {
    const ticket = mockTickets.find(t => t.ticketId === payment.ticketId);
    const user = ticket ? mockUsers.find(u => u.userId === ticket.userId) : null;
    
    return {
      ...payment,
      ticket,
      user
    };
  });

  // Filter payments
  const filteredPayments = paymentsWithDetails.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentId.toString().includes(searchTerm);
    
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.card:
        return <CreditCard className="h-4 w-4" />;
      case PaymentMethod.momo:
        return <Smartphone className="h-4 w-4" />;
      case PaymentMethod.banking:
        return <Building className="h-4 w-4" />;
      case PaymentMethod.cash:
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentMethodColor = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.card:
        return 'bg-blue-500';
      case PaymentMethod.momo:
        return 'bg-pink-500';
      case PaymentMethod.banking:
        return 'bg-green-500';
      case PaymentMethod.cash:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Calculate statistics
  const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paymentMethodStats = filteredPayments.reduce((acc, payment) => {
    acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
    return acc;
  }, {} as Record<PaymentMethod, number>);

  const handleViewDetails = (payment: any) => {
    console.log('View payment details:', payment.paymentId);
    toast.info(`Viewing details for payment #${payment.paymentId}`);
  };

  const handleDownloadReceipt = (payment: any) => {
    console.log('Download receipt for payment:', payment.paymentId);
    toast.success(`Receipt downloaded for payment #${payment.paymentId}`);
  };

  const handleProcessRefund = (payment: any) => {
    console.log('Process refund for payment:', payment.paymentId);
    toast.success(`Refund processed for payment #${payment.paymentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From {filteredPayments.length} payments</p>
          </CardContent>
        </Card>

        {Object.entries(paymentMethodStats).map(([method, amount]) => (
          <Card key={method}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getPaymentMethodIcon(method as PaymentMethod)}
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(amount)}</div>
              <Progress 
                value={(amount / totalRevenue) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by payment ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value={PaymentMethod.card}>Card</SelectItem>
                <SelectItem value={PaymentMethod.momo}>MoMo</SelectItem>
                <SelectItem value={PaymentMethod.banking}>Banking</SelectItem>
                <SelectItem value={PaymentMethod.cash}>Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History ({filteredPayments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell className="font-mono">#{payment.paymentId}</TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.user?.name}</div>
                      <div className="text-sm text-gray-500">{payment.user?.email}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-mono">#{payment.ticketId}</TableCell>
                  
                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPaymentMethodColor(payment.method)}`} />
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm">
                    {new Date(payment.paidAt).toLocaleString('vi-VN')}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="default">Completed</Badge>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                          Download Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProcessRefund(payment)}>
                          Process Refund
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export { PaymentsList };
