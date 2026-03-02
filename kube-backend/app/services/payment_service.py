import hashlib
import hmac
import json
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.models.payment import Payment
from app.models.order import Order
from app.models.enums import PaymentStatus, OrderStatus, PaymentGateway
from app.models.refund import Refund
from app.models.enums import RefundStatus

PAYSTACK_BASE = "https://api.paystack.co"


def _paystack_headers() -> dict:
    return {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}", "Content-Type": "application/json"}


def initiate_payment(db: Session, order_id: uuid.UUID, buyer_email: str) -> dict:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    payment = order.payment
    if not payment:
        raise HTTPException(status_code=400, detail="No payment record for this order")

    # Convert to kobo (Paystack uses kobo)
    amount_kobo = int(float(payment.amount) * 100)

    with httpx.Client() as client:
        resp = client.post(
            f"{PAYSTACK_BASE}/transaction/initialize",
            headers=_paystack_headers(),
            json={
                "email": buyer_email,
                "amount": amount_kobo,
                "reference": f"KUBE-{order.order_number}",
                "metadata": {"order_id": str(order_id)},
                "callback_url": f"{settings.FRONTEND_URL}/checkout/verify",
            },
        )

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Payment gateway error")

    data = resp.json()["data"]
    payment.gateway_reference = data["reference"]
    payment.paystack_access_code = data["access_code"]
    payment.gateway = PaymentGateway.PAYSTACK
    db.commit()

    return {
        "order_id": order_id,
        "payment_id": payment.id,
        "authorization_url": data["authorization_url"],
        "access_code": data["access_code"],
        "reference": data["reference"],
    }


def verify_webhook(payload: bytes, signature: str) -> bool:
    if not settings.PAYSTACK_WEBHOOK_SECRET:
        return True  # Dev mode
    expected = hmac.new(settings.PAYSTACK_WEBHOOK_SECRET.encode(), payload, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature)


def handle_paystack_webhook(db: Session, event: str, data: dict) -> None:
    if event == "charge.success":
        reference = data.get("reference", "")
        payment = db.query(Payment).filter(Payment.gateway_reference == reference).first()
        if payment and payment.status == PaymentStatus.PENDING:
            payment.status = PaymentStatus.HELD
            order = payment.order
            order.status = OrderStatus.SELLER_NOTIFIED
            db.commit()

    elif event == "transfer.success":
        # Seller payout completed
        reference = data.get("reference", "")
        payment = db.query(Payment).filter(Payment.gateway_reference == reference).first()
        if payment:
            payment.status = PaymentStatus.RELEASED
            payment.released_at = datetime.now(timezone.utc)
            db.commit()


def release_escrow(db: Session, payment_id: uuid.UUID, commission_rate: float | None = None) -> Payment:
    payment = db.get(Payment, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.status != PaymentStatus.AWAITING_RELEASE:
        raise HTTPException(status_code=400, detail=f"Payment status is {payment.status}, cannot release")

    order = payment.order
    category = order.items[0].product.category if order.items else None
    rate = commission_rate or (float(category.commission_rate) if category else settings.DEFAULT_COMMISSION_RATE)

    gross = float(payment.amount)
    commission = round(gross * rate, 2)
    payout = round(gross - commission, 2)

    payment.commission_deducted = commission
    payment.seller_payout = payout

    # Attempt Paystack transfer to seller
    seller = order.items[0].product.seller if order.items else None
    if seller and seller.bank_account_number and settings.PAYSTACK_SECRET_KEY:
        _trigger_paystack_transfer(payout, seller, f"PAYOUT-{order.order_number}")
    else:
        # Mark as released directly (manual bank transfer in dev/manual mode)
        payment.status = PaymentStatus.RELEASED
        payment.released_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(payment)
    return payment


def _trigger_paystack_transfer(amount: float, seller, reference: str) -> None:
    amount_kobo = int(amount * 100)
    with httpx.Client() as client:
        client.post(
            f"{PAYSTACK_BASE}/transfer",
            headers=_paystack_headers(),
            json={
                "source": "balance",
                "amount": amount_kobo,
                "recipient": seller.bank_account_number,
                "reason": f"Kube payout - {reference}",
                "reference": reference,
            },
        )


def process_refund(db: Session, order_id: uuid.UUID, logistics_deduction: float = 0) -> Refund:
    order = db.get(Order, order_id)
    if not order or not order.payment:
        raise HTTPException(status_code=404, detail="Order/payment not found")

    payment = order.payment
    amount = float(payment.amount)
    net = round(amount - logistics_deduction, 2)

    refund = Refund(
        order_id=order_id,
        payment_id=payment.id,
        amount=amount,
        logistics_deduction=logistics_deduction,
        net_refund=net,
        status=RefundStatus.PENDING,
    )
    db.add(refund)
    payment.status = PaymentStatus.REFUNDED
    order.status = OrderStatus.REFUNDED
    db.commit()
    db.refresh(refund)
    return refund
