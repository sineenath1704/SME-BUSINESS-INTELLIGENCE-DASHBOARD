export interface Customer {
  id: string
  full_name: string
  email: string
  phone: string | null
  city: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  category: string
  unit_price: number
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface Order {
  id: string
  order_no: string
  customer_id: string
  status: 'paid' | 'pending' | 'cancelled' | string
  ordered_at: string
  customer?: Customer
  order_items?: OrderItem[]
  total_amount?: number
}

export interface TopProduct {
  id: string
  name: string
  category: string
  unit_price: number
  totalQuantity: number
  totalRevenue: number
}

export interface DailySales {
  date: string
  displayDate: string
  revenue: number
  ordersCount: number
}

export interface CategorySales {
  category: string
  revenue: number
  quantity: number
  percentage: number
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  paidOrdersCount: number
  cancelledOrdersCount: number
  pendingOrdersCount: number
}

export type PageId = 'dashboard' | 'orders' | 'products' | 'customers' | 'analytics'
