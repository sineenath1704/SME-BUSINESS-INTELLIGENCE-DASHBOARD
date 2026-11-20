import React, { useState } from 'react'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  Menu,
  X,
  Database,
  Sparkles,
} from 'lucide-react'
import type { PageId } from '../types'

interface NavbarProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard },
    { id: 'orders', label: 'คำสั่งซื้อ (Orders)', icon: ShoppingBag },
    { id: 'products', label: 'สินค้า (Products)', icon: Package },
    { id: 'customers', label: 'ลูกค้า (Customers)', icon: Users },
    { id: 'analytics', label: 'วิเคราะห์เชิงลึก (Analytics)', icon: TrendingUp },
  ]

  const handleNavClick = (id: PageId) => {
    setActivePage(id)
    setMobileMenuOpen(false)
    window.location.hash = id
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs shadow-pink-100/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-pink-500/25 ring-2 ring-pink-100">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                  SME <span className="text-pink-600">BI Dashboard</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                  <Database className="w-2.5 h-2.5 text-pink-500" />
                  Supabase Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ระบบจัดการและวิเคราะห์ภาพรวมธุรกิจ SME
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-pink-50/60 p-1.5 rounded-2xl border border-pink-100/80">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-pink-600 font-semibold shadow-xs shadow-pink-200/50 border border-pink-200/80'
                      : 'text-slate-600 hover:text-pink-600 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-50 text-pink-700 border border-pink-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 border border-pink-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-pink-100 bg-white/98 px-4 pt-3 pb-5 space-y-1.5 shadow-lg shadow-pink-100/60 animate-in fade-in duration-150">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-pink-500 text-white font-semibold shadow-sm shadow-pink-500/20'
                    : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-pink-400'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
