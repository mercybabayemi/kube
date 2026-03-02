# Kube Frontend — Next.js 14

Verified used goods marketplace frontend.

## Setup

```bash
npm install

cp .env.local.example .env.local
# Edit .env.local with your API URL and Paystack public key

npm run dev
```

App runs at: http://localhost:3000

## Stack

- Next.js 14 (App Router, SSR)
- Tailwind CSS
- Zustand (cart + auth state)
- React Hook Form + Zod (form validation)
- Axios (API calls with auth interceptors)
- Lucide React (icons)

## Screen Index

| Screen | Route |
|--------|-------|
| Homepage | `/` |
| Product Listing | `/products` |
| Product Detail | `/products/[id]` |
| Search Results | `/search` |
| Register | `/auth/register` |
| Login | `/auth/login` |
| OTP Verification | `/auth/verify-otp` |
| Seller Apply | `/auth/seller-apply` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Tracking | `/account/orders/[id]` |
| Order History | `/account/orders` |
| Return Request | `/account/returns/new` |
| Seller Dashboard | `/seller` |
| Add Product | `/seller/products/new` |
| Seller Products | `/seller/products` |
| Seller Orders | `/seller/orders` |
| Seller Payouts | `/seller/payouts` |
| QC Dashboard | `/qc` |
| Inspection Detail | `/qc/inspections/[id]` |
| Delivery Assignments | `/delivery` |
| Admin Dashboard | `/admin` |
| Admin Sellers | `/admin/sellers` |
| Admin Orders | `/admin/orders` |
| Admin Disputes | `/admin/disputes` |
