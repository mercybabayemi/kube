'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import api from '@/lib/api'
import type { Product, Category } from '@/types'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    condition: '',
    min_price: '',
    max_price: '',
    category_id: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchParams])

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories')
      setCategories(data)
    } catch {}
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { page: String(page), page_size: '20' }
      if (filters.condition) params.condition = filters.condition
      if (filters.min_price) params.min_price = filters.min_price
      if (filters.max_price) params.max_price = filters.max_price
      if (filters.category_id) params.category_id = filters.category_id
      const search = searchParams.get('q')
      if (search) params.search = search
      const category = searchParams.get('category')
      if (category) params.search = category

      const { data } = await api.get('/products', { params })
      setProducts(data.items)
      setTotal(data.total)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    setPage(1)
    fetchProducts()
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter sidebar */}
          <aside className="w-56 flex-shrink-0 hidden md:block">
            <div className="card sticky top-24">
              <div className="flex items-center gap-2 font-semibold mb-4">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price Range</label>
                  <div className="flex gap-2 mt-2">
                    <input className="input text-xs" placeholder="Min" value={filters.min_price}
                      onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))} />
                    <input className="input text-xs" placeholder="Max" value={filters.max_price}
                      onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition</label>
                  <div className="mt-2 space-y-1">
                    {['', 'EXCELLENT', 'GOOD', 'FAIR'].map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="condition" value={c}
                          checked={filters.condition === c}
                          onChange={() => setFilters(f => ({ ...f, condition: c }))} />
                        {c === '' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
                  <select className="input mt-2 text-sm" value={filters.category_id}
                    onChange={e => setFilters(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <button onClick={applyFilters} className="btn-primary w-full">Apply</button>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">{total} products found</div>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products found</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary btn-sm disabled:opacity-40">
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}>
                    {p}
                  </button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary btn-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<><Navbar /><div className="text-center py-20 text-gray-400">Loading...</div><Footer /></>}>
      <ProductsContent />
    </Suspense>
  )
}
