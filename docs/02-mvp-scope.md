# Kube — MVP Scope Definition

**Version:** 1.0
**Date:** 2026-02-20

---

## Phase 1 — MVP (Core Loop)

The MVP must validate one complete transaction: a buyer finds an item, pays, Kube verifies it, delivers it, and the seller gets paid. Everything else is secondary to this loop working end-to-end.

### Included in MVP

#### Buyer Features
- [ ] Register / Login (email or phone + password; OTP for phone)
- [ ] Browse products (by category, paginated)
- [ ] Product detail page (images, description, condition, price, stock)
- [ ] Search (basic keyword search)
- [ ] Shopping cart
- [ ] Checkout with delivery address entry
- [ ] Pay via Paystack/Flutterwave (escrow-style — held until delivery confirmed)
- [ ] Order history & status tracking (simple status labels: Paid → QC → Shipped → Delivered)
- [ ] Confirm receipt (triggers seller payout timer)
- [ ] Request return / refund (form submission; admin handles resolution)

#### Seller Features
- [ ] Seller application form (admin approves manually)
- [ ] Login (separate seller dashboard)
- [ ] Add/edit product listing (photos, title, description, category, price, quantity)
- [ ] View orders assigned to them
- [ ] Mark "shipped to QC warehouse"
- [ ] View payout status

#### Admin Features
- [ ] Admin dashboard (overview: orders, revenue, pending actions)
- [ ] Approve/reject seller applications
- [ ] Product listing management (approve, remove, edit)
- [ ] Order management (view all orders, statuses)
- [ ] Dispute management (view return/refund requests, update resolution)
- [ ] Manually release/hold escrow payments
- [ ] Basic sales report (total orders, revenue, pending payouts)

#### QC Officer Features
- [ ] View items assigned for inspection (per order)
- [ ] Update inspection status (pass / fail / repair needed)
- [ ] Add inspection notes
- [ ] Mark item ready for shipping

#### Delivery Features
- [ ] View delivery assignments
- [ ] Update delivery status (Picked Up, En Route, Delivered)
- [ ] Confirm delivery (manual entry — OTP from buyer)

#### Payments
- [ ] Paystack/Flutterwave payment integration
- [ ] Escrow logic (payment held, released on confirmation)
- [ ] Refund trigger via admin
- [ ] Commission deduction (fixed % per transaction, configured in admin)

---

### Explicitly OUT of Scope for MVP

| Feature                          | Why deferred                                      |
|----------------------------------|---------------------------------------------------|
| Seller subscription billing      | Not needed at launch with only 4 sellers          |
| Real-time chat (buyer-seller)    | Not applicable — no direct buyer-seller contact   |
| Mobile app (iOS/Android)         | Web-first; mobile-responsive                      |
| Advanced search / filters        | Basic search is enough for MVP product count      |
| Product wishlist                 | Nice-to-have; not critical to first purchase      |
| Seller ratings & reviews         | Reviews added in Phase 2                          |
| Automated payout scheduling      | Manual release via admin at MVP                   |
| Logistics API integration        | Manual delivery management at MVP                 |
| Multi-currency                   | NGN only                                          |
| Referral / promo codes           | Phase 2 growth feature                            |
| Email/SMS automated notifications| Phase 2 — manual WhatsApp comms at MVP is okay   |

---

## Phase 2 — Post-MVP Growth

- Automated escrow release (timer-based after delivery confirmation)
- SMS/email notifications at each order status change
- Seller subscription tiers
- Product reviews and ratings
- Wishlist / saved items
- Discount/promo code engine
- Logistics partner API integration (Sendbox, GIG, etc.)
- Automated payout to seller bank accounts (via Paystack Transfer API)
- Mobile app (React Native or PWA)
- Advanced analytics dashboard

## Phase 3 — Scale

- Open seller registration (with stricter KYC)
- Auction/bidding for premium used items
- Buyer loyalty / points system
- Multi-warehouse routing optimization
- Machine learning for fraud detection

---

## MVP Feature Summary (for contract scope)

| Module          | Features                              | Priority |
|-----------------|---------------------------------------|----------|
| Auth            | Register, login, OTP                  | P0       |
| Product Catalog | Listing, detail, search, categories   | P0       |
| Cart & Checkout | Cart, address, checkout               | P0       |
| Payments        | Paystack integration, escrow logic    | P0       |
| Order Management| Status tracking, history              | P0       |
| QC Workflow     | Inspection dashboard, status updates  | P0       |
| Delivery        | Assignment, status updates, confirm   | P0       |
| Seller Portal   | Onboarding, listings, orders, payouts | P0       |
| Admin Panel     | Full management dashboard             | P0       |
| Returns/Refunds | Request form, admin resolution        | P0       |

---

## Timeline

- **MVP delivery target:** 4–5 weeks from receipt of first payment (P1)
- Timeline assumes timely feedback and approvals from the Client at each phase
- Delays caused by the Client will extend the timeline accordingly
