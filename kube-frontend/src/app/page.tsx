'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const CATEGORIES = [
  { name: 'Phones', slug: 'phones', icon: '📱' },
  { name: 'Laptops', slug: 'laptops', icon: '💻' },
  { name: 'Home', slug: 'home', icon: '🏠' },
  { name: 'Fashion', slug: 'fashion', icon: '👗' },
  { name: 'Appliances', slug: 'appliances', icon: '❄️' },
  { name: 'TVs', slug: 'tvs', icon: '📺' },
  { name: 'Auto', slug: 'auto', icon: '🚗' },
]

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products
    api.get('/products?page=1&page_size=6')
      .then(res => {
        setProducts(res.data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-kube-primary text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Buy used goods<br />you can <span className="text-kube-accent">trust.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Every item is physically tested by Kube before it reaches you.
              Your payment is held safely until you confirm delivery.
            </p>
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-2xl font-bold mb-8">How Kube Works</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: Package, label: '1. Browse', desc: 'Find verified used goods' },
                { icon: Shield, label: '2. Pay Safely', desc: 'Funds held in escrow' },
                { icon: CheckCircle, label: '3. We Test It', desc: 'Kube QC team inspects' },
                { icon: Truck, label: '4. Delivered', desc: 'Straight to your door' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-kube-accent/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-kube-accent" />
                  </div>
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="font-bold text-xl mb-6">Browse by Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-kube-accent/10 rounded-xl transition-colors text-center"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Listed */}
        <section className="py-4 px-4 max-w-7xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl">Recently Listed</h2>
            <Link href="/products" className="text-sm text-kube-accent font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Products coming soon</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
