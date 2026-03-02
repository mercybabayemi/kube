'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload } from 'lucide-react'
import api from '@/lib/api'
import type { Category } from '@/types'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  category_id: z.string().uuid(),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR']),
  price: z.coerce.number().positive(),
  stock_qty: z.coerce.number().int().nonnegative(),
})
type FormData = z.infer<typeof schema>

export default function AddProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    api.get('/products/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/seller/products', { ...data, images: [] })
      router.push('/seller/products')
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to create product')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Product Title</label>
            <input {...register('title')} className="input mt-1" placeholder="iPhone 12 (64GB, Black)" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select {...register('category_id')} className="input mt-1">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Condition</label>
            <div className="flex gap-4 mt-2">
              {['EXCELLENT', 'GOOD', 'FAIR'].map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input {...register('condition')} type="radio" value={c} />
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price (₦)</label>
              <input {...register('price')} type="number" className="input mt-1" placeholder="185000" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <input {...register('stock_qty')} type="number" className="input mt-1" placeholder="1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea {...register('description')} rows={4} className="input mt-1 resize-none"
              placeholder="Describe the item condition, specs, what's included..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Product Photos (min. 2, max. 8)</label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 hover:border-kube-accent transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Click to upload or drag and drop photos</p>
              <p className="text-xs">PNG, JPG up to 5MB each</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
