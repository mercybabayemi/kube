# Kube — Technology Stack Recommendation

**Version:** 1.0
**Date:** 2026-02-20

---

## Recommended Stack

### Frontend
| Tool | Choice | Why |
|------|--------|-----|
| Framework | **Next.js 14 (React)** | SSR for SEO (product pages must be indexable); fast page loads; file-based routing |
| Styling | **Tailwind CSS** | Rapid UI development; mobile-first; no context switching |
| State Management | **Zustand** | Lightweight; simpler than Redux for this scale |
| Forms | **React Hook Form + Zod** | Performant forms with schema-based validation |
| HTTP Client | **Axios** | Interceptors for auth token handling |

### Backend
| Tool | Choice | Why |
|------|--------|-----|
| Runtime | **Python 3.12** | Clean syntax; strong ecosystem for web APIs; excellent library support |
| Framework | **FastAPI** | Modern, async-first; auto-generates OpenAPI docs; type-safe via Pydantic; high performance |
| Auth | **JWT + Refresh Tokens** | Stateless; works well across web |
| OTP | **Plivo** | Cheapest SMS API for Nigeria at $0.0055/SMS; developer-friendly REST API; no setup fee |
| File Upload | **Cloudinary** | Product image storage with CDN delivery |
| API Style | **REST** | Simpler to reason about for the team; GraphQL is overkill at MVP |

### Database
| Tool | Choice | Why |
|------|--------|-----|
| Primary DB | **PostgreSQL** | Relational data; strong for financial records; ACID compliance needed for payments |
| ORM | **SQLAlchemy + Alembic** | Industry-standard Python ORM; Alembic handles schema migrations |
| Validation | **Pydantic v2** | Built into FastAPI; request/response schema validation and serialization |
| Caching | **Redis** | Session storage, rate limiting, OTP TTL storage, product list caching |

### Payments
| Tool | Choice | Why |
|------|--------|-----|
| Gateway | **Paystack** or **Monnify** | Decision to be finalised before development begins (see note below) |
| Paystack | Card, bank transfer, USSD, QR | Most widely used in Nigeria; great developer API; webhooks for escrow events; Paystack Transfer API for seller disbursements |
| Monnify | Bank transfer, USSD focus | Lower failure rate on bank transfers; strong for large payment values |
| Escrow simulation | Application-level | Funds held in Kube's account; released manually by admin after QC + delivery + buyer confirmation |

> **Note:** Only one payment gateway will be integrated in the MVP — either Paystack or Monnify. The choice will be confirmed by the Client before M2 development begins. Neither provider offers native third-party escrow; the escrow logic is handled at the application level. The selected gateway's Transfer/Disbursement API will be used for seller payouts.

### Infrastructure & Deployment
| Tool | Choice | Why |
|------|--------|-----|
| Hosting | **Railway** or **Render** (MVP) → **AWS/DigitalOcean** (scale) | Low-ops at MVP; easy deployment; Nigerian-accessible |
| Domain & SSL | **Cloudflare** | Free SSL, DDoS protection, DNS management |
| CI/CD | **GitHub Actions** | Free for private repos; auto-deploy on push |
| Process Manager | **PM2** | Node.js process management on VPS |
| Environment Config | **.env + dotenv** | Standard secret management |

### Dev Tools
| Tool | Purpose |
|------|---------|
| Git + GitHub | Version control, private repo |
| Postman | API documentation and testing |
| FastAPI Swagger UI | Auto-generated interactive API docs (built in, available at `/docs`) |
| pgAdmin / DBeaver | Database inspection during dev |
| Ruff | Python linting and formatting (replaces flake8 + black) |
| pytest | Backend unit and integration testing |

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Kube Platform                        │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │   Buyer UI   │    │  Seller UI   │    │   Admin UI    │ │
│  │  (Next.js)   │    │  (Next.js)   │    │   (Next.js)   │ │
│  └──────┬───────┘    └──────┬───────┘    └───────┬───────┘ │
│         │                   │                     │         │
│         └───────────────────┼─────────────────────┘         │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   REST API      │                      │
│                    │   (FastAPI)     │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│         ┌───────────────────┼──────────────┐               │
│         │                   │              │               │
│  ┌──────▼──────┐   ┌────────▼──────┐  ┌───▼─────────┐    │
│  │ PostgreSQL  │   │    Redis      │  │ Cloudinary  │    │
│  │(SQLAlchemy) │   │  (Cache/OTP)  │  │  (Images)   │    │
│  └─────────────┘   └───────────────┘  └─────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                ┌──────────────────────┐
│   Paystack      │                │        Plivo         │
│     OR          │                │      (SMS OTP)       │
│   Monnify       │                └──────────────────────┘
│  (Payments)     │
└─────────────────┘
```

---

> **Backend folder structure and layer breakdown:** See `09-backend-architecture.md`

---

## Key Decisions Explained

### Why not a single-page app (SPA) without SSR?
Product pages need to be indexed by Google. A buyer searching "used LG fridge Lagos" should find Kube products. Next.js SSR handles this without extra config.

### Why Python/FastAPI over Node.js/Express?
FastAPI is async-first, type-safe (via Pydantic), and auto-generates interactive API documentation (Swagger UI at `/docs`). It is one of the fastest Python frameworks and fits well with the relational data model. Python's ecosystem is also stronger for future additions like data analytics or ML-based fraud detection.

### Why not MongoDB?
Financial data (payments, escrow, payouts) requires strong consistency and ACID transactions. PostgreSQL is the right tool. MongoDB's flexible schema is not an advantage here.

### Why no microservices?
For a 2–3 month MVP with one developer, a monolith is the correct approach. Premature microservices add infrastructure complexity without benefit at this scale. The codebase will be structured in a modular way to extract services later if needed.

### Why Plivo for SMS OTP?
Plivo is the cheapest international SMS API for Nigeria at **$0.0055 per SMS** — lower than Termii's standard SMS rate ($0.0107/SMS) and Africa's Talking (which does not publish Nigeria pricing publicly). Plivo has a straightforward REST API with no setup fee and good delivery rates.

### Why Redis?
OTP codes need TTL (they expire after a set time). Product list caches reduce database load. Session invalidation on logout. Redis handles all three cheaply.

---

## Nigerian-Specific Considerations

| Concern | Solution |
|---------|---------|
| Low internet speed / data-conscious users | Image compression via Cloudinary; lazy loading; minimal JS bundle |
| Payment failures (card/bank issues) | Multiple payment methods: card, bank transfer, USSD |
| Mobile traffic dominance | Mobile-first responsive design from day 1 |
| NDPR compliance | No unnecessary data collection; clear privacy policy; data stored in-country or with appropriate safeguards |
| Power outages during transactions | Webhook-based payment confirmation (not redirect-only); idempotent order creation |
