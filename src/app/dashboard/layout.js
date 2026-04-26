'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { 
  LayoutDashboard, 
  FileText, 
  Leaf, 
  Users, 
  ClipboardList, 
  Package, 
  Settings, 
  PlusCircle,
  LogOut,
  Sprout,
  History,
  Menu,
  X
} from 'lucide-react'

export default function DashboardLayout({ children }) {
  const { user, loading: authLoading, initialized, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t, language, toggleLanguage } = useLanguage()
  const [hasMounted, setHasMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (initialized && !authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, initialized, router])

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  const handleSignOut = async () => {
    await signOut()
    router.replace('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const menuItems = useMemo(() => [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/dashboard/invoices/new', label: t('createInvoice'), icon: PlusCircle },
    { href: '/dashboard/products', label: t('products'), icon: Leaf },
    { href: '/dashboard/customers', label: t('customers'), icon: Users },
    { href: '/dashboard/invoices', label: t('invoices'), icon: ClipboardList },
    { href: '/dashboard/inventory', label: t('inventory'), icon: Package },
    { href: '/dashboard/audit-logs', label: 'Activity Log', icon: History },
    { href: '/dashboard/settings', label: t('settings'), icon: Settings },
  ], [t])

  if (!hasMounted || authLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-white border-r border-slate-200 flex-col fixed h-screen z-20">
        <div className="p-4 xl:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                <Sprout size={24} />
              </div>
              <div>
                <h1 className="text-lg xl:text-xl font-bold text-slate-800 tracking-tight">Agri POS</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">by SabrWare</p>
              </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition"
            >
              {language === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </div>

        <div className="p-4">
          <Link
            href="/dashboard/invoices/new"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 hover:shadow-emerald-200 active:scale-[0.98]"
          >
            <PlusCircle size={18} />
            <span>New Invoice</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm shadow-emerald-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-4 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{user.email}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all text-sm font-medium group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col fixed h-screen z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                <Sprout size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 tracking-tight">Agri POS</h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">by SabrWare</p>
              </div>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 flex justify-between items-center">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition"
          >
            {language === 'en' ? 'বাংলা' : 'English'}
          </button>
        </div>

        <div className="px-4">
          <Link
            href="/dashboard/invoices/new"
            onClick={closeSidebar}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 active:scale-[0.98]"
          >
            <PlusCircle size={18} />
            <span>New Invoice</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm shadow-emerald-50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-4 py-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{user.email}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all text-sm font-medium group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:ml-72">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                <Sprout size={18} />
              </div>
              <span className="font-bold text-slate-800">Agri POS</span>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold"
            >
              {language === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
        
        <footer className="px-4 md:px-6 lg:px-8 py-4 md:py-6 text-center border-t border-slate-100 bg-white/50">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            All Rights Reserved © 2024 SabrWare
          </p>
        </footer>
      </main>
    </div>
  )
}