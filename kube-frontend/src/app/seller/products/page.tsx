'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatNaira } from '@/lib/utils'
import api from '@/lib/api'
import type { Product } from '@/types'

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/products').then(r => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link href="/seller/products/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="card">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                <Image src={p.images?.[0] || '/placeholder.png'} alt={p.title} fill className="object-cover" />
              </div>
              <div className="font-medium text-sm line-clamp-2">{p.title}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold">{formatNaira(p.price)}</span>
                <StatusBadge status={p.verification_status} />
              </div>
              <div className="text-xs text-gray-500 mt-1">Stock: {p.stock_qty}</div>
              <Link href={`/seller/products/${p.id}/edit`} className="btn-secondary btn-sm w-full mt-3 flex items-center justify-center gap-1 text-xs">
                <Edit className="w-3 h-3" /> Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
