import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  PieChart as PieIcon,
  Lightbulb,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { fetchCategoryAnalytics, fetchDashboardData } from '../services/api'
import type { CategorySales, DashboardMetrics } from '../types'

export const Analytics: React.FC = () => {
  const [categories, setCategories] = useState<CategorySales[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [catData, dashData] = await Promise.all([
        fetchCategoryAnalytics(),
        fetchDashboardData(),
      ])
      setCategories(catData)
      setMetrics(dashData.metrics)
      setLoading(false)
    }
    load()
  }, [])

  const formatTHB = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Pink palette for categories
  const PINK_PALETTE = ['#ec4899', '#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#db2777']

  // Order status breakdown data
  const statusData = [
    { name: 'ชำระเงินสำเร็จ (Paid)', value: metrics?.paidOrdersCount || 0, color: '#10b981' },
    { name: 'ยกเลิก (Cancelled)', value: metrics?.cancelledOrdersCount || 0, color: '#f43f5e' },
    { name: 'รอดำเนินการ (Pending)', value: metrics?.pendingOrdersCount || 0, color: '#f59e0b' },
  ]

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-pink-200 border-t-pink-500 animate-spin mb-3" />
        <p className="text-slate-400 text-sm">กำลังคำนวณการวิเคราะห์...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-pink-100">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            การวิเคราะห์เชิงลึก <span className="text-pink-600">(Business Intelligence)</span>
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
            Insights
          </span>
        </div>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          เจาะลึกสัดส่วนยอดขายตามหมวดหมู่ พฤติกรรมการสั่งซื้อ และประสิทธิภาพของธุรกิจ SME
        </p>
      </div>

      {/* AI Business Insights Card */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-white rounded-2xl p-6 border border-pink-200 shadow-xs shadow-pink-100/50">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500 text-white shadow-sm shadow-pink-300">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              บทวิเคราะห์เพื่อการตัดสินใจสำหรับผู้ประกอบการ (Executive Takeaways)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              • อัตราคำสั่งซื้อสำเร็จอยู่ที่ประมาณ{' '}
              <span className="font-bold text-emerald-600">
                {metrics?.totalOrders
                  ? Math.round(((metrics.paidOrdersCount || 0) / metrics.totalOrders) * 100)
                  : 0}
                %
              </span>{' '}
              ของคำสั่งซื้อทั้งหมด สะท้อนถึงเสถียรภาพของการชำระเงินที่ดี
              <br />
              • หมวดหมู่ที่สร้างรายได้หลักคือ{' '}
              <span className="font-bold text-pink-600">
                {categories[0]?.category || 'กาแฟ'}
              </span>{' '}
              คิดเป็นสัดส่วนสูงที่สุด ควรเน้นการทำโปรโมชั่น Cross-selling ควบคู่กับขนมและเบเกอรี่
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Breakdown (Pie/Donut Chart) */}
        <div className="bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PieIcon className="w-5 h-5 text-pink-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                สัดส่วนยอดขายแบ่งตามหมวดหมู่สินค้า
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              คิดเป็นเปอร์เซ็นต์ของยอดขายรวมทั้งหมด
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {categories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PINK_PALETTE[index % PINK_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategorySales
                        return (
                          <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-pink-200 shadow-lg text-xs">
                            <p className="font-bold text-slate-800">{data.category}</p>
                            <p className="text-pink-600 font-semibold">{formatTHB(data.revenue)}</p>
                            <p className="text-slate-500">{data.percentage}% ของยอดรวม</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-pink-100">
            {categories.map((cat, idx) => (
              <div key={cat.category} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: PINK_PALETTE[idx % PINK_PALETTE.length] }}
                />
                <span className="text-slate-600 truncate">{cat.category}</span>
                <span className="font-bold text-slate-800 ml-auto">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                สถานะคำสั่งซื้อทั้งหมด (Order Status)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              การกระจายตัวของสถานะคำสั่งซื้อจากทั้งหมด {metrics?.totalOrders?.toLocaleString()} ออเดอร์
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fce7f3" />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} width={120} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2.5 rounded-xl border border-pink-200 shadow-md text-xs">
                            <p className="font-bold text-slate-800">{payload[0].payload.name}</p>
                            <p className="font-semibold text-pink-600">{payload[0].value?.toLocaleString()} ออเดอร์</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-pink-100 flex items-center justify-around text-xs">
            <div className="text-center">
              <p className="text-slate-400">ชำระสำเร็จ</p>
              <p className="text-sm font-black text-emerald-600">
                {metrics?.paidOrdersCount?.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">ยกเลิก</p>
              <p className="text-sm font-black text-rose-500">
                {metrics?.cancelledOrdersCount?.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">รอดำเนินการ</p>
              <p className="text-sm font-black text-amber-500">
                {metrics?.pendingOrdersCount?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
