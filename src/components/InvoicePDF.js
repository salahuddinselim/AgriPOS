'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

export default function InvoicePDF({ invoice, onClose }) {
  const { t, formatCurrency, language, getUnit } = useLanguage()
  const [shopSettings, setShopSettings] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data } = await supabase.from('shop_settings').select('*').limit(1)
    if (data?.length) setShopSettings(data[0])
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice, shopSettings, language }),
      })
      
      if (!response.ok) throw new Error('Failed to generate PDF')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice.id.slice(0, 8)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      window.print()
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    if (language === 'bn') {
      const bnDigits = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
      const day = d.getDate().toString().split('').map(x => bnDigits[x] || x).join('')
      const month = (d.getMonth() + 1).toString().split('').map(x => bnDigits[x] || x).join('')
      const year = d.getFullYear().toString().split('').map(x => bnDigits[x] || x).join('')
      return day + '/' + month + '/' + year
    }
    return d.toLocaleDateString('en-BD')
  }

  const invoiceNumber = language === 'bn' 
    ? invoice.id.slice(0, 8).toUpperCase().split('').map(d => {
        const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
        return map[d] || d
      }).join('')
    : invoice.id.slice(0, 8).toUpperCase()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 my-8">
        <div className="p-6" id="invoice-content">
          <div className="text-center border-b pb-4 mb-4">
            {shopSettings?.logo_url && (
              <img src={shopSettings.logo_url} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
            )}
            <h1 className="text-xl font-bold">{shopSettings?.name || 'Agricultural Shop'}</h1>
            <p className="text-sm text-gray-600">{shopSettings?.address}</p>
            <p className="text-sm text-gray-600">{shopSettings?.phone}</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{t('customer')}: {invoice.customer_name}</p>
                <p className="text-sm">{t('phone')}: {invoice.customer_phone}</p>
                {invoice.customer_address && (
                  <p className="text-sm">{invoice.customer_address}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold">{t('invoiceId')}: #{invoiceNumber}</p>
                <p className="text-sm">{t('date')}: {formatDate(invoice.created_at)}</p>
              </div>
            </div>
          </div>

          <table className="w-full mb-4">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">{t('name')}</th>
                <th className="text-right py-2">{t('quantity')}</th>
                <th className="text-right py-2">{t('price')}</th>
                <th className="text-right py-2">{t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.product_name}</td>
                  <td className="py-2 text-right">
                    {item.quantity} {getUnit(item.product_unit)}
                  </td>
                  <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(item.item_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-1">
              <span>{t('totalAmount')}:</span>
              <span className="font-bold text-lg">{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>{t('paidAmount')}:</span>
              <span>{formatCurrency(invoice.paid_amount)}</span>
            </div>
            <div className="flex justify-between text-red-600 font-bold">
              <span>{t('due')}:</span>
              <span>{formatCurrency(invoice.due_amount)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('printInvoice')}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {t('downloadPdf')}
          </button>
        </div>
      </div>
    </div>
  )
}