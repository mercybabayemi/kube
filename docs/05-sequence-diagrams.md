# Kube — Sequence Diagrams

Render with any Mermaid-compatible tool.

---

## Sequence 1: Successful Purchase Flow

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    participant WebApp as Kube Web App
    participant API as Backend API
    participant PayGW as Payment Gateway<br/>(Paystack or Monnify)
    participant DB as Database
    actor Seller
    actor QCOfficer as QC Officer
    actor Delivery as Delivery Officer

    Buyer->>WebApp: Browse products & add to cart
    Buyer->>WebApp: Proceed to checkout
    WebApp->>API: POST /orders/initiate {cartId, deliveryAddress}
    API->>DB: Create Order (status: PENDING)
    API-->>WebApp: Return orderId + payment reference

    Buyer->>WebApp: Click "Pay Now"
    WebApp->>PayGW: Redirect to payment page
    Buyer->>PayGW: Enter card/bank details & confirm
    PayGW->>API: Webhook: payment_success {reference, amount}
    API->>DB: Update Payment (status: HELD)
    API->>DB: Update Order (status: PAID)
    API->>DB: Notify Seller (new order)
    API-->>Buyer: Order confirmation + order tracking page

    Note over Seller,API: Seller is notified of new order
    Seller->>API: View order details
    Seller->>API: PATCH /orders/{id}/ship-to-qc
    API->>DB: Update Order (status: SHIPPED_TO_QC)

    Note over QCOfficer,API: QC Officer receives item at warehouse
    QCOfficer->>API: GET /qc/assignments
    API-->>QCOfficer: List of items pending inspection
    QCOfficer->>API: PATCH /qc/{inspectionId}/start
    API->>DB: Update QCInspection (status: IN_PROGRESS)

    QCOfficer->>API: PATCH /qc/{inspectionId}/pass
    API->>DB: Update QCInspection (status: PASSED)
    API->>DB: Update Order (status: QC_PASSED)

    QCOfficer->>API: PATCH /qc/{inspectionId}/ready
    API->>DB: Update Order (status: DISPATCHED)
    API->>DB: Create Shipment record

    Delivery->>API: GET /deliveries/assignments
    Delivery->>API: PATCH /shipments/{id}/pickup
    API->>DB: Update Shipment (status: EN_ROUTE)

    Delivery->>API: PATCH /shipments/{id}/delivered {otp}
    API->>DB: Update Shipment (status: DELIVERED)
    API->>DB: Update Order (status: DELIVERED)
    API-->>Buyer: Notification: "Your item has been delivered"

    Buyer->>API: PATCH /orders/{id}/confirm-receipt
    API->>DB: Update Order (status: CONFIRMED)
    API->>DB: Update Payment (status: AWAITING_RELEASE)
    API->>DB: Notify Admin — buyer confirmed receipt

    Note over Admin,PayGW: Admin manually reviews and releases escrow (MVP)
    Admin->>API: PATCH /admin/payments/{id}/release
    API->>DB: Deduct commission from payout amount
    API->>PayGW: Trigger transfer to Seller bank account
    PayGW-->>API: Transfer success
    API->>DB: Update Payment (status: RELEASED)
```

---

## Sequence 2: QC Failure → Repair → Reship

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    participant API as Backend API
    participant DB as Database
    actor QCOfficer as QC Officer
    actor Seller
    actor Delivery as Delivery Officer

    Note over QCOfficer: Item received at QC warehouse
    QCOfficer->>API: PATCH /qc/{inspectionId}/fail {notes}
    API->>DB: Update QCInspection (status: FAILED)
    API->>DB: Update Order (status: QC_FAILED)
    API->>DB: Notify Admin of failure

    QCOfficer->>API: PATCH /qc/{inspectionId}/repair {repairDetails}
    API->>DB: Update QCInspection (status: REPAIR_IN_PROGRESS)
    API->>DB: Update Order (status: REPAIR_IN_PROGRESS)

    Note over QCOfficer: Repair completed
    QCOfficer->>API: PATCH /qc/{inspectionId}/repaired
    API->>DB: Update QCInspection (status: REPAIRED)

    QCOfficer->>API: PATCH /qc/{inspectionId}/pass
    API->>DB: Update QCInspection (status: PASSED)
    API->>DB: Update Order (status: QC_PASSED)

    QCOfficer->>API: PATCH /qc/{inspectionId}/ready
    API->>DB: Update Order (status: DISPATCHED)

    Delivery->>API: PATCH /shipments/{id}/pickup
    Delivery->>API: PATCH /shipments/{id}/delivered {otp}
    API->>DB: Update Order (status: DELIVERED)
    API-->>Buyer: "Your repaired item is on its way"
```

---

## Sequence 3: Return & Refund Flow

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    participant API as Backend API
    participant DB as Database
    actor Admin
    actor Delivery as Delivery Officer
    actor QCOfficer as QC Officer
    participant PayGW as Payment Gateway

    Buyer->>API: POST /returns {orderId, reason}
    API->>DB: Create Return (status: REQUESTED)
    API->>DB: Notify Admin

    Admin->>API: GET /admin/returns
    Admin->>API: PATCH /returns/{id}/approve
    API->>DB: Update Return (status: APPROVED)
    API->>DB: Create return shipment assignment
    API-->>Buyer: "Return approved. Our team will pick up the item."

    Delivery->>API: PATCH /return-shipments/{id}/pickup
    API->>DB: Update Return (status: PICKED_UP)

    Delivery->>API: PATCH /return-shipments/{id}/returned-to-warehouse
    API->>DB: Update Return (status: AT_WAREHOUSE)

    Note over QCOfficer: Item received back for testing
    QCOfficer->>API: PATCH /qc/{inspectionId}/re-inspect

    alt Item repairable
        QCOfficer->>API: PATCH /qc/{inspectionId}/repair
        Note over QCOfficer: Repair done
        QCOfficer->>API: PATCH /qc/{inspectionId}/ready
        Delivery->>API: PATCH /shipments/{id}/reship
        API->>DB: Update Return (status: RESHIPPED)
        API-->>Buyer: "Repaired item reshipped to you"

    else Item not repairable — Replacement
        Admin->>API: PATCH /returns/{id}/resolution {type: REPLACEMENT}
        API->>DB: Create new Order for replacement item
        API-->>Buyer: "Replacement item being processed"

    else Customer wants Refund
        Admin->>API: PATCH /returns/{id}/resolution {type: REFUND, logisticsDeduction: 2500}
        API->>DB: Create Refund record
        API->>PayGW: Trigger refund (netAmount = paid - logisticsDeduction)
        PayGW-->>API: Refund success
        API->>DB: Update Payment (status: REFUNDED)
        API->>DB: Update Return (status: RESOLVED)
        API-->>Buyer: "Refund of ₦X processed to your account"
    end
```

---

## Sequence 4: Seller Onboarding (Admin Approval)

```mermaid
sequenceDiagram
    autonumber
    actor Seller
    participant API as Backend API
    participant DB as Database
    actor Admin

    Seller->>API: POST /auth/seller/apply {businessName, bankDetails, CAC, phone}
    API->>DB: Create Seller (verificationStatus: PENDING)
    API-->>Seller: "Application submitted. Awaiting approval."
    API->>DB: Notify Admin of new seller application

    Admin->>API: GET /admin/sellers?status=PENDING
    Admin->>API: Review seller application details

    alt Seller Approved
        Admin->>API: PATCH /admin/sellers/{id}/approve
        API->>DB: Update Seller (verificationStatus: APPROVED)
        API-->>Seller: "Congratulations! Your seller account has been approved."
        Seller->>API: Login to seller dashboard
        Seller->>API: POST /products (list first product)

    else Seller Rejected
        Admin->>API: PATCH /admin/sellers/{id}/reject {reason}
        API->>DB: Update Seller (verificationStatus: REJECTED)
        API-->>Seller: "Your application was rejected: [reason]"
    end
```
