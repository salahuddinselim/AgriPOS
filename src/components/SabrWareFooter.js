'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function SabrWareFooter() {
  const { language } = useLanguage()
  
  return (
    <div className="mt-8 pt-4 border-t text-center">
      <p className="text-xs text-gray-400">
        {language === 'bn' ? 'সকল অধিকার সংরক্ষিত © SabrWare' : 'All Rights Reserved © SabrWare'}
      </p>
    </div>
  )
}