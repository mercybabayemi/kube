export type UserRole = 'BUYER' | 'SELLER' | 'QC_OFFICER' | 'DELIVERY_OFFICER' | 'ADMIN'

export interface User {
  id: string
  name: string
  phone: string
  email: string | null
  role: UserRole
  email_verified: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  commission_rate: number
}

export interface Product {
  id: string
  seller_id: string
  category_id: string
  title: string
  description: string
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR'
  price: number
  stock_qty: number
  images: string[]
  verification_status: 'PENDING' | 'APPROVED' | 'REJECTED'
  is_active: boolean
  created_at: string
  category?: Category
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  delivery_fee: number
  delivery_address: string
  delivery_name: string | null
  delivery_phone: string | null
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  commission_deducted: number
  seller_payout: number
  status: string
  gateway: string
  gateway_reference: string | null
  created_at: string
  released_at: string | null
}

export interface QCInspection {
  id: string
  order_id: string
  product_id: string
  officer_id: string | null
  warehouse_id: string | null
  status: string
  notes: string | null
  repair_details: string | null
  received_at: string
  inspected_at: string | null
  ready_at: string | null
}

export interface Shipment {
  id: string
  order_id: string
  delivery_officer_id: string | null
  tracking_number: string
  status: string
  dispatched_at: string | null
  delivered_at: string | null
  created_at: string
}

export interface Return {
  id: string
  order_id: string
  buyer_id: string
  reason: string
  description: string | null
  status: string
  resolution_type: string | null
  admin_notes: string | null
  created_at: string
  resolved_at: string | null
}
