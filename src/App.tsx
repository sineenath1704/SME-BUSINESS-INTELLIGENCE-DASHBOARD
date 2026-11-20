import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Orders } from './pages/Orders'
import { Products } from './pages/Products'
import { Customers } from './pages/Customers'
import { Analytics } from './pages/Analytics'
import type { PageId } from './types'

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId
      if (['dashboard', 'orders', 'products', 'customers', 'analytics'].includes(hash)) {
        setActivePage(hash)
      }
    }

    // Set initial from hash if present
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />
      case 'orders':
        return <Orders />
      case 'products':
        return <Products />
      case 'customers':
        return <Customers />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard onNavigate={setActivePage} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20 text-slate-800 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-pink-150/70 bg-white/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} SME Business Intelligence Dashboard • Vibe Coding with AI</p>
          <p className="text-pink-600 font-medium">Powered by React, Tailwind CSS & Supabase</p>
        </div>
      </footer>
    </div>
  )
}
