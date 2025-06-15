import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Provider'
import { ScrollbarWidthSetter } from '@/components/Common/Layout/ScrollbarWidthSetter'

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
        <Providers>
          <ScrollbarWidthSetter />

          <div id="app">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
