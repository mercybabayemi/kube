import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-600',
  PAID: 'bg-blue-100 text-blue-700',
  SELLER_NOTIFIED: 'bg-blue-100 text-blue-700',
  SHIPPED_TO_QC: 'bg-purple-100 text-purple-700',
  QC_IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  QC_PASSED: 'bg-teal-100 text-teal-700',
  QC_FAILED: 'bg-red-100 text-red-700',
  REPAIR_IN_PROGRESS: 'bg-orange-100 text-orange-700',
  DISPATCHED: 'bg-sky-100 text-sky-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  RETURN_REQUESTED: 'bg-yellow-100 text-yellow-700',
  RETURNED: 'bg-gray-100 text-gray-600',
  REFUNDED: 'bg-pink-100 text-pink-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[status] || 'bg-gray-100 text-gray-600')}>
      {ORDER_STATUS_LABELS[status] || status}
    </span>
  )
}
