import { supabase } from '../lib/supabase'
import type {
  Customer,
  Product,
  Order,
  TopProduct,
  DailySales,
  CategorySales,
  DashboardMetrics,
} from '../types'

// Cache for products to avoid redundant fetches
let cachedProducts: Product[] | null = null

export async function getProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  cachedProducts = data || []
  return cachedProducts
}

export async function fetchDashboardData() {
  // 1. Fetch exact total counts in parallel
  const [custCountRes, ordersCountRes, products] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    getProducts(),
  ])

  const totalCustomers = custCountRes.count || 0
  const totalOrders = ordersCountRes.count || 0

  // 2. Fetch recent 1,000 orders with order_items & customer for recent trends & top products
  const { data: recentOrdersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      order_no,
      status,
      ordered_at,
      customer:customers(full_name, email, city),
      order_items(product_id, quantity, unit_price)
    `)
    .order('ordered_at', { ascending: false })
    .limit(1000)

  if (ordersError) {
    console.error('Error fetching dashboard orders:', ordersError)
  }

  const rawOrders = recentOrdersData || []

  // Compute metrics from orders
  let totalRevenue = 0
  let paidOrdersCount = 0
  let pendingOrdersCount = 0
  let cancelledOrdersCount = 0

  const prodStatsMap = new Map<string, { quantity: number; revenue: number }>()
  const salesByDateMap = new Map<string, { revenue: number; count: number }>()

  const formattedOrders: Order[] = rawOrders.map((o: any) => {
    let orderTotal = 0
    if (o.order_items && Array.isArray(o.order_items)) {
      for (const item of o.order_items) {
        const itemTotal = Number(item.quantity || 0) * Number(item.unit_price || 0)
        orderTotal += itemTotal

        // Only count towards sales if order is paid
        if (o.status === 'paid') {
          const current = prodStatsMap.get(item.product_id) || { quantity: 0, revenue: 0 }
          current.quantity += Number(item.quantity || 0)
          current.revenue += itemTotal
          prodStatsMap.set(item.product_id, current)
        }
      }
    }

    if (o.status === 'paid') {
      totalRevenue += orderTotal
      paidOrdersCount++

      // Group by Date for chart (YYYY-MM-DD)
      const dateKey = o.ordered_at ? o.ordered_at.substring(0, 10) : ''
      if (dateKey) {
        const current = salesByDateMap.get(dateKey) || { revenue: 0, count: 0 }
        current.revenue += orderTotal
        current.count++
        salesByDateMap.set(dateKey, current)
      }
    } else if (o.status === 'cancelled') {
      cancelledOrdersCount++
    } else {
      pendingOrdersCount++
    }

    return {
      id: o.id,
      order_no: o.order_no,
      customer_id: o.customer_id,
      status: o.status,
      ordered_at: o.ordered_at,
      customer: o.customer,
      order_items: o.order_items,
      total_amount: orderTotal,
    }
  })

  // Build Top 5 Products
  const prodMap = new Map(products.map((p) => [p.id, p]))
  const topProducts: TopProduct[] = Array.from(prodStatsMap.entries())
    .map(([prodId, stats]) => {
      const prod = prodMap.get(prodId)
      return {
        id: prodId,
        name: prod?.name || 'สินค้าทั่วไป',
        category: prod?.category || 'ทั่วไป',
        unit_price: prod?.unit_price || 0,
        totalQuantity: stats.quantity,
        totalRevenue: stats.revenue,
      }
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)

  // Build Sales Analytics trend (sorted by date ascending, recent 30 days of data)
  const sortedDates = Array.from(salesByDateMap.keys()).sort()
  const recentDates = sortedDates.slice(-21) // last 3 weeks / entries

  const salesTrend: DailySales[] = recentDates.map((dateStr) => {
    const val = salesByDateMap.get(dateStr) || { revenue: 0, count: 0 }
    const d = new Date(dateStr)
    const displayDate = d.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
    return {
      date: dateStr,
      displayDate,
      revenue: Math.round(val.revenue),
      ordersCount: val.count,
    }
  })

  const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0

  const metrics: DashboardMetrics = {
    totalRevenue,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    paidOrdersCount,
    cancelledOrdersCount,
    pendingOrdersCount,
  }

  return {
    metrics,
    topProducts,
    salesTrend,
    recentOrders: formattedOrders.slice(0, 8),
    allProducts: products,
  }
}

export async function fetchOrdersList(
  page = 1,
  pageSize = 15,
  status = 'all',
  searchQuery = ''
) {
  let query = supabase
    .from('orders')
    .select(`
      id,
      order_no,
      status,
      ordered_at,
      customer:customers(full_name, email, city, phone),
      order_items(id, product_id, quantity, unit_price, product:products(name, category))
    `, { count: 'exact' })
    .order('ordered_at', { ascending: false })

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (searchQuery.trim()) {
    query = query.ilike('order_no', `%${searchQuery.trim()}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0 }
  }

  const orders: Order[] = (data || []).map((o: any) => {
    let total = 0
    if (o.order_items) {
      for (const item of o.order_items) {
        total += Number(item.quantity || 0) * Number(item.unit_price || 0)
      }
    }
    return {
      ...o,
      total_amount: total,
    }
  })

  return { orders, total: count || 0 }
}

export async function fetchCustomersList(
  page = 1,
  pageSize = 15,
  searchQuery = ''
) {
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (searchQuery.trim()) {
    query = query.or(`full_name.ilike.%${searchQuery.trim()}%,email.ilike.%${searchQuery.trim()}%,city.ilike.%${searchQuery.trim()}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching customers:', error)
    return { customers: [], total: 0 }
  }

  return { customers: (data as Customer[]) || [], total: count || 0 }
}

export async function fetchCategoryAnalytics(): Promise<CategorySales[]> {
  const products = await getProducts()
  const prodMap = new Map(products.map((p) => [p.id, p]))

  const { data: items, error } = await supabase
    .from('order_items')
    .select('product_id, quantity, unit_price')
    .limit(2000)

  if (error || !items) return []

  const catMap = new Map<string, { revenue: number; quantity: number }>()
  let totalRev = 0

  for (const item of items) {
    const prod = prodMap.get(item.product_id)
    const category = prod?.category || 'อื่นๆ'
    const rev = Number(item.quantity || 0) * Number(item.unit_price || 0)
    totalRev += rev

    const curr = catMap.get(category) || { revenue: 0, quantity: 0 }
    curr.revenue += rev
    curr.quantity += Number(item.quantity || 0)
    catMap.set(category, curr)
  }

  return Array.from(catMap.entries()).map(([category, stats]) => ({
    category,
    revenue: Math.round(stats.revenue),
    quantity: stats.quantity,
    percentage: totalRev > 0 ? Math.round((stats.revenue / totalRev) * 100) : 0,
  }))
}
