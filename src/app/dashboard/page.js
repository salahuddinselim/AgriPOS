'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardPage() {
  const { t, formatCurrency } = useLanguage()
  const [stats, setStats] = useState({
    todaySales: 0,
    totalDue: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  })
  const [recentInvoices, setRecentInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]

        const { data: productsData } = await supabase
          .from('products')
          .select('id,stock_quantity')
          .lt('stock_quantity', 10)

        const { data: customersData } = await supabase
          .from('customers')
          .select('id,total_due')

        const { data: invoicesData } = await supabase
          .from('invoices')
          .select('id,total_amount,due_amount,created_at,customer_name,customer_phone')
          .gte('created_at', `${today}T00:00:00`)

        const { data: recentData } = await supabase
          .from('invoices')
          .select('id,total_amount,due_amount,created_at,customer_name,customer_phone')
          .order('created_at', { ascending: false })
          .limit(5)

        if (mounted) {
          const todaySales = invoicesData?.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0) || 0
          const totalDue = customersData?.reduce((sum, cust) => sum + Number(cust.total_due || 0), 0) || 0

          setStats({
            todaySales,
            totalDue,
            totalCustomers: customersData?.length || 0,
            lowStockCount: productsData?.length || 0,
          })
          setRecentInvoices(recentData || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('Dashboard error:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error: {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('dashboard')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 md:p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">💰</span>
            <div>
              <div className="text-white/80 text-xs md:text-sm">{t('todaySales')}</div>
              <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.todaySales)}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 md:p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">📋</span>
            <div>
              <div className="text-white/80 text-xs md:text-sm">{t('totalDue')}</div>
              <div className="text-lg md:text-2xl font-bold">{formatCurrency(stats.totalDue)}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 md:p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">👨‍🌾</span>
            <div>
              <div className="text-white/80 text-xs md:text-sm">{t('totalCustomers')}</div>
              <div className="text-lg md:text-2xl font-bold">{stats.totalCustomers}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 md:p-5 rounded-xl shadow-lg text-white">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">⚠️</span>
            <div>
              <div className="text-white/80 text-xs md:text-sm">{t('lowStockAlerts')}</div>
              <div className="text-lg md:text-2xl font-bold">{stats.lowStockCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h2 className="text-lg font-semibold">{t('recentInvoices')}</h2>
        </div>
        <div className="overflow-x-auto">
          {recentInvoices.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No invoices yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Invoice ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Customer</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">Due</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-4 py-3 text-sm font-mono">#{inv.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm">{inv.customer_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">{formatCurrency(inv.total_amount)}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(inv.due_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}