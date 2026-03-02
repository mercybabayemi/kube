'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatNaira } from '@/lib/utils'
import api from '@/lib/api'

const DELIVERY_FEE = 3500

const schema = z.object({
  delivery_name: z.string().min(2),
  delivery_phone: z.string().min(10),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const NIGERIAN_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const sub = subtotal()
  const total = sub + DELIVERY_FEE

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (!isAuthenticated()) {
    router.push('/auth/login')
    return null
  }

  const onSubmit = async (data: FormData) => {
    try {
      const orderPayload = {
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        delivery_address: `${data.street}, ${data.city}, ${data.state}`,
        delivery_name: data.delivery_name,
        delivery_phone: data.delivery_phone,
        notes: data.notes,
      }

      const { data: order } = await api.post('/orders', orderPayload)

      // Initiate Paystack payment
      const { data: payment } = await api.post(`/payments/initiate/${order.id}`)

      clearCart()
      // Redirect to Paystack payment page
      window.location.href = payment.authorization_url
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Checkout failed. Please try again.')
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Delivery details */}
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-700">Delivery Address</h2>

              <div>
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input {...register('delivery_name')} className="input mt-1" placeholder="John Doe" />
                {errors.delivery_name && <p className="text-red-500 text-xs mt-1">{errors.delivery_name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input {...register('delivery_phone')} className="input mt-1" placeholder="08012345678" />
                {errors.delivery_phone && <p className="text-red-500 text-xs mt-1">{errors.delivery_phone.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <input {...register('street')} className="input mt-1" placeholder="12 Adeola Close, Lekki Phase 1" />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">City / LGA</label>
                  <input {...register('city')} className="input mt-1" placeholder="Lagos Island" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <select {...register('state')} className="input mt-1">
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Additional notes (optional)</label>
                <textarea {...register('notes')} rows={2} className="input mt-1 resize-none" placeholder="Landmark, gate colour..." />
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="card sticky top-24">
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">{product.title} x{quantity}</span>
                      <span className="font-medium flex-shrink-0">{formatNaira(product.price * quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatNaira(sub)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{formatNaira(DELIVERY_FEE)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span>Total</span><span>{formatNaira(total)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3 mt-4 text-xs text-green-700">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  Escrow Payment — your money is held safely until you confirm delivery.
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
                  {isSubmitting ? 'Processing...' : `Pay ${formatNaira(total)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
