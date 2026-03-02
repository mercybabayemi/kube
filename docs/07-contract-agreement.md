# SOFTWARE DEVELOPMENT AGREEMENT
## Kube Marketplace Platform

---

**Agreement Date:** ___________________

**Between:**

**Client:**
Full Name: Adebayo ___________________
Phone: +234 813 946 1192
Email: ___________________

**And:**

**Developer:**
Full Name: Babayemi Mercy Janet
Phone: +2349020433331
Email: mercy@semicolon.africa
---

## 1. PROJECT DESCRIPTION

The Client engages the Developer to design, develop, and deliver a web-based e-commerce platform called **"Kube"** — a marketplace for verified used goods in Nigeria.

The platform enables buyers to purchase tested, quality-assured second-hand goods from curated sellers. Kube manages escrow payments, quality control inspection, and last-mile delivery.

---

## 2. SCOPE OF WORK

### 2.1 MVP Features Included (Phase 1)

The following modules are included in this agreement:

| # | Module | Description |
|---|--------|-------------|
| 1 | Authentication | Registration, login, OTP verification, password reset — for all user roles |
| 2 | Product Catalog | Product listing pages, category browsing, search, product detail page |
| 3 | Shopping Cart & Checkout | Cart management, delivery address, order initiation |
| 4 | Payments (Escrow) | Integration with Paystack or Monnify; funds held until delivery confirmed |
| 5 | Order Management | Order lifecycle tracking (Paid → QC → Shipped → Delivered) |
| 6 | Seller Portal | Seller application, product listing, order view, payout status |
| 7 | QC Workflow Dashboard | Internal tool for QC officers to manage inspections, pass/fail/repair items |
| 8 | Delivery Management | Delivery officer assignments, status updates, delivery OTP confirmation |
| 9 | Admin Panel | Full management dashboard — sellers, products, orders, disputes, reports |
| 10 | Returns & Refunds | Return request flow; admin-managed resolution (repair, replace, refund) |
| 11 | Database Design | Full relational database schema |
| 12 | Deployment | Initial deployment to a live hosting environment (VPS or cloud) |

### 2.2 Explicitly NOT Included (Phase 1)

- Mobile app (iOS or Android)
- Seller subscription billing system
- Automated logistics API integration (e.g., Sendbox, GIG)
- Automated payout scheduling (payouts are manually triggered by admin at MVP)
- Email / SMS notification automation (basic notifications only)
- Product wishlist
- Referral or promo code engine
- Advanced analytics or BI dashboards

Any feature not listed in Section 2.1 constitutes a **change request** and is subject to additional scoping and cost (see Section 7).

---

## 3. DELIVERABLES

| Deliverable | Description |
|-------------|-------------|
| Source Code | Full codebase, version-controlled on GitHub (private repository) |
| Database Schema | Documented schema with migrations |
| API Documentation | Endpoint documentation (Postman collection or equivalent) |
| Deployed Application | Live URL accessible by Client and users |
| Admin Credentials | Initial admin login for Client |
| Project Documents | Requirements doc, diagrams, this agreement |

---

## 4. MILESTONES & PAYMENT SCHEDULE

### 4.1 Total Project Fee

**Total Amount: ₦1,200,000 (One Million Two Hundred Thousand Naira only)**

### 4.2 Payment Schedule

| Payment | Trigger | % of Total | Amount (₦) |
|---------|---------|------------|------------|
| **P1 — Commitment Fee + Phase 1** | Upon signing this agreement | **40%** | ₦480,000 |
| **P2 — Phase 2 Delivery** | Delivery of working modules (Payments, Orders, Seller Portal, QC, Delivery, Admin) | **40%** | ₦480,000 |
| **P3 — Final Delivery + Deployment** | Live deployment + handover | **20%** | ₦240,000 |
| **TOTAL** | | **100%** | ₦1,200,000 |

### 4.3 Payment Deliverables Breakdown

What the Client receives at each payment:

**P1 — Commitment Fee + Phase 1 (₦480,000)**
- User registration and login for all roles (Buyer, Seller, QC Officer, Delivery Officer, Admin)
- OTP verification via SMS for phone-based registration
- Password reset flow
- Product browsing by category (paginated)
- Product detail page (images, description, condition, price, stock status)
- Basic keyword search
- Shopping cart (add, update, remove items)
- Delivery address entry at checkout

**P2 — Phase 2 Delivery (₦480,000)**
- Payment integration with Paystack or Monnify
- Escrow logic: funds held in Kube's account until delivery is confirmed
- Order creation and full lifecycle tracking (Paid → QC → Shipped → Delivered)
- Order history and status page for buyers
- Commission deduction (admin-configurable percentage per category)
- Refund trigger (admin-initiated)
- Seller application and onboarding form (admin approval workflow)
- Seller dashboard: add/edit product listings, view incoming orders, mark goods shipped to QC warehouse, view payout status
- QC officer dashboard: view items assigned per order, update inspection status (Pass / Fail / Repair Needed), add inspection notes, mark item ready for shipping, flag items for replacement or return
- Delivery officer dashboard: view assigned deliveries, update delivery status (Picked Up / En Route / Delivered), confirm delivery via buyer OTP
- Admin panel: seller approval/rejection, product listing management, all-orders view, dispute and refund handling, manual escrow release/hold, basic sales and revenue report
- Returns and refund request flow (buyer submission, admin resolution)

**P3 — Final Delivery + Deployment (₦240,000)**
- Production deployment to live hosting environment (accessible URL)
- Full environment configuration (.env, secrets management)
- API documentation (Postman collection)
- Initial admin login credentials handed over to Client
- Full source code on private GitHub repository
- All planning and design documents
- 30-day post-delivery warranty period commences

### 4.4 Payment Terms

- First payment (P1) is **non-refundable** once work has commenced.
- Each subsequent payment is due within **5 business days** of the Developer notifying the Client that the respective phase has been completed and is ready for review.
- If a payment is delayed beyond 5 business days, the Developer reserves the right to pause work until payment is received.
- Payments shall be made via bank transfer to the Developer's account:
  - **Bank Name:** Guaranty Trust Bank (GTB)
  - **Account Number:** 0227514639
  - **Account Name:** Babayemi Mercy Janet

---

## 5. TIMELINE

- **Estimated project duration:** 4–5 weeks from the date the first payment (P1) is received.
- Timeline assumes timely feedback and approvals from the Client at each payment phase.
- Delays caused by the Client (feedback not given within 3 business days of request) will extend the timeline accordingly and are not the Developer's responsibility.
- Timeline does not commence until the first payment is received.

---

## 6. REVISION POLICY

- **Each payment phase includes up to 2 rounds of revisions** for features delivered in that phase.
- A revision is defined as a change to agreed features — it is **not** a new feature request.
- Revisions must be communicated in writing (WhatsApp or email) within **5 business days** of the Developer's delivery notification.
- Revisions requested after the 5-day window, or after the next phase has commenced, will be treated as change requests (see Section 7).

---

## 7. CHANGE REQUESTS

- Any feature or change **not listed in Section 2.1** is a change request.
- Change requests must be submitted in writing.
- The Developer will provide a quote (cost and timeline impact) within 3 business days.
- Work on a change request does not begin until the Client approves the quote in writing and pays any required upfront amount.

---

## 8. INTELLECTUAL PROPERTY

- Upon receipt of **full and final payment**, all intellectual property rights to the custom code, design, and database schema created specifically for this project transfer to the Client.
- **Before full payment is received**, the Developer retains all rights to the codebase.
- The Developer reserves the right to include the project in their portfolio (using screenshots and general description, not the full source code) unless the Client requests otherwise in writing.
- Third-party libraries, frameworks, and tools remain subject to their respective open-source licenses.

---

## 9. CONFIDENTIALITY

- Both parties agree to keep all project-related information, business logic, and user data confidential.
- The Developer will not share, sell, or disclose the Client's business information, database content, or any proprietary processes to third parties.
- This obligation survives termination of this agreement for a period of **2 years**.

---

## 10. WARRANTIES & LIMITATIONS

- The Developer warrants that the delivered software will function as described in the agreed scope for a period of **30 days** after final delivery (warranty period).
- During the warranty period, the Developer will fix bugs in agreed features at no additional cost.
- The Developer does **not** warrant against issues caused by third-party services (payment gateway downtime, hosting issues), Client modifications to the code, or misuse.
- The Developer's total liability under this agreement shall not exceed the total amount paid by the Client.

---

## 11. TERMINATION

### 11.1 Termination by Client

- The Client may terminate this agreement at any time with written notice.
- Work completed up to the point of termination will be charged at the agreed milestone rates.
- The first payment (P1) and any subsequent payments already made are **non-refundable**.
- Partial milestones in progress at the time of termination will be prorated based on work done.

### 11.2 Termination by Developer

- The Developer may terminate this agreement if:
  - Payment is overdue by more than 10 business days after notification.
  - The Client engages in abusive, threatening, or unprofessional conduct.
- Upon termination by the Developer, completed work will be delivered to the Client upon receipt of all outstanding payments.

---

## 12. COMMUNICATION

- Primary communication channel: **WhatsApp**
- Formal requests (change requests, milestone sign-offs) should be confirmed in writing (WhatsApp message or email)
- The Developer will provide status updates at least once a week
- The Client agrees to respond to queries from the Developer within **3 business days**

---

## 13. GOVERNING LAW

This agreement is governed by the laws of the **Federal Republic of Nigeria**. Any disputes arising from this agreement will first be resolved through good-faith negotiation. If unresolved, disputes will be submitted to arbitration in Lagos, Nigeria.

---

## 15. SIGNATURES

By signing below, both parties agree to the terms of this agreement.

**CLIENT:**

Signature: ___________________________

Full Name: ___________________________

Date: ___________________________

---

**DEVELOPER:**

Signature: ___________________________

Full Name: Babayemi Mercy Janet

Date: 22nd February, 2026

---

*Note: Both parties should retain a signed copy of this agreement.*
