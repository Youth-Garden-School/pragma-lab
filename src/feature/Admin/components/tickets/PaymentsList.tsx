'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { MoreVertical, Search, CreditCard, Smartphone, Banknote, Building } from 'lucide-react'
import { toast } from 'sonner'

// Constants for easy customization
const CONSTANTS = {
  LOCALE: 'vi-VN',
  CURRENCY: 'VND',
  API_ENDPOINTS: {
    PAYMENTS: '/api/payments',
  },
  MESSAGES: {
    LOADING: 'Loading payments...',
    ERROR_FETCHING: 'Error fetching payments',
    VIEW_DETAILS: 'Viewing details for payment #',
    RECEIPT_DOWNLOADED: 'Receipt downloaded for payment #',
    REFUND_PROCESSED: 'Refund processed for payment #',
  },
  TABLE_HEADERS: {
    PAYMENT_ID: 'Payment ID',
    CUSTOMER: 'Customer',
    TICKET_ID: 'Ticket ID',
    AMOUNT: 'Amount',
    METHOD: 'Method',
    PAYMENT_DATE: 'Payment Date',
    STATUS: 'Status',
    ACTIONS: 'Actions',
  },
  BUTTON_LABELS: {
    VIEW_DETAILS: 'View Details',
    DOWNLOAD_RECEIPT: 'Download Receipt',
    PROCESS_REFUND: 'Process Refund',
  },
  FILTER_LABELS: {
    ALL_METHODS: 'All Methods',
    SEARCH_PLACEHOLDER: 'Search by payment ID, customer name, or email...',
    FILTER_BY_METHOD: 'Filter by method',
  },
} as const

// TypeScript interfaces
interface User {
  userId: number
  name: string
  email: string
  phone: string
}

interface VehicleType {
  vehicleTypeId: number
  name: string
}

interface Vehicle {
  vehicleType: VehicleType
}

interface Trip {
  vehicle: Vehicle
}

interface Ticket {
  ticketId: number
  user: User
  trip: Trip
}

interface Payment {
  paymentId: number
  ticketId: number
  amount: number
  method: string
  paidAt: string
  ticket: Ticket
}

interface ApiResponse {
  statusCode: number
  code: string
  message: string
  data: {
    items: Payment[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const PaymentsList = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [paymentMethodStats, setPaymentMethodStats] = useState<Record<string, number>>({})

  // Fetch payments from API
  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (methodFilter !== 'all') params.append('method', methodFilter)

      const res = await fetch(`${CONSTANTS.API_ENDPOINTS.PAYMENTS}?${params}`)
      const data: ApiResponse = await res.json()

      if (data.code === 'SUCCESS') {
        setPayments(data.data.items)

        // Calculate statistics
        const total = data.data.items.reduce((sum, payment) => sum + payment.amount, 0)
        setTotalRevenue(total)

        const stats = data.data.items.reduce(
          (acc, payment) => {
            acc[payment.method] = (acc[payment.method] || 0) + payment.amount
            return acc
          },
          {} as Record<string, number>,
        )
        setPaymentMethodStats(stats)
      } else {
        console.error('API Error:', data.message)
        toast.error(CONSTANTS.MESSAGES.ERROR_FETCHING)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error(CONSTANTS.MESSAGES.ERROR_FETCHING)
    } finally {
      setLoading(false)
    }
  }

  // Fetch payments when component mounts or filters change
  useEffect(() => {
    fetchPayments()
  }, [searchTerm, methodFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(CONSTANTS.LOCALE, {
      style: 'currency',
      currency: CONSTANTS.CURRENCY,
    }).format(amount)
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'momo':
        return <Smartphone className="h-4 w-4" />
      case 'banking':
        return <Building className="h-4 w-4" />
      case 'cash':
        return <Banknote className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'card':
        return 'bg-blue-500'
      case 'momo':
        return 'bg-pink-500'
      case 'banking':
        return 'bg-green-500'
      case 'cash':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleViewDetails = (payment: Payment) => {
    console.log('View payment details:', payment.paymentId)
    toast.info(`${CONSTANTS.MESSAGES.VIEW_DETAILS}${payment.paymentId}`)
  }

  const handleDownloadReceipt = (payment: Payment) => {
    console.log('Download receipt for payment:', payment.paymentId)
    toast.success(`${CONSTANTS.MESSAGES.RECEIPT_DOWNLOADED}${payment.paymentId}`)
  }

  const handleProcessRefund = (payment: Payment) => {
    console.log('Process refund for payment:', payment.paymentId)
    toast.success(`${CONSTANTS.MESSAGES.REFUND_PROCESSED}${payment.paymentId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{CONSTANTS.MESSAGES.LOADING}</div>
      </div>
    )
  }

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
            <p className="text-xs text-muted-foreground">From {payments.length} payments</p>
          </CardContent>
        </Card>

        {Object.entries(paymentMethodStats).map(([method, amount]) => (
          <Card key={method}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getPaymentMethodIcon(method)}
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(amount)}</div>
              <Progress
                value={totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0}
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
                placeholder={CONSTANTS.FILTER_LABELS.SEARCH_PLACEHOLDER}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={CONSTANTS.FILTER_LABELS.FILTER_BY_METHOD} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{CONSTANTS.FILTER_LABELS.ALL_METHODS}</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="momo">MoMo</SelectItem>
                <SelectItem value="banking">Banking</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{CONSTANTS.TABLE_HEADERS.PAYMENT_ID}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.CUSTOMER}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.TICKET_ID}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.AMOUNT}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.METHOD}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.PAYMENT_DATE}</TableHead>
                <TableHead>{CONSTANTS.TABLE_HEADERS.STATUS}</TableHead>
                <TableHead className="text-right">{CONSTANTS.TABLE_HEADERS.ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell className="font-mono">#{payment.paymentId}</TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.ticket.user.name}</div>
                      <div className="text-sm text-gray-500">{payment.ticket.user.email}</div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono">#{payment.ticketId}</TableCell>

                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getPaymentMethodColor(payment.method)}`}
                      />
                      <span className="capitalize">{payment.method}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    {new Date(payment.paidAt).toLocaleString(CONSTANTS.LOCALE)}
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
                          {CONSTANTS.BUTTON_LABELS.VIEW_DETAILS}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                          {CONSTANTS.BUTTON_LABELS.DOWNLOAD_RECEIPT}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleProcessRefund(payment)}>
                          {CONSTANTS.BUTTON_LABELS.PROCESS_REFUND}
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
  )
}

export { PaymentsList }
