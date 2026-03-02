import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  SELLER_NOTIFIED: 'Seller Notified',
  SHIPPED_TO_QC: 'Shipped to QC',
  QC_IN_PROGRESS: 'QC In Progress',
  QC_PASSED: 'QC Passed',
  QC_FAILED: 'QC Failed',
  REPAIR_IN_PROGRESS: 'Repair In Progress',
  DISPATCHED: 'Dispatched',
  DELIVERED: 'Delivered',
  CONFIRMED: 'Completed',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
  REFUNDED: 'Refunded',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_STEPS = [
  'PAID',
  'SELLER_NOTIFIED',
  'SHIPPED_TO_QC',
  'QC_IN_PROGRESS',
  'QC_PASSED',
  'DISPATCHED',
  'DELIVERED',
]
