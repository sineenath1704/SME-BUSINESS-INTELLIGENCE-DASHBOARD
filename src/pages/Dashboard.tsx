import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  RefreshCw,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { fetchDashboardData } from '../services/api'
import type { DashboardMetrics, TopProduct, DailySales, Order, PageId } from '../types'

interface DashboardProps {
  onNavigate: (page: PageId) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [salesTrend, setSalesTrend] = useState<DailySales[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await fetchDashboardData()
      setMetrics(data.metrics)
      setTopProducts(data.topProducts)
      setSalesTrend(data.salesTrend)
      setRecentOrders(data.recentOrders)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Format currency in Thai Baht
  const formatTHB = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format numbers with commas
  const formatNum = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          กำลังดึงข้อมูลจาก Supabase...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-pink-100/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              ภาพรวมธุรกิจ <span className="text-pink-600">SME Dashboard</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              Live Realtime
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            สรุปข้อมูลสถิติยอดขาย คำสั่งซื้อ และลูกค้าทั้งหมด เชื่อมต่อกับ Supabase PostgreSQL
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 border border-pink-200 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-pink-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'กำลังรีเฟรช...' : 'รีเฟรชข้อมูล'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (Requirements 1, 2, 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ยอดขายรวม (Total Revenue)
            </span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight text-pink-600">
            {formatTHB(metrics?.totalRevenue || 0)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              เฉพาะรายการที่ชำระแล้ว
            </span>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              คำสั่งซื้อทั้งหมด (Total Orders)
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {formatNum(metrics?.totalOrders || 0)} <span className="text-sm font-semibold text-slate-400">ออเดอร์</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-medium">{formatNum(metrics?.paidOrdersCount || 0)} สำเร็จ</span>
            <span>•</span>
            <span className="text-rose-500 font-medium">{formatNum(metrics?.cancelledOrdersCount || 0)} ยกเลิก</span>
          </div>
        </div>

        {/* Metric 3: Total Customers */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ลูกค้าทั้งหมด (Total Customers)
            </span>
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {formatNum(metrics?.totalCustomers || 0)} <span className="text-sm font-semibold text-slate-400">คน</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <span className="text-pink-600 font-medium">ครอบคลุมทั่วประเทศ</span>
          </div>
        </div>

        {/* Metric 4: Average Order Value */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition-all duration-200 group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ยอดเฉลี่ยต่อออเดอร์ (AOV)
            </span>
            <div className="w-10 h-10 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {formatTHB(metrics?.averageOrderValue || 0)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <span>คำนวณจากยอดคำสั่งซื้อสำเร็จ</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Rankings Row (Requirements 4 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Analytics Chart (Requirement 4) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  แนวโน้มยอดขายตามช่วงเวลา (Sales Analytics)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                กราฟแสดงยอดขายและปริมาณคำสั่งซื้อรายวัน
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 border border-pink-100 text-xs font-semibold text-pink-700">
              <Calendar className="w-3.5 h-3.5 text-pink-500" />
              <span>ช่วงเวลาล่าสุด</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `฿${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-pink-200 shadow-lg shadow-pink-100 text-xs">
                          <p className="font-bold text-slate-800 mb-1">{label}</p>
                          <p className="text-pink-600 font-semibold">
                            ยอดขาย: {formatTHB(Number(payload[0].value || 0))}
                          </p>
                          <p className="text-slate-500">
                            จำนวนออเดอร์: {payload[0].payload.ordersCount} ออเดอร์
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#pinkGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Best-Selling Products (Requirement 5) */}
        <div className="bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  สินค้าขายดี 5 อันดับ (Top Products)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
              >
                ดูทั้งหมด <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              จัดอันดับตามยอดขายรวมที่ชำระเงินเรียบร้อย
            </p>

            <div className="space-y-3">
              {topProducts.map((prod, index) => {
                const rankStyles = [
                  'bg-pink-500 text-white shadow-xs shadow-pink-400/30',
                  'bg-rose-400 text-white',
                  'bg-pink-300 text-slate-800',
                  'bg-slate-100 text-slate-600',
                  'bg-slate-100 text-slate-600',
                ]
                return (
                  <div
                    key={prod.id}
                    className="p-3 rounded-xl bg-pink-50/40 border border-pink-100/80 hover:bg-pink-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${rankStyles[index]}`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {prod.category} • ขายแล้ว {formatNum(prod.totalQuantity)} ชิ้น
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-pink-600">
                        {formatTHB(prod.totalRevenue)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 text-center">
            <span className="text-xs text-slate-400">
              อัปเดตแบบ Realtime จากคำสั่งซื้อล่าสุด
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table (Requirement 6) */}
      <div className="bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-pink-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                รายการคำสั่งซื้อล่าสุด (Recent Orders)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              แสดงคำสั่งซื้อที่เกิดขึ้นล่าสุดในระบบ พร้อมรายละเอียดลูกค้าและสถานะ
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200 transition cursor-pointer self-start sm:self-auto"
          >
            <span>ดูรายการคำสั่งซื้อทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-pink-100 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">เลขที่ออเดอร์</th>
                <th className="pb-3">ลูกค้า</th>
                <th className="pb-3">เมือง/จังหวัด</th>
                <th className="pb-3">วันที่สั่งซื้อ</th>
                <th className="pb-3 text-right">ยอดรวม</th>
                <th className="pb-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {recentOrders.map((order) => {
                const dateFormatted = new Date(order.ordered_at).toLocaleString('th-TH', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <tr key={order.id} className="hover:bg-pink-50/40 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-pink-600">
                      {order.order_no}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-800">
                        {order.customer?.full_name || 'ลูกค้าทั่วไป'}
                      </div>
                      <div className="text-[11px] text-slate-400">{order.customer?.email}</div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {order.customer?.city || '-'}
                    </td>
                    <td className="py-3.5 text-slate-500 whitespace-nowrap">
                      {dateFormatted}
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-800">
                      {formatTHB(order.total_amount || 0)}
                    </td>
                    <td className="py-3.5 text-center">
                      {order.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          ชำระแล้ว
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          ยกเลิก
                        </span>
                      )}
                      {order.status !== 'paid' && order.status !== 'cancelled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          รอดำเนินการ
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
