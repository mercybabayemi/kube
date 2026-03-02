import uuid

from fastapi import APIRouter, Depends

from app.core.dependencies import DBSession, CurrentUser, require_role
from app.models.enums import UserRole
from app.schemas.admin import (
    SellerApprovalRequest, SellerAdminResponse, DisputeResolutionRequest,
    AdminDashboardStats, AdminReportResponse,
)
from app.schemas.order import OrderResponse
from app.schemas.payment import PaymentResponse
from app.schemas.product import ProductResponse
from app.schemas.returns import ReturnResponse
from app.services import admin_service, order_service, product_service, payment_service

router = APIRouter()

AdminOnly = Depends(require_role(UserRole.ADMIN))


@router.get("/dashboard", response_model=AdminDashboardStats, dependencies=[AdminOnly])
def dashboard(db: DBSession):
    return admin_service.get_dashboard_stats(db)


@router.get("/report", response_model=AdminReportResponse, dependencies=[AdminOnly])
def report(db: DBSession):
    return admin_service.get_report(db)


# ── Sellers ──────────────────────────────────────────────────────────────────

@router.get("/sellers/pending", response_model=list[SellerAdminResponse], dependencies=[AdminOnly])
def pending_sellers(db: DBSession):
    return admin_service.get_pending_sellers(db)


@router.patch("/sellers/{seller_id}/approve", response_model=SellerAdminResponse, dependencies=[AdminOnly])
def approve_seller(seller_id: uuid.UUID, db: DBSession):
    return admin_service.approve_seller(db, seller_id)


@router.patch("/sellers/{seller_id}/reject", response_model=SellerAdminResponse, dependencies=[AdminOnly])
def reject_seller(seller_id: uuid.UUID, data: SellerApprovalRequest, db: DBSession):
    return admin_service.reject_seller(db, seller_id, data.rejection_reason or "No reason provided")


# ── Products ─────────────────────────────────────────────────────────────────

@router.patch("/products/{product_id}/approve", response_model=ProductResponse, dependencies=[AdminOnly])
def approve_product(product_id: uuid.UUID, db: DBSession):
    return product_service.approve_product(db, product_id)


@router.patch("/products/{product_id}/reject", response_model=ProductResponse, dependencies=[AdminOnly])
def reject_product(product_id: uuid.UUID, db: DBSession):
    return product_service.reject_product(db, product_id)


# ── Orders ────────────────────────────────────────────────────────────────────

@router.get("/orders", dependencies=[AdminOnly])
def all_orders(db: DBSession, page: int = 1, page_size: int = 20):
    return order_service.get_all_orders(db, page=page, page_size=page_size)


@router.get("/orders/{order_id}", response_model=OrderResponse, dependencies=[AdminOnly])
def get_order(order_id: uuid.UUID, db: DBSession):
    return order_service.get_order(db, order_id)


# ── Payments / Escrow ─────────────────────────────────────────────────────────

@router.patch("/payments/{payment_id}/release", response_model=PaymentResponse, dependencies=[AdminOnly])
def release_escrow(payment_id: uuid.UUID, db: DBSession):
    return payment_service.release_escrow(db, payment_id)


# ── Disputes / Returns ────────────────────────────────────────────────────────

@router.get("/returns", response_model=list[ReturnResponse], dependencies=[AdminOnly])
def all_returns(db: DBSession):
    from app.services import return_service
    return return_service.get_all_returns(db)


@router.patch("/returns/{return_id}/resolve", response_model=ReturnResponse, dependencies=[AdminOnly])
def resolve_dispute(return_id: uuid.UUID, data: DisputeResolutionRequest, db: DBSession):
    return admin_service.resolve_dispute(
        db, return_id, data.resolution_type, data.logistics_deduction, data.admin_notes
    )
