'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight, Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/store/cartStore'
import { formatNaira } from '@/lib/utils'

const DELIVERY_FEE = 3500

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const sub = subtotal()
  const total = sub + DELIVERY_FEE

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-600 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Add some verified goods to get started</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart ({items.length} items)</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images?.[0] || '/placeholder.png'}
                    alt={product.title}
                    fill className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.id}`} className="font-medium text-sm hover:text-kube-accent line-clamp-2">
                    {product.title}
                  </Link>
                  <div className="badge-verified mt-1">Kube Verified</div>
                  <div className="flex items-center gap-4 mt-2">
                    <select
                      value={quantity}
                      onChange={e => updateQuantity(product.id, Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {Array.from({ length: Math.min(product.stock_qty, 10) }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <span className="font-bold text-gray-900">{formatNaira(product.price * quantity)}</span>
                    <button onClick={() => removeItem(product.id)} className="ml-auto text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <Link href="/products" className="text-sm text-kube-accent hover:underline">
              &larr; Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="card sticky top-24">
              <h2 className="font-bold mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatNaira(sub)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery fee</span><span>{formatNaira(DELIVERY_FEE)}</span></div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span><span>{formatNaira(total)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3 mt-4 text-xs text-green-700">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Your payment is held safely in escrow until you confirm delivery.
              </div>

              <Link href="/checkout" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
