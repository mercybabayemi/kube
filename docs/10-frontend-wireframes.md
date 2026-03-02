# Kube — Frontend Wireframes

**Version:** 1.0
**Date:** 2026-02-20
**Renderer:** ASCII wireframes — for layout reference only. Not final design.

---

## Screen Index

| # | Screen | Role |
|---|--------|------|
| 1 | Homepage | Public |
| 2 | Product Listing (Browse by Category) | Public |
| 3 | Product Detail Page | Public |
| 4 | Search Results | Public |
| 5 | Register / Login | All users |
| 6 | OTP Verification | All users |
| 7 | Cart | Buyer |
| 8 | Checkout | Buyer |
| 9 | Order Tracking | Buyer |
| 10 | Order History | Buyer |
| 11 | Return Request Form | Buyer |
| 12 | Seller Dashboard | Seller |
| 13 | Add / Edit Product | Seller |
| 14 | Seller Orders | Seller |
| 15 | Payout Status | Seller |
| 16 | QC Dashboard | QC Officer |
| 17 | Inspection Detail | QC Officer |
| 18 | Delivery Assignments | Delivery Officer |
| 19 | Admin Dashboard | Admin |
| 20 | Admin — Seller Approvals | Admin |
| 21 | Admin — Order Management | Admin |
| 22 | Admin — Dispute Resolution | Admin |

---

## PUBLIC SCREENS

---

### Screen 1 — Homepage

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE LOGO]          Search products...  [🔍]      [Login] [Sign Up]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Buy used goods you can trust.                              │   │
│   │  Every item tested by Kube before it reaches you.          │   │
│   │                                    [Shop Now →]            │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  BROWSE BY CATEGORY                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  📱      │  │  💻      │  │  🏠      │  │  👗      │           │
│  │ Phones   │  │ Laptops  │  │  Home    │  │ Fashion  │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  ❄️      │  │  📺      │  │  🚗      │  │  More ›  │           │
│  │ Applianc.│  │   TVs    │  │ Auto     │  │          │           │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
│  RECENTLY LISTED                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  [img]       │  │  [img]       │  │  [img]       │             │
│  │  iPhone 12   │  │  HP Laptop   │  │  LG Fridge   │             │
│  │  ✅ Verified │  │  ✅ Verified │  │  ✅ Verified │             │
│  │  ₦185,000    │  │  ₦210,000    │  │  ₦95,000     │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                              [View All Products →]                  │
│                                                                     │
│  HOW KUBE WORKS                                                     │
│  [1. Browse] → [2. Pay Safely] → [3. We Test It] → [4. Delivered]  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  © 2026 Kube  |  About  |  Sell on Kube  |  Contact                │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 2 — Product Listing / Browse by Category

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]          Search products...  [🔍]         [Login] [Sign Up] │
├─────────────────────────────────────────────────────────────────────┤
│  Home › Phones & Tablets                                            │
│                                                                     │
│  ┌───────────────┐  ┌──────────────────────────────────────────┐   │
│  │  FILTER       │  │  Phones & Tablets          Sort: Newest ▾ │   │
│  │               │  ├──────────────────────────────────────────┤   │
│  │  Price Range  │  │  ┌────────────┐  ┌────────────┐          │   │
│  │  ₦ Min – Max  │  │  │  [img]     │  │  [img]     │          │   │
│  │  [====●====]  │  │  │ iPhone 12  │  │ Samsung S21│          │   │
│  │               │  │  │ ✅ Verified│  │ ✅ Verified│          │   │
│  │  Condition    │  │  │ ₦185,000   │  │ ₦145,000   │          │   │
│  │  ☐ Excellent  │  │  │ [Add Cart] │  │ [Add Cart] │          │   │
│  │  ☐ Good       │  │  └────────────┘  └────────────┘          │   │
│  │  ☐ Fair       │  │  ┌────────────┐  ┌────────────┐          │   │
│  │               │  │  │  [img]     │  │  [img]     │          │   │
│  │  Category     │  │  │ Tecno Pova │  │ iPhone 11  │          │   │
│  │  > Phones     │  │  │ ✅ Verified│  │ ✅ Verified│          │   │
│  │  > Tablets    │  │  │ ₦62,000    │  │ ₦155,000   │          │   │
│  │  > Acc.       │  │  │ [Add Cart] │  │ [Add Cart] │          │   │
│  │               │  │  └────────────┘  └────────────┘          │   │
│  │  [Apply]      │  │                                           │   │
│  └───────────────┘  │  ← 1  2  3  4  5 →                       │   │
│                     └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 3 — Product Detail Page

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]          Search...  [🔍]                   [Cart 🛒 2]      │
├─────────────────────────────────────────────────────────────────────┤
│  Home › Phones › iPhone 12 (64GB, Black)                           │
│                                                                     │
│  ┌─────────────────────────┐   ┌─────────────────────────────────┐ │
│  │                         │   │  iPhone 12 (64GB, Black)        │ │
│  │       [Main Image]      │   │  ✅ Kube Verified               │ │
│  │                         │   │                                 │ │
│  │  [img] [img] [img] [img]│   │  ₦185,000                       │ │
│  └─────────────────────────┘   │                                 │ │
│                                │  Condition:  ● Excellent        │ │
│                                │  In Stock:   3 units left       │ │
│                                │                                 │ │
│                                │  ┌─────────────────────────┐   │ │
│                                │  │  🔒 Safe Escrow Payment  │   │ │
│                                │  │  Pay now. We test it.    │   │ │
│                                │  │  Delivered to you.       │   │ │
│                                │  └─────────────────────────┘   │ │
│                                │                                 │ │
│                                │  [  Add to Cart  ] [Buy Now]   │ │
│                                └─────────────────────────────────┘ │
│                                                                     │
│  DESCRIPTION                                                        │
│  ──────────────────────────────────────────────────────────────     │
│  Good condition iPhone 12. Minor cosmetic scratches on the back.    │
│  Screen is perfect. Battery health 89%. Comes with charger.         │
│                                                                     │
│  QC INSPECTION REPORT                                               │
│  ──────────────────────────────────────────────────────────────     │
│  ✅ Screen: Pass   ✅ Battery: Pass   ✅ Buttons: Pass             │
│  ✅ Speakers: Pass  ⚠️ Back Glass: Minor scratch (noted)           │
│  Inspected by Kube QC — 14 Feb 2026                                │
│                                                                     │
│  Seller: Imported Gadgets NG  |  📍 Lagos                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 4 — Search Results

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]     [ fridge                        ] [🔍]    [Cart 🛒]    │
├─────────────────────────────────────────────────────────────────────┤
│  12 results for "fridge"                                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ┌───────┐  LG Double Door Fridge (200L)          ₦95,000    │  │
│  │  │ [img] │  ✅ Kube Verified  |  Condition: Good             │  │
│  │  └───────┘  In Stock: 1                         [Add Cart]   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  ┌───────┐  Samsung Side-by-Side Fridge (350L)   ₦195,000   │  │
│  │  │ [img] │  ✅ Kube Verified  |  Condition: Excellent        │  │
│  │  └───────┘  In Stock: 2                         [Add Cart]   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  ┌───────┐  Hisense Table Top Fridge (50L)        ₦32,000   │  │
│  │  │ [img] │  ✅ Kube Verified  |  Condition: Good             │  │
│  │  └───────┘  In Stock: 5                         [Add Cart]   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                         ← 1  2 →                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## AUTH SCREENS

---

### Screen 5 — Register / Login

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE LOGO]                                                        │
│                                                                     │
│           ┌───────────────────────────────────────┐                │
│           │          Create your account          │                │
│           │                                       │                │
│           │  Full Name                            │                │
│           │  [_________________________________]  │                │
│           │                                       │                │
│           │  Email Address                        │                │
│           │  [_________________________________]  │                │
│           │                                       │                │
│           │  Phone Number  (+234)                 │                │
│           │  [_________________________________]  │                │
│           │                                       │                │
│           │  Password                             │                │
│           │  [_________________________________]  │                │
│           │                                       │                │
│           │  [        Create Account         ]    │                │
│           │                                       │                │
│           │  Already have an account?  [Login]    │                │
│           │  Are you a seller?  [Apply to Sell]   │                │
│           └───────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6 — OTP Verification

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE LOGO]                                                        │
│                                                                     │
│           ┌───────────────────────────────────────┐                │
│           │       Verify your phone number        │                │
│           │                                       │                │
│           │  We sent a 6-digit code to            │                │
│           │  +234 902 043 3331                    │                │
│           │                                       │                │
│           │  [ _ ]  [ _ ]  [ _ ]  [ _ ]  [ _ ]  [ _ ]            │
│           │                                       │                │
│           │  [         Verify Code            ]   │                │
│           │                                       │                │
│           │  Didn't receive it?  Resend (0:45)    │                │
│           └───────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## BUYER SCREENS

---

### Screen 7 — Cart

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]                                       [Cart 🛒 2]           │
├─────────────────────────────────────────────────────────────────────┤
│  Your Cart (2 items)                                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ┌───────┐  iPhone 12 (64GB, Black)                          │  │
│  │  │ [img] │  ✅ Kube Verified                                 │  │
│  │  └───────┘  Qty: [1 ▾]    ₦185,000              [🗑 Remove]  │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  ┌───────┐  HP Laptop 840 G5 (Core i7)                       │  │
│  │  │ [img] │  ✅ Kube Verified                                 │  │
│  │  └───────┘  Qty: [1 ▾]    ₦210,000              [🗑 Remove]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│                    ┌─────────────────────────────┐                 │
│                    │  Subtotal         ₦395,000   │                 │
│                    │  Delivery fee     ₦3,500     │                 │
│                    │  ─────────────────────────   │                 │
│                    │  Total            ₦398,500   │                 │
│                    │                             │                 │
│                    │  [ Proceed to Checkout → ]  │                 │
│                    └─────────────────────────────┘                 │
│  [← Continue Shopping]                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 8 — Checkout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]                                                             │
├─────────────────────────────────────────────────────────────────────┤
│  Checkout                                                           │
│  ───────────────────────────────────────────────────────────────    │
│                                                                     │
│  ┌──────────────────────────────────┐  ┌───────────────────────┐   │
│  │  DELIVERY ADDRESS                │  │  ORDER SUMMARY        │   │
│  │                                  │  │                       │   │
│  │  Full Name                       │  │  iPhone 12      ₦185k │   │
│  │  [______________________________]│  │  HP Laptop      ₦210k │   │
│  │                                  │  │                       │   │
│  │  Phone Number                    │  │  Subtotal      ₦395k  │   │
│  │  [______________________________]│  │  Delivery       ₦3.5k │   │
│  │                                  │  │  ─────────────────    │   │
│  │  Street Address                  │  │  Total         ₦398.5k│   │
│  │  [______________________________]│  │                       │   │
│  │                                  │  │  🔒 Escrow Payment    │   │
│  │  City / LGA                      │  │  Your money is held   │   │
│  │  [______________________________]│  │  safely until you     │   │
│  │                                  │  │  confirm delivery.    │   │
│  │  State                           │  │                       │   │
│  │  [Lagos              ▾]          │  │  [ Pay ₦398,500 → ]   │   │
│  │                                  │  └───────────────────────┘   │
│  │  Additional notes (optional)     │                              │
│  │  [______________________________]│                              │
│  └──────────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 9 — Order Tracking

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]                                           [Hi, Emeka ▾]    │
├─────────────────────────────────────────────────────────────────────┤
│  Order #KUB-2026-00871                                              │
│  Placed 15 Feb 2026  ·  ₦398,500  ·  2 items                       │
│                                                                     │
│  ORDER STATUS                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ✅ Paid          15 Feb — Payment received and held safely   │  │
│  │  ✅ Seller Notif  15 Feb — Seller preparing your items       │  │
│  │  ✅ Shipped to QC 17 Feb — Items received at Kube warehouse  │  │
│  │  🔵 QC Testing   In progress — Our team is inspecting items  │  │
│  │  ○  Dispatched                                               │  │
│  │  ○  Delivered                                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ITEMS IN THIS ORDER                                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ┌───────┐  iPhone 12 (64GB, Black)        ₦185,000         │  │
│  │  │ [img] │  QC Status: In Inspection                        │  │
│  │  └───────┘                                                   │  │
│  │  ┌───────┐  HP Laptop 840 G5               ₦210,000         │  │
│  │  │ [img] │  QC Status: In Inspection                        │  │
│  │  └───────┘                                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Delivery Address: 12 Adeola Close, Lekki Phase 1, Lagos           │
│                                                        [Need Help?] │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 10 — Order History

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]                                           [Hi, Emeka ▾]    │
├─────────────────────────────────────────────────────────────────────┤
│  My Orders                                                          │
│                                                                     │
│  [All] [Active] [Delivered] [Returns]                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Order #KUB-2026-00871    15 Feb 2026    🔵 QC In Progress   │  │
│  │  iPhone 12 + HP Laptop · ₦398,500           [View Order →]  │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Order #KUB-2026-00654    02 Feb 2026    ✅ Delivered        │  │
│  │  LG Fridge (200L) · ₦95,000    [Confirm Receipt] [Return]   │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │  Order #KUB-2026-00412    19 Jan 2026    ✅ Completed        │  │
│  │  Samsung TV 43" · ₦130,000                  [View Order →]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 11 — Return Request Form

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE]                                           [Hi, Emeka ▾]    │
├─────────────────────────────────────────────────────────────────────┤
│  Request a Return — Order #KUB-2026-00654                           │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Item:  LG Fridge (200L)                                     │  │
│  │                                                              │  │
│  │  Reason for return                                           │  │
│  │  ○ Item arrived damaged                                      │  │
│  │  ○ Item not as described                                     │  │
│  │  ○ Wrong item delivered                                      │  │
│  │  ○ Item stopped working                                      │  │
│  │  ○ Other                                                     │  │
│  │                                                              │  │
│  │  Please describe the issue                                   │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │                                                        │ │  │
│  │  │                                                        │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  │                                                              │  │
│  │  Upload photos (optional)                                    │  │
│  │  [+ Add Photo]  [+ Add Photo]  [+ Add Photo]                │  │
│  │                                                              │  │
│  │  ⚠️ A slight logistics fee may apply for buyer-initiated    │  │
│  │  returns with no product fault.                             │  │
│  │                                                              │  │
│  │  [   Cancel   ]          [  Submit Return Request  ]        │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## SELLER PORTAL

---

### Screen 12 — Seller Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE Seller]                            [Imported Gadgets NG ▾]  │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Good morning, Femi 👋                               │
│  Products    │                                                      │
│  Orders      │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  Payouts     │  │  12      │  │  3       │  │  ₦840k   │          │
│  Settings    │  │ Products │  │ Pending  │  │ Pending  │          │
│              │  │ Listed   │  │ Orders   │  │ Payout   │          │
│              │  └──────────┘  └──────────┘  └──────────┘          │
│              │                                                      │
│              │  RECENT ORDERS                                       │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  #KUB-871  iPhone 12  ·  QC In Progress      │   │
│              │  │  15 Feb 2026     ₦185,000      [View →]      │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  #KUB-869  HP Laptop  ·  Awaiting Ship to QC │   │
│              │  │  14 Feb 2026     ₦210,000   [Mark Shipped →] │   │
│              │  └──────────────────────────────────────────────┘   │
│              │                                                      │
│              │  [+ Add New Product]                                 │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 13 — Add / Edit Product

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE Seller]                            [Imported Gadgets NG ▾]  │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Add New Product                                     │
│  Products    │  ──────────────────────────────────────────────      │
│  Orders      │                                                      │
│  Payouts     │  Product Title                                       │
│              │  [___________________________________________________]│
│              │                                                      │
│              │  Category                                            │
│              │  [Phones & Tablets                               ▾]  │
│              │                                                      │
│              │  Condition                                           │
│              │  ○ Excellent   ○ Good   ○ Fair                       │
│              │                                                      │
│              │  Price (₦)                                           │
│              │  [___________________________________________________]│
│              │                                                      │
│              │  Stock Quantity                                       │
│              │  [___________________________________________________]│
│              │                                                      │
│              │  Description                                         │
│              │  ┌─────────────────────────────────────────────────┐ │
│              │  │                                                 │ │
│              │  │                                                 │ │
│              │  └─────────────────────────────────────────────────┘ │
│              │                                                      │
│              │  Product Photos (min. 2, max. 8)                    │
│              │  [+ img] [+ img] [+ img] [+ img]                    │
│              │                                                      │
│              │  [Save Draft]              [Submit for Review]      │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 14 — Seller Orders

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE Seller]                            [Imported Gadgets NG ▾]  │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  My Orders                                          │
│  Products    │                                                      │
│  Orders ●    │  [All] [New] [Awaiting Ship] [At QC] [Completed]    │
│  Payouts     │                                                      │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  #KUB-869   HP Laptop 840 G5    14 Feb 2026  │   │
│              │  │  Buyer: Emeka O.     ₦210,000                │   │
│              │  │  Status: ⏳ Awaiting shipment to QC          │   │
│              │  │  Ship to: Kube QC Warehouse — Lagos Island   │   │
│              │  │                          [Mark as Shipped →] │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  #KUB-871   iPhone 12 (64GB)     15 Feb 2026 │   │
│              │  │  Buyer: Emeka O.     ₦185,000                │   │
│              │  │  Status: 🔵 At QC — Being inspected          │   │
│              │  │                                  [View →]    │   │
│              │  └──────────────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 15 — Payout Status

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE Seller]                            [Imported Gadgets NG ▾]  │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Payout Status                                       │
│  Products    │                                                      │
│  Orders      │  ┌──────────────┐  ┌──────────────┐                 │
│  Payouts ●   │  │   ₦840,000   │  │  ₦1,350,000  │                 │
│              │  │  Pending     │  │  Total Paid  │                 │
│              │  │  Release     │  │  Out         │                 │
│              │  └──────────────┘  └──────────────┘                 │
│              │                                                      │
│              │  PAYOUT HISTORY                                      │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  Order #KUB-654  LG Fridge    02 Feb 2026    │   │
│              │  │  Gross: ₦95,000  Commission: ₦9,500          │   │
│              │  │  Net Payout: ₦85,500    Status: ✅ Paid      │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  Order #KUB-412  Samsung TV   20 Jan 2026    │   │
│              │  │  Gross: ₦130,000  Commission: ₦13,000        │   │
│              │  │  Net Payout: ₦117,000   Status: ✅ Paid      │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  Order #KUB-871  iPhone 12    15 Feb 2026    │   │
│              │  │  Gross: ₦185,000                             │   │
│              │  │  Net Payout: —      Status: ⏳ Awaiting QC  │   │
│              │  └──────────────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## QC OFFICER PORTAL

---

### Screen 16 — QC Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE QC]                                    [Chukwudi A. — QC ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  QC Dashboard — Kube Lagos Island Warehouse         │
│  Inspections │                                                      │
│  Settings    │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│              │  │  8       │  │  3       │  │  1       │          │
│              │  │ Pending  │  │ In Prog. │  │ Awaiting │          │
│              │  │ Items    │  │          │  │ Reship   │          │
│              │  └──────────┘  └──────────┘  └──────────┘          │
│              │                                                      │
│              │  ITEMS TO INSPECT                                    │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  #INS-0094  iPhone 12 (64GB, Black)          │   │
│              │  │  Order #KUB-871  ·  Received: 17 Feb 2026    │   │
│              │  │  Seller: Imported Gadgets NG                 │   │
│              │  │  Status: ⏳ Pending             [Inspect →]  │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  #INS-0093  HP Laptop 840 G5                 │   │
│              │  │  Order #KUB-869  ·  Received: 16 Feb 2026    │   │
│              │  │  Seller: Imported Gadgets NG                 │   │
│              │  │  Status: 🔵 In Progress         [Continue →] │   │
│              │  └──────────────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 17 — Inspection Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE QC]                                    [Chukwudi A. — QC ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Inspection #INS-0094 — iPhone 12 (64GB, Black)     │
│  Inspections │  Order #KUB-871  ·  Seller: Imported Gadgets NG     │
│              │  ──────────────────────────────────────────────      │
│              │                                                      │
│              │  INSPECTION CHECKLIST                                │
│              │  ┌────────────────────────────────────────────┐     │
│              │  │  Screen condition        ○ Pass  ○ Fail    │     │
│              │  │  Battery health          ○ Pass  ○ Fail    │     │
│              │  │  All buttons functional  ○ Pass  ○ Fail    │     │
│              │  │  Speakers / mic          ○ Pass  ○ Fail    │     │
│              │  │  Cameras (front + back)  ○ Pass  ○ Fail    │     │
│              │  │  Charging port           ○ Pass  ○ Fail    │     │
│              │  │  Back / casing           ○ Pass  ○ Fail    │     │
│              │  └────────────────────────────────────────────┘     │
│              │                                                      │
│              │  Inspection Notes                                    │
│              │  [_______________________________________________]   │
│              │                                                      │
│              │  Repair Details (if needed)                          │
│              │  [_______________________________________________]   │
│              │                                                      │
│              │  [  Fail Item  ] [  Log Repair  ] [  ✅ Pass Item  ]│
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## DELIVERY OFFICER PORTAL

---

### Screen 18 — Delivery Assignments

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE Delivery]                                [Tunde B. — Del ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Assignments │  My Deliveries                                       │
│  Returns     │                                                      │
│              │  [Active] [Completed] [Return Pickups]               │
│              │                                                      │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  #SHP-0041  Order #KUB-412                   │   │
│              │  │  Deliver to: Adaeze N.                       │   │
│              │  │  45 Ogunlana Drive, Surulere, Lagos          │   │
│              │  │  Phone: 0802 xxx xxxx                        │   │
│              │  │  Items: Samsung TV 43" (1 item)              │   │
│              │  │  Status: ✅ Picked Up                        │   │
│              │  │  OTP required on delivery                    │   │
│              │  │                  [Mark as Delivered →]       │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  #SHP-0039  Order #KUB-380                   │   │
│              │  │  Deliver to: Bola K.                         │   │
│              │  │  7 Admiralty Way, Lekki, Lagos               │   │
│              │  │  Status: ⏳ Ready for Pickup                 │   │
│              │  │                  [Confirm Pickup →]          │   │
│              │  └──────────────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## ADMIN PANEL

---

### Screen 19 — Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE ADMIN]                                      [Super Admin ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Overview — February 2026                           │
│  Sellers     │                                                      │
│  Products    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  Orders      │  │  ₦4.2M   │ │  38      │ │  5       │ │  2     │  │
│  Disputes    │  │ Revenue  │ │ Orders   │ │ Pending  │ │ Open   │  │
│  Reports     │  │ This Mo. │ │ Active   │ │ Payouts  │ │Disputes│  │
│              │  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│              │                                                      │
│              │  ACTIONS REQUIRED                                    │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  🔴  2 new seller applications awaiting      │   │
│              │  │      approval                    [Review →]  │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  🟡  5 payments awaiting escrow release      │   │
│              │  │      (buyer confirmed receipt)   [Review →]  │   │
│              │  ├──────────────────────────────────────────────┤   │
│              │  │  🔴  2 open disputes to resolve  [Review →]  │   │
│              │  └──────────────────────────────────────────────┘   │
│              │                                                      │
│              │  RECENT ORDERS                  [View All Orders →] │
│              │  #KUB-871 · QC In Progress · ₦398,500              │
│              │  #KUB-869 · Awaiting QC Ship · ₦210,000            │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 20 — Admin Seller Approvals

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE ADMIN]                                      [Super Admin ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Seller Applications                                 │
│  Sellers ●   │                                                      │
│  Products    │  [Pending (2)] [Approved] [Rejected]                 │
│  Orders      │                                                      │
│  Disputes    │  ┌──────────────────────────────────────────────┐   │
│  Reports     │  │  Global Tech Imports Ltd                     │   │
│              │  │  Contact: Biodun F. · +234 812 xxx xxxx      │   │
│              │  │  Applied: 18 Feb 2026                        │   │
│              │  │  Business Type: Electronics importer         │   │
│              │  │  CAC No: RC1084723                           │   │
│              │  │  Bank: GTB · 0123456789                      │   │
│              │  │                                              │   │
│              │  │  [ View Full Application ]                   │   │
│              │  │  [    Reject ✕    ]   [    Approve ✓    ]   │   │
│              │  └──────────────────────────────────────────────┘   │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  Lagos Used Goods Co.                        │   │
│              │  │  Contact: Amaka P. · +234 803 xxx xxxx       │   │
│              │  │  Applied: 17 Feb 2026                        │   │
│              │  │  [ View Full Application ]                   │   │
│              │  │  [    Reject ✕    ]   [    Approve ✓    ]   │   │
│              │  └──────────────────────────────────────────────┘   │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 21 — Admin Order Management

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE ADMIN]                                      [Super Admin ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  All Orders                                         │
│  Sellers     │                                                      │
│  Products    │  Search orders...  [🔍]        Filter: [All ▾]      │
│  Orders ●    │                                                      │
│  Disputes    │  ┌──────────────────────────────────────────────────┐│
│  Reports     │  │ Order      │ Buyer    │ Amount   │ Status   │    ││
│              │  ├────────────┼──────────┼──────────┼──────────┤    ││
│              │  │ #KUB-871   │ Emeka O. │ ₦398,500 │ 🔵 QC   │[→] ││
│              │  │ #KUB-869   │ Emeka O. │ ₦210,000 │ ⏳ Ship  │[→] ││
│              │  │ #KUB-654   │ Bola K.  │ ₦95,000  │ ⏳ Await │[→] ││
│              │  │            │          │          │  Release │    ││
│              │  │ #KUB-412   │ Adaeze N.│ ₦130,000 │ ✅ Done  │[→] ││
│              │  └──────────────────────────────────────────────────┘│
│              │                        ← 1  2  3  →                 │
└──────────────┴──────────────────────────────────────────────────────┘
```

---

### Screen 22 — Admin Dispute Resolution

```
┌─────────────────────────────────────────────────────────────────────┐
│  [KUBE ADMIN]                                      [Super Admin ▾] │
├──────────────┬──────────────────────────────────────────────────────┤
│  Dashboard   │  Dispute — Return #RET-0021                         │
│  Sellers     │  Order #KUB-654  ·  Buyer: Bola K.  ·  18 Feb 2026 │
│  Products    │  ──────────────────────────────────────────────      │
│  Orders      │                                                      │
│  Disputes ●  │  ISSUE: "Fridge is making a loud noise, not         │
│  Reports     │   mentioned in listing. Requires repair."           │
│              │                                                      │
│              │  ITEM: LG Double Door Fridge (200L)  ·  ₦95,000    │
│              │  QC Report: Passed on 14 Feb 2026                   │
│              │  Delivery Confirmed: 16 Feb 2026                    │
│              │                                                      │
│              │  RESOLUTION OPTIONS                                  │
│              │  ┌──────────────────────────────────────────────┐   │
│              │  │  ○ Repair — Schedule pickup, repair, reship  │   │
│              │  │  ○ Replace — Send replacement unit           │   │
│              │  │  ○ Refund — Process refund                   │   │
│              │  │     Logistics deduction (₦):  [________]    │   │
│              │  │     Net refund: ₦ ______                     │   │
│              │  └──────────────────────────────────────────────┘   │
│              │                                                      │
│              │  Admin Notes                                         │
│              │  [_______________________________________________]   │
│              │                                                      │
│              │  [  Assign Delivery for Pickup  ]  [Confirm Resolution]│
└──────────────┴──────────────────────────────────────────────────────┘
```

---

## Navigation Summary

| Portal | Access URL (planned) | Users |
|--------|---------------------|-------|
| Public storefront | `/` | Everyone |
| Buyer account | `/account` | Buyers |
| Seller portal | `/seller` | Approved sellers |
| QC portal | `/qc` | QC Officers |
| Delivery portal | `/delivery` | Delivery Officers |
| Admin panel | `/admin` | Admin only |
