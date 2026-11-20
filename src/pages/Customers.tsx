import React, { useEffect, useState } from 'react'
import {
  Search,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserCheck,
} from 'lucide-react'
import { fetchCustomersList } from '../services/api'
import type { Customer } from '../types'

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [search, setSearch] = useState<string>('')

  const pageSize = 15

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const res = await fetchCustomersList(page, pageSize, search)
      setCustomers(res.customers)
      setTotalCount(res.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadCustomers()
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              ฐานข้อมูลลูกค้า <span className="text-pink-600">(Customers)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              {totalCount.toLocaleString()} ราย
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            ข้อมูลสมาชิกและลูกค้าทั้งหมด ค้นหาตามชื่อ อีเมล เบอร์โทรศัพท์ หรือจังหวัด
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล หรือจังหวัด..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-pink-50/40 border border-pink-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
          <UserCheck className="w-4 h-4 text-pink-500" />
          <span>ลูกค้าลงทะเบียนครอบคลุมทุกภูมิภาค</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-pink-150 shadow-xs shadow-pink-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-pink-50/50 border-b border-pink-100 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">ลูกค้า</th>
                <th className="py-3 px-4">อีเมล</th>
                <th className="py-3 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4">จังหวัด/ที่อยู่</th>
                <th className="py-3 px-4">วันที่สมัคร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin mx-auto mb-2" />
                    กำลังโหลดข้อมูลลูกค้า...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลลูกค้าที่ตรงกับการค้นหา
                  </td>
                </tr>
              ) : (
                customers.map((cust) => {
                  const joinDate = new Date(cust.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                  return (
                    <tr key={cust.id} className="hover:bg-pink-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {cust.full_name ? cust.full_name.charAt(0) : 'U'}
                          </div>
                          <span className="font-bold text-slate-800">{cust.full_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span>{cust.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span>{cust.phone || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span className="font-medium text-slate-700">{cust.city || '-'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                          <span>{joinDate}</span>
                        </div>
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
    </div>
  )
}
