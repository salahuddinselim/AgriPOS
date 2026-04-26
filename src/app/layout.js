import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

export const metadata = {
  title: 'Agri POS - Agricultural POS System by SabrWare',
  description: 'Agricultural Shop POS and Inventory Management System - Created by SabrWare',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="author" content="SabrWare" />
        <meta name="company" content="SabrWare" />
        <meta name="generator" content="SabrWare" />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}