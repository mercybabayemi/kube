'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { CheckCircle, Shield, ShoppingCart, Zap } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatNaira } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import api from '@/lib/api'
import type { Product } from '@/types'

const CONDITION_LABELS = { EXCELLENT: 'Excellent', GOOD: 'Good', FAIR: 'Fair' }

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => {})
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>
        <Footer />
      </>
    )
  }

  const images = product.images.length > 0 ? product.images : ['/placeholder.png']

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-6">
          Home › {product.category?.name} › {product.title}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
              <Image src={images[activeImg]} alt={product.title} fill className="object-cover" />
            </div>
            <div className="flex gap-2">
              {images.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${i === activeImg ? 'border-kube-accent' : 'border-transparent'}`}>
                  <Image src={src} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="badge-verified mb-2">
                <CheckCircle className="w-3 h-3" /> Kube Verified
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            </div>

            <div className="text-3xl font-bold text-kube-primary">{formatNaira(product.price)}</div>

            <div className="flex gap-4 text-sm">
              <div>
                <span className="text-gray-500">Condition: </span>
                <span className="font-medium">{CONDITION_LABELS[product.condition]}</span>
              </div>
              <div>
                <span className="text-gray-500">In Stock: </span>
                <span className="font-medium">{product.stock_qty} units</span>
              </div>
            </div>

            {/* Escrow badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
              <Shield className="w-5 h-5 text-kube-green flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-green-800 text-sm">Safe Escrow Payment</div>
                <div className="text-xs text-green-700 mt-0.5">
                  Pay now. We test it. Delivered to you. Your money is only released after you confirm.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-kube-accent text-kube-accent hover:bg-kube-accent hover:text-white transition-colors rounded-xl py-3 font-semibold">
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
              <button onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 rounded-xl">
                <Zap className="w-5 h-5" /> Buy Now
              </button>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
