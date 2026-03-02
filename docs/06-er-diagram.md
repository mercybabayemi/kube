# Kube — Entity Relationship (ER) Diagram

```mermaid
erDiagram

    USERS {
        uuid id PK
        string name
        string email UK
        string phone UK
        string password_hash
        enum role
        string address
        timestamp created_at
        timestamp updated_at
    }

    SELLERS {
        uuid user_id PK, FK
        string business_name
        string bank_account_number
        string bank_name
        enum verification_status
        float rating
        timestamp approved_at
    }

    PRODUCTS {
        uuid id PK
        uuid seller_id FK
        uuid category_id FK
        string title
        text description
        enum condition
        decimal price
        int stock_qty
        json images
        enum verification_status
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name
        uuid parent_id FK
        float commission_rate
    }

    ORDERS {
        uuid id PK
        uuid buyer_id FK
        enum status
        decimal total_amount
        text delivery_address
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal unit_price
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK
        decimal amount
        decimal commission_deducted
        decimal seller_payout
        enum status
        string gateway_reference UK
        enum gateway
        timestamp created_at
        timestamp released_at
    }

    QC_INSPECTIONS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid officer_id FK
        uuid warehouse_id FK
        enum status
        text notes
        text repair_details
        timestamp received_at
        timestamp inspected_at
        timestamp ready_at
    }

    SHIPMENTS {
        uuid id PK
        uuid order_id FK
        uuid delivery_officer_id FK
        string tracking_number UK
        enum status
        string delivery_otp
        timestamp dispatched_at
        timestamp delivered_at
    }

    RETURNS {
        uuid id PK
        uuid order_id FK
        uuid buyer_id FK
        text reason
        enum status
        enum resolution_type
        text admin_notes
        timestamp created_at
        timestamp resolved_at
    }

    REFUNDS {
        uuid id PK
        uuid order_id FK
        uuid payment_id FK
        decimal amount
        decimal logistics_deduction
        decimal net_refund
        enum status
        timestamp created_at
        timestamp processed_at
    }

    REVIEWS {
        uuid id PK
        uuid buyer_id FK
        uuid product_id FK
        int rating
        text comment
        timestamp created_at
    }

    WAREHOUSES {
        uuid id PK
        string name
        string location
        text address
        uuid manager_id FK
    }

    SELLER_WAREHOUSES {
        uuid seller_id FK
        uuid warehouse_id FK
    }

    %% Relationships
    USERS ||--o{ ORDERS : "places"
    USERS ||--o| SELLERS : "is"
    SELLERS ||--o{ PRODUCTS : "lists"
    PRODUCTS }o--|| CATEGORIES : "belongs to"
    CATEGORIES ||--o{ CATEGORIES : "parent of"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    ORDER_ITEMS }o--|| PRODUCTS : "refers to"
    ORDERS ||--|| PAYMENTS : "has"
    ORDERS ||--o| QC_INSPECTIONS : "has"
    ORDERS ||--o| SHIPMENTS : "dispatched via"
    ORDERS ||--o| RETURNS : "may have"
    RETURNS ||--o| REFUNDS : "may trigger"
    PAYMENTS ||--o| REFUNDS : "generates"
    USERS ||--o{ REVIEWS : "writes"
    PRODUCTS ||--o{ REVIEWS : "receives"
    WAREHOUSES ||--o{ QC_INSPECTIONS : "hosts"
    USERS ||--o{ QC_INSPECTIONS : "inspects (QC Officer)"
    USERS ||--o{ SHIPMENTS : "handles (Delivery Officer)"
    WAREHOUSES ||--o{ SELLER_WAREHOUSES : "assigned to"
    SELLERS ||--o{ SELLER_WAREHOUSES : "ships to"
```

---

## Database Notes

| Table | Notes |
|-------|-------|
| `users` | Single table for all user types; role enum distinguishes them |
| `sellers` | One-to-one extension of users (only exists if user is a seller) |
| `payments` | Stores both gross and net amounts; commission is deducted at release |
| `qc_inspections` | One per order item at MVP; can become one-per-item in Phase 2 |
| `seller_warehouses` | Many-to-many: a seller may ship to multiple QC warehouses by city |
| `categories` | Self-referencing for subcategory support (e.g., Electronics > Phones) |
| `orders` status | Tracks the full lifecycle — see OrderStatus enum in class diagram |
| `payments` status | AWAITING_RELEASE is set after buyer confirms receipt; admin manually triggers RELEASED at MVP |
| `categories` commission_rate | Commission is configured per category by admin (BR-10), not per seller |
