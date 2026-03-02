'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, CheckCircle } from 'lucide-react'
import { formatNaira } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

const CONDITION_LABELS = { EXCELLENT: 'Excellent', GOOD: 'Good', FAIR: 'Fair' }
const CONDITION_COLORS = {
  EXCELLENT: 'bg-green-100 text-green-700',
  GOOD: 'bg-blue-100 text-blue-700',
  FAIR: 'bg-yellow-100 text-yellow-700',
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const thumb = product.images?.[0] || '/placeholder.png'

  return (
    <div className="card group hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
          <Image
            src={thumb}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-1">
        <div className="badge-verified">
          <CheckCircle className="w-3 h-3" /> Kube Verified
        </div>

        <Link href={`/products/${product.id}`} className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-kube-accent">
          {product.title}
        </Link>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_COLORS[product.condition]}`}>
            {CONDITION_LABELS[product.condition]}
          </span>
          {product.stock_qty <= 3 && product.stock_qty > 0 && (
            <span className="text-xs text-orange-600">{product.stock_qty} left</span>
          )}
        </div>

        <div className="font-bold text-gray-900 mt-1">{formatNaira(product.price)}</div>

        <button
          onClick={() => addItem(product)}
          className="mt-2 flex items-center justify-center gap-2 w-full border border-kube-accent text-kube-accent hover:bg-kube-accent hover:text-white transition-colors rounded-lg py-2 text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  )
}
