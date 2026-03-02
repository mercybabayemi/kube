import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kube — Verified Used Goods',
  description: 'Buy verified used goods with confidence. Every item tested by Kube before delivery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
