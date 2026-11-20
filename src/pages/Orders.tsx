import React, { useEffect, useState } from 'react'
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  MapPin,
  RefreshCw,
} from 'lucide-react'
import { fetchOrdersList } from '../services/api'
import type { Order } from '../types'

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState<string>('')
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  const pageSize = 15

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetchOrdersList(page, pageSize, statusFilter, search)
      setOrders(res.orders)
      setTotalCount(res.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [page, statusFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadOrders()
  }

  const formatTHB = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              รายการคำสั่งซื้อ <span className="text-pink-600">(Orders)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              {totalCount.toLocaleString()} รายการ
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            ค้นหา ตรวจสอบสถานะ และดูรายละเอียดคำสั่งซื้อทั้งหมดในระบบ
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders()}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white text-slate-700 hover:text-pink-600 hover:bg-pink-50 border border-pink-200 shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-pink-500 ${loading ? 'animate-spin' : ''}`} />
          <span>รีเฟรช</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'paid', label: 'ชำระแล้ว' },
            { id: 'pending', label: 'รอดำเนินการ' },
            { id: 'cancelled', label: 'ยกเลิก' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id)
                setPage(1)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-pink-500 text-white shadow-xs shadow-pink-300'
                  : 'bg-pink-50/60 text-slate-600 hover:bg-pink-100/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาด้วยเลขที่คำสั่งซื้อ (เช่น ORD-007)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-pink-50/40 border border-pink-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
          />
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-pink-150 shadow-xs shadow-pink-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-pink-50/50 border-b border-pink-100 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">เลขที่ออเดอร์</th>
                <th className="py-3 px-4">ลูกค้า</th>
                <th className="py-3 px-4">จังหวัด</th>
                <th className="py-3 px-4">วันที่สั่งซื้อ</th>
                <th className="py-3 px-4 text-right">ยอดชำระ</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin mx-auto mb-2" />
                    กำลังโหลดคำสั่งซื้อ...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const dateFormatted = new Date(order.ordered_at).toLocaleString('th-TH', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  return (
                    <tr key={order.id} className="hover:bg-pink-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-pink-600">
                        {order.order_no}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {order.customer?.full_name || 'ลูกค้าทั่วไป'}
                        </div>
                        <div className="text-[11px] text-slate-400">{order.customer?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{order.customer?.city || '-'}</td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                        {formatTHB(order.total_amount || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {order.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            ชำระแล้ว
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            ยกเลิก
                          </span>
                        )}
                        {order.status !== 'paid' && order.status !== 'cancelled' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            รอดำเนินการ
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-pink-600 hover:text-white hover:bg-pink-500 bg-pink-50 border border-pink-200 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ดูบิล</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white">
          <div>
            หน้า {page} จาก {totalPages} (ทั้งหมด {totalCount.toLocaleString()} รายการ)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-pink-200 text-slate-600 hover:bg-pink-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-pink-600 px-2">{page}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-pink-200 text-slate-600 hover:bg-pink-50 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-pink-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-pink-500 to-rose-400 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-pink-100">ใบเสร็จคำสั่งซื้อ</p>
                <h3 className="text-xl font-bold font-mono">{activeOrder.order_no}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Customer Info Card */}
              <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <User className="w-4 h-4 text-pink-500" />
                  <span>{activeOrder.customer?.full_name || 'ลูกค้าทั่วไป'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>อีเมล: {activeOrder.customer?.email || '-'}</div>
                  <div>เบอร์โทร: {activeOrder.customer?.phone || '-'}</div>
                  <div className="flex items-center gap-1 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    <span>เมือง/จังหวัด: {activeOrder.customer?.city || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  รายการสินค้าในคำสั่งซื้อ ({activeOrder.order_items?.length || 0} รายการ)
                </h4>
                <div className="divide-y divide-pink-100 border-y border-pink-100">
                  {activeOrder.order_items?.map((item) => {
                    const itemSubtotal = item.quantity * item.unit_price
                    return (
                      <div key={item.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                        <div>
                          <p className="font-bold text-slate-800">
                            {item.product?.name || 'สินค้า'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            หมวดหมู่: {item.product?.category || '-'} • ฿{item.unit_price} × {item.quantity} ชิ้น
                          </p>
                        </div>
                        <div className="font-bold text-slate-800">
                          {formatTHB(itemSubtotal)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-2 flex items-center justify-between border-t border-pink-200">
                <span className="font-bold text-slate-700">ยอดรวมทั้งสิ้น</span>
                <span className="text-xl font-black text-pink-600">
                  {formatTHB(activeOrder.total_amount || 0)}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
