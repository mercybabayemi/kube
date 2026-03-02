import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.user import User, Seller
from app.models.order import Order
from app.models.payment import Payment
from app.models.return_model import Return
from app.models.enums import VerificationStatus, OrderStatus, PaymentStatus, ReturnStatus, ReturnResolutionType
from app.services.payment_service import release_escrow, process_refund


def get_pending_sellers(db: Session) -> list[Seller]:
    return db.query(Seller).filter(Seller.verification_status == VerificationStatus.PENDING).all()


def approve_seller(db: Session, seller_user_id: uuid.UUID) -> Seller:
    seller = db.get(Seller, seller_user_id)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    seller.verification_status = VerificationStatus.APPROVED
    seller.approved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(seller)
    return seller


def reject_seller(db: Session, seller_user_id: uuid.UUID, reason: str) -> Seller:
    seller = db.get(Seller, seller_user_id)
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    seller.verification_status = VerificationStatus.REJECTED
    seller.rejection_reason = reason
    db.commit()
    db.refresh(seller)
    return seller


def get_dashboard_stats(db: Session) -> dict:
    from datetime import date
    from calendar import monthrange

    today = date.today()
    month_start = datetime(today.year, today.month, 1, tzinfo=timezone.utc)

    revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == PaymentStatus.RELEASED,
        Payment.released_at >= month_start,
    ).scalar() or 0.0

    active_orders = db.query(Order).filter(
        Order.status.not_in([OrderStatus.DELIVERED, OrderStatus.CONFIRMED, OrderStatus.REFUNDED, OrderStatus.CANCELLED])
    ).count()

    pending_payouts = db.query(Payment).filter(Payment.status == PaymentStatus.AWAITING_RELEASE).count()

    open_disputes = db.query(Return).filter(
        Return.status.in_([ReturnStatus.REQUESTED, ReturnStatus.APPROVED])
    ).count()

    pending_sellers = db.query(Seller).filter(Seller.verification_status == VerificationStatus.PENDING).count()

    return {
        "total_revenue_month": float(revenue),
        "active_orders": active_orders,
        "pending_payouts": pending_payouts,
        "open_disputes": open_disputes,
        "pending_seller_applications": pending_sellers,
    }


def resolve_dispute(
    db: Session,
    return_id: uuid.UUID,
    resolution_type: ReturnResolutionType,
    logistics_deduction: float,
    admin_notes: str | None,
) -> Return:
    return_req = db.get(Return, return_id)
    if not return_req:
        raise HTTPException(status_code=404, detail="Return not found")

    return_req.resolution_type = resolution_type
    return_req.admin_notes = admin_notes
    return_req.resolved_at = datetime.now(timezone.utc)

    if resolution_type == ReturnResolutionType.REFUND:
        process_refund(db, return_req.order_id, logistics_deduction)
        return_req.status = ReturnStatus.RESOLVED
    elif resolution_type == ReturnResolutionType.REPLACEMENT:
        return_req.status = ReturnStatus.RESOLVED
    elif resolution_type == ReturnResolutionType.REPAIR:
        return_req.status = ReturnStatus.APPROVED  # Will be reshipped after repair

    db.commit()
    db.refresh(return_req)
    return return_req


def get_report(db: Session) -> dict:
    total_orders = db.query(Order).count()
    revenue_result = db.query(func.sum(Payment.amount)).filter(Payment.status == PaymentStatus.RELEASED).scalar() or 0
    commission_result = db.query(func.sum(Payment.commission_deducted)).scalar() or 0
    payouts_result = db.query(func.sum(Payment.seller_payout)).filter(Payment.status == PaymentStatus.RELEASED).scalar() or 0
    pending_payouts = db.query(func.sum(Payment.amount)).filter(Payment.status == PaymentStatus.AWAITING_RELEASE).scalar() or 0

    return {
        "total_orders": total_orders,
        "total_revenue": float(revenue_result),
        "total_commission": float(commission_result),
        "total_payouts": float(payouts_result),
        "pending_payouts": float(pending_payouts),
    }
