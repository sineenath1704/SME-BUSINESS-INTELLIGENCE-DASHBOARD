import React, { useEffect, useState } from 'react'
import {
  Package,
  Search,
  Tag,
  DollarSign,
  Coffee,
  ShoppingBag,
} from 'lucide-react'
import { getProducts } from '../services/api'
import type { Product } from '../types'

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setLoading(false)
    }
    load()
  }, [])

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    const matchSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const formatTHB = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Quick stats
  const averagePrice =
    products.length > 0
      ? Math.round(products.reduce((acc, p) => acc + Number(p.unit_price), 0) / products.length)
      : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-pink-100">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              รายการสินค้า <span className="text-pink-600">(Products)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
              {products.length} รายการ
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            แคตตาล็อกสินค้าทั้งหมดในระบบ แยกตามหมวดหมู่และราคาต่อหน่วย
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">สินค้าทั้งหมด</p>
            <p className="text-2xl font-black text-slate-800">{products.length} รายการ</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">หมวดหมู่สินค้า</p>
            <p className="text-2xl font-black text-slate-800">{categories.length - 1} หมวด</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">ราคาเฉลี่ยต่อชิ้น</p>
            <p className="text-2xl font-black text-pink-600">{formatTHB(averagePrice)}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-pink-150 shadow-xs shadow-pink-100/50 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-pink-500 text-white shadow-xs shadow-pink-300'
                  : 'bg-pink-50/60 text-slate-600 hover:bg-pink-100'
              }`}
            >
              {cat === 'all' ? 'ทุกหมวดหมู่' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-pink-50/40 border border-pink-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-500 animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-sm">กำลังโหลดรายการสินค้า...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-pink-100 text-slate-400">
          ไม่พบสินค้าที่ตรงกับการค้นหา
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl p-5 border border-pink-150 shadow-xs shadow-pink-100/50 hover:shadow-md hover:shadow-pink-100 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-100">
                    {prod.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-pink-50/50 flex items-center justify-center text-pink-400 group-hover:text-pink-600 transition-colors">
                    {prod.category.includes('กาแฟ') ? (
                      <Coffee className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-pink-600 transition-colors line-clamp-2">
                  {prod.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-100/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">ราคาต่อชิ้น</span>
                <span className="text-base font-black text-slate-800">
                  {formatTHB(Number(prod.unit_price))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
