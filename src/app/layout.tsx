import { ScrollbarWidthSetter } from '@/components/Common/Layout/ScrollbarWidthSetter'
import { Providers } from '@/components/Provider'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import React from 'react'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Pragma Lab',
  description: 'A modern web application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <ScrollbarWidthSetter />
        <React.StrictMode>
          <Providers>
            <div id="app">{children}</div>
          </Providers>
        </React.StrictMode>
      </body>
    </html>
  )
}
