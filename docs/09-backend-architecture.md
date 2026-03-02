# Kube — FastAPI Backend Architecture

**Version:** 1.0
**Date:** 2026-02-20

---

## Overview

The backend follows a **layered architecture** with clear separation between routing, business logic, and data access. This keeps the codebase maintainable, testable, and easy to extend as the platform grows.

---

## Project Folder Structure

```
kube-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                        # FastAPI app instance, CORS, router registration
│   ├── config.py                      # Settings via pydantic-settings (.env loading)
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── routes/
│   │           ├── auth.py            # Register, login, OTP, password reset
│   │           ├── products.py        # Catalog, search, product detail
│   │           ├── cart.py            # Cart management
│   │           ├── orders.py          # Order lifecycle
│   │           ├── payments.py        # Payment init, webhook handler, escrow
│   │           ├── seller.py          # Seller onboarding, listings, payouts
│   │           ├── qc.py              # QC officer inspection workflow
│   │           ├── delivery.py        # Delivery assignments and status
│   │           └── admin.py           # Admin dashboard, reports, disputes
│   │
│   ├── core/
│   │   ├── security.py                # JWT creation/validation, password hashing
│   │   └── dependencies.py            # FastAPI DI: get_db, get_current_user, role guards
│   │
│   ├── models/                        # SQLAlchemy ORM models (map to DB tables)
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── qc.py
│   │   └── delivery.py
│   │
│   ├── schemas/                       # Pydantic schemas (request/response validation)
│   │   ├── auth.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   └── admin.py
│   │
│   ├── services/                      # Business logic layer
│   │   ├── auth_service.py            # OTP generation, token logic
│   │   ├── order_service.py           # Order state machine
│   │   ├── payment_service.py         # Escrow logic, payout trigger
│   │   ├── qc_service.py
│   │   └── notification_service.py    # SMS (Plivo) integration
│   │
│   ├── repositories/                  # Database query layer (CRUD operations)
│   │   ├── user_repo.py
│   │   ├── product_repo.py
│   │   └── order_repo.py
│   │
│   └── utils/
│       ├── cloudinary.py              # Image upload helper
│       └── plivo.py                   # OTP send helper
│
├── alembic/                           # Database migrations
│   ├── env.py
│   └── versions/
│
├── tests/
│   ├── test_auth.py
│   ├── test_orders.py
│   └── test_payments.py
│
├── requirements.txt
├── alembic.ini
├── .env
└── README.md
```

---

## Layer Responsibilities

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| **Routes** | `api/v1/routes/` | Receive HTTP requests; validate input via schemas; call services; return responses |
| **Services** | `services/` | All business logic; coordinates between repositories and external APIs |
| **Repositories** | `repositories/` | All database queries; no business logic lives here |
| **Models** | `models/` | SQLAlchemy table definitions — source of truth for the DB schema |
| **Schemas** | `schemas/` | Pydantic models for request validation and response shaping |
| **Core** | `core/` | Auth utilities and dependency injection shared across routes |

---

## Request Flow

```
HTTP Request
     │
     ▼
 Route (api/v1/routes/)
     │  validates input schema (Pydantic)
     │  checks auth via dependency injection (core/dependencies.py)
     ▼
 Service (services/)
     │  applies business rules
     │  calls external APIs (Plivo, Paystack/Monnify, Cloudinary)
     ▼
 Repository (repositories/)
     │  executes DB queries via SQLAlchemy
     ▼
 PostgreSQL Database
```

---

## Key Files Explained

| File | Purpose |
|------|---------|
| `main.py` | Entry point — creates the FastAPI app, registers all route prefixes, sets up CORS |
| `config.py` | Loads `.env` variables using `pydantic-settings`; single source of config truth |
| `core/security.py` | Creates and validates JWTs; handles bcrypt password hashing |
| `core/dependencies.py` | FastAPI dependency functions: `get_db` (DB session), `get_current_user`, role guards (admin only, seller only, etc.) |
| `alembic/` | Manages all database schema migrations — run `alembic upgrade head` to apply |
