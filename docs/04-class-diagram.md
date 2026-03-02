# Kube — Class Diagram

Render with any Mermaid-compatible tool (VS Code Mermaid plugin, mermaid.live, GitHub markdown).

```mermaid
classDiagram
    direction TB

    %% ─── Base User ───
    class User {
        +UUID id
        +String name
        +String email
        +String phone
        +String passwordHash
        +Enum role
        +String address
        +DateTime createdAt
        +DateTime updatedAt
        +login() Boolean
        +logout() void
        +resetPassword() void
    }

    %% ─── Buyer ───
    class Buyer {
        +List~Order~ orderHistory
        +placeOrder(cartId) Order
        +confirmReceipt(orderId) void
        +requestReturn(orderId, reason) Return
        +requestRefund(orderId) Refund
        +leaveReview(productId, rating, comment) Review
    }

    %% ─── Seller ───
    class Seller {
        +String businessName
        +String bankAccountNumber
        +String bankName
        +Enum verificationStatus
        +Float rating
        +applyToSell() void
        +listProduct(details) Product
        +updateInventory(productId, qty) void
        +markShippedToQC(orderId) void
        +viewPayout() List~Payment~
    }

    %% ─── Admin ───
    class Admin {
        +approveSeller(sellerId) void
        +rejectSeller(sellerId, reason) void
        +removeProduct(productId) void
        +resolveDispute(disputeId, resolution) void
        +releaseEscrow(paymentId) void
        +generateReport(type, dateRange) Report
    }

    %% ─── QC Officer ───
    class QCOfficer {
        +UUID warehouseId
        +inspectItem(qcInspectionId) void
        +passItem(qcInspectionId) void
        +failItem(qcInspectionId, notes) void
        +logRepair(qcInspectionId, repairDetails) void
        +markReadyForShipping(qcInspectionId) void
    }

    %% ─── Delivery Officer ───
    class DeliveryOfficer {
        +UUID warehouseId
        +viewAssignments() List~Shipment~
        +pickUpFromWarehouse(shipmentId) void
        +updateDeliveryStatus(shipmentId, status) void
        +confirmDelivery(shipmentId, otp) void
        +pickUpReturn(returnId) void
    }

    %% ─── Product ───
    class Product {
        +UUID id
        +UUID sellerId
        +UUID categoryId
        +String title
        +String description
        +Enum condition
        +Float price
        +Int stockQty
        +List~String~ images
        +Enum verificationStatus
        +DateTime createdAt
        +updateStock(qty) void
        +markSoldOut() void
    }

    %% ─── Category ───
    class Category {
        +UUID id
        +String name
        +UUID parentId
        +Float commissionRate
        +List~Product~ products
    }

    %% ─── Order ───
    class Order {
        +UUID id
        +UUID buyerId
        +Enum status
        +Float totalAmount
        +String deliveryAddress
        +DateTime createdAt
        +calculateTotal() Float
        +updateStatus(status) void
    }

    %% ─── OrderItem ───
    class OrderItem {
        +UUID id
        +UUID orderId
        +UUID productId
        +Int quantity
        +Float unitPrice
        +Float subtotal()
    }

    %% ─── Payment ───
    class Payment {
        +UUID id
        +UUID orderId
        +Float amount
        +Float commissionDeducted
        +Float sellerPayout
        +Enum status
        +String gatewayReference
        +Enum gateway
        +DateTime createdAt
        +DateTime releasedAt
        +holdFunds() void
        +releaseFunds() void
        +triggerRefund(amount) void
    }

    %% ─── QCInspection ───
    class QCInspection {
        +UUID id
        +UUID orderId
        +UUID productId
        +UUID officerId
        +UUID warehouseId
        +Enum status
        +String notes
        +String repairDetails
        +DateTime receivedAt
        +DateTime inspectedAt
        +DateTime readyAt
    }

    %% ─── Shipment ───
    class Shipment {
        +UUID id
        +UUID orderId
        +UUID deliveryOfficerId
        +String trackingNumber
        +Enum carrier
        +Enum status
        +DateTime dispatchedAt
        +DateTime deliveredAt
        +String deliveryOtp
    }

    %% ─── Return ───
    class Return {
        +UUID id
        +UUID orderId
        +UUID buyerId
        +String reason
        +Enum status
        +Enum resolutionType
        +String adminNotes
        +DateTime createdAt
        +DateTime resolvedAt
    }

    %% ─── Refund ───
    class Refund {
        +UUID id
        +UUID orderId
        +UUID paymentId
        +Float amount
        +Float logisticsDeduction
        +Float netRefund
        +Enum status
        +DateTime createdAt
        +DateTime processedAt
        +process() void
    }

    %% ─── Review ───
    class Review {
        +UUID id
        +UUID buyerId
        +UUID productId
        +Int rating
        +String comment
        +DateTime createdAt
    }

    %% ─── Warehouse ───
    class Warehouse {
        +UUID id
        +String name
        +String location
        +String address
        +UUID managerId
        +List~QCOfficer~ officers
    }

    %% ─── Enumerations (notes) ───
    class OrderStatus {
        <<enumeration>>
        PAID
        SELLER_NOTIFIED
        SHIPPED_TO_QC
        QC_IN_PROGRESS
        QC_PASSED
        QC_FAILED
        REPAIR_IN_PROGRESS
        DISPATCHED
        DELIVERED
        RETURN_REQUESTED
        RETURNED
        REFUNDED
        CANCELLED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        HELD
        AWAITING_RELEASE
        RELEASED
        REFUNDED
        FAILED
    }

    class QCStatus {
        <<enumeration>>
        PENDING
        IN_PROGRESS
        PASSED
        FAILED
        REPAIR_NEEDED
        REPAIRED
        READY_TO_SHIP
    }

    class UserRole {
        <<enumeration>>
        BUYER
        SELLER
        QC_OFFICER
        DELIVERY_OFFICER
        ADMIN
    }

    %% ─── Inheritance ───
    User <|-- Buyer
    User <|-- Seller
    User <|-- Admin
    User <|-- QCOfficer
    User <|-- DeliveryOfficer

    %% ─── Associations ───
    Buyer "1" --> "0..*" Order : places
    Seller "1" --> "0..*" Product : lists
    Order "1" --> "1..*" OrderItem : contains
    OrderItem "1" --> "1" Product : references
    Order "1" --> "1" Payment : has
    Order "1" --> "0..1" QCInspection : undergoes
    Order "1" --> "0..1" Shipment : dispatched via
    Order "1" --> "0..1" Return : may have
    Return "1" --> "0..1" Refund : triggers
    Payment "1" --> "0..1" Refund : generates
    Product "1" --> "0..*" Review : receives
    Product "*" --> "1" Category : belongs to
    Category "0..1" --> "0..*" Category : parent of
    QCOfficer "*" --> "1" Warehouse : assigned to
    DeliveryOfficer "*" --> "1" Warehouse : based at
    QCInspection "*" --> "1" QCOfficer : assigned to
    Shipment "*" --> "1" DeliveryOfficer : assigned to
```

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Single `User` base class with role enum | Simplifies auth — one login system for all roles |
| Separate `Return` and `Refund` entities | Return is a physical process; refund is a financial event — they are distinct |
| `Payment` holds both gross amount and seller payout | Commission deducted at escrow release, not at payment time |
| `QCInspection` linked to both `Order` and `Product` | An order item's QC result is traceable per product per order |
| `OrderStatus` has granular states | Needed to reflect real-world QC workflow stages |
| `Warehouse` entity | Multi-city QC units from day one by design |
