import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodesDevs - AI Agents for Business Growth',
  description: 'Enterprise AI solutions with SOC 2 compliance',
}

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] })
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
