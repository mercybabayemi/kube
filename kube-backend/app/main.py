from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
# Import all models to ensure they are registered with Base.metadata
from app.models import user, product, order, payment, review, qc, delivery, warehouse, return_model, refund

# Create tables on startup (useful for local dev)
Base.metadata.create_all(bind=engine)
from app.api.v1.routes import (
    auth,
    products,
    cart,
    orders,
    payments,
    seller,
    qc,
    delivery,
    admin,
    returns,
)

app = FastAPI(
    title=settings.APP_NAME,
    description="Kube — Verified Used Goods Marketplace API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=f"{API_PREFIX}/auth", tags=["Auth"])
app.include_router(products.router, prefix=f"{API_PREFIX}/products", tags=["Products"])
app.include_router(cart.router, prefix=f"{API_PREFIX}/cart", tags=["Cart"])
app.include_router(orders.router, prefix=f"{API_PREFIX}/orders", tags=["Orders"])
app.include_router(payments.router, prefix=f"{API_PREFIX}/payments", tags=["Payments"])
app.include_router(seller.router, prefix=f"{API_PREFIX}/seller", tags=["Seller"])
app.include_router(qc.router, prefix=f"{API_PREFIX}/qc", tags=["QC"])
app.include_router(delivery.router, prefix=f"{API_PREFIX}/delivery", tags=["Delivery"])
app.include_router(admin.router, prefix=f"{API_PREFIX}/admin", tags=["Admin"])
app.include_router(returns.router, prefix=f"{API_PREFIX}/returns", tags=["Returns"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
