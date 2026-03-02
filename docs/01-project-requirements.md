# Kube — Project Requirements Document

**Version:** 1.0
**Date:** 2026-02-20
**Client:** Adebayo (via Cynthia)
**Developer:** A Girl Who Codes (Babayemi Mercy)
**Status:** Discovery Complete — MVP Scoping

---

## 1. Project Overview

**Kube** is a Nigerian e-commerce platform for **verified used goods**. It combines:

| Platform     | Concept borrowed                         |
|--------------|------------------------------------------|
| Jiji         | Price discovery, used goods marketplace  |
| Facebook Marketplace | Browse, check price, buy         |
| Jumia        | Full e-commerce experience (not just listing) |

**Key difference:** Kube does NOT allow buyer-seller meetups. All transactions happen on the platform. Kube holds payment in **escrow**, physically tests goods at its **QC unit**, then ships to the buyer.

---

## 2. Problem Statement

Nigerians buying used goods online face:
- **Untrusted sellers** — no accountability
- **Online scams** — payment with no delivery or wrong goods
- **Quality uncertainty** — used items sold "as-is" with no assurance
- **No recourse** — if goods are faulty, no return/refund mechanism

**Kube's solution:** Every item is physically tested by Kube before reaching the buyer. Payment is held in escrow until the buyer confirms satisfaction.

---

## 3. Business Model

| Revenue Stream       | Detail                                               |
|----------------------|------------------------------------------------------|
| Commission per sale  | Percentage deducted from seller payout               |
| Seller subscription  | Activated as the platform scales                     |
| Logistics margin     | Kube handles delivery (can include a service margin) |

---

## 4. Key Stakeholders / Actors

| Actor             | Description                                                    |
|-------------------|----------------------------------------------------------------|
| **Buyer/Customer**| Primary end-user. Browses, purchases, tracks orders            |
| **Seller/Supplier**| Curated importers/vendors. Not open registration — admin-approved |
| **QC Officer**    | Kube internal staff who test, repair, or reject goods          |
| **Admin (Kube)**  | Platform managers — approve sellers, resolve disputes, release payments |
| **Delivery Officer**| Kube's logistics team — picks up from warehouse, delivers to buyer |
| **Payment Gateway**| External system (Paystack/Flutterwave) — handles escrow holding |

---

## 5. Functional Requirements

### 5.1 Buyer

- FR-B01: Register and log in (email/phone + password)
- FR-B02: Browse products by category
- FR-B03: Search and filter products (price, condition, category)
- FR-B04: View product detail with images, description, condition, seller info
- FR-B05: Add items to cart
- FR-B06: Checkout with delivery address
- FR-B07: Make payment via escrow (Paystack/Flutterwave)
- FR-B08: Track order status in real time
- FR-B09: Confirm receipt of goods
- FR-B10: Request return or refund
- FR-B11: Leave a product review/rating

### 5.2 Seller

- FR-S01: Apply to become a seller (admin must approve)
- FR-S02: List products with photos, description, price, quantity
- FR-S03: Manage inventory (update stock, mark sold out)
- FR-S04: View incoming orders
- FR-S05: Ship goods to assigned Kube QC warehouse on order confirmation
- FR-S06: View payout history (paid after buyer satisfaction confirmed)

### 5.3 QC Officer

- FR-Q01: Receive items assigned from orders
- FR-Q02: Inspect and test items (pass/fail/repair needed)
- FR-Q03: Update QC status on the system
- FR-Q04: Flag items that need repair — log repair details
- FR-Q05: Mark items as ready for shipping after passing QC
- FR-Q06: Mark items for replacement or return to seller if irreparable

### 5.4 Admin

- FR-A01: Approve or reject seller applications
- FR-A02: Manage all users (buyers, sellers, officers)
- FR-A03: Manage product listings (approve, hide, remove)
- FR-A04: View and manage all orders
- FR-A05: Handle disputes (buyer complaints, refund requests)
- FR-A06: Release escrow payment to seller after confirmation
- FR-A07: Generate sales and operational reports
- FR-A08: Assign QC officers to warehouses

### 5.5 Delivery Officer

- FR-D01: View delivery assignments
- FR-D02: Pick up from QC warehouse after goods pass inspection
- FR-D03: Update delivery status (en route, delivered)
- FR-D04: Confirm delivery (with photo proof or OTP)
- FR-D05: Handle return pickups from buyers

---

## 6. Non-Functional Requirements

| Category       | Requirement                                                    |
|----------------|----------------------------------------------------------------|
| **Security**   | All payments via PCI-compliant gateway; HTTPS everywhere; JWT auth |
| **Performance**| Product listing page < 2s load time; handles 1,000 concurrent users at MVP |
| **Availability**| 99.5% uptime target                                          |
| **Scalability**| Stateless backend; horizontally scalable                      |
| **Mobile-first**| Responsive design; large portion of Nigerian traffic is mobile |
| **Localization**| Nigerian Naira (NGN) as default currency; local phone formats |
| **Compliance** | NDPR (Nigerian Data Protection Regulation) compliance          |

---

## 7. Business Rules

- BR-01: No buyer can meet a seller directly — all orders fulfilled through Kube
- BR-02: Payment is held in escrow until buyer confirms receipt and satisfaction
- BR-03: Seller payout is released only after QC pass + delivery + buyer confirmation
- BR-04: Payout takes a defined number of days after purchase (e.g., 5–7 business days)
- BR-05: A slight logistics deduction applies to refunds (not to returns that are Kube's fault)
- BR-06: Goods sold out = sold out; no "coming soon" or waitlist at MVP
- BR-07: Only admin-approved sellers can list on the platform
- BR-08: All items must pass QC before being shipped to buyer
- BR-09: Failed QC items → repair → re-test → ship, OR replace, OR refund (seller bears cost)
- BR-10: Commission percentage to be defined by admin per category

---

## 8. Return & Refund Policy (as defined by client)

| Scenario                                | Resolution                                                  |
|-----------------------------------------|-------------------------------------------------------------|
| Item arrives with issues (physical)     | Kube picks up → tests → repairs → returns to buyer          |
| Item not repairable                     | Replacement sent OR full refund minus logistics             |
| Customer requests refund (no fault)     | Refund processed after inspection, slight logistics deduction |
| Item passed QC but buyer dissatisfied   | Handled per dispute resolution process                      |

---

## 9. Goods & Logistics

- **Goods type:** Mixed (imported used goods + Nigerian used goods)
- **Sellers:** Curated; currently 3 external importers + Kube itself (4 total at launch)
- **Storage:** Sellers hold stock until order is confirmed, then ship to Kube QC unit
- **Warehouses:** Kube operates QC units across major cities
- **Delivery:** Kube owns/manages last-mile delivery

---

## 10. Timeline (Client's expectation)

- MVP target: **4–5 weeks** (aligned with container arrivals & QC unit setup)
- Approach: **Phased MVP** — core buyer/seller/QC flow first, then scale

---

## 11. Budget

- **Client's answer:** TBD by Developer
- Developer's approach: Feature-based pricing, milestone payments, commitment fee upfront
- See `06-contract-agreement.md` for payment structure
