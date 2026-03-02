import uuid

from fastapi import APIRouter, Request, HTTPException, Header

from app.core.dependencies import CurrentUser, DBSession
from app.schemas.payment import PaymentInitResponse, PaystackWebhookEvent
from app.services import payment_service

router = APIRouter()


@router.post("/initiate/{order_id}", response_model=PaymentInitResponse)
def initiate_payment(order_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    email = current_user.email or f"{current_user.phone}@kube.ng"
    return payment_service.initiate_payment(db, order_id, email)


@router.post("/webhook/paystack")
async def paystack_webhook(
    request: Request,
    db: DBSession,
    x_paystack_signature: str = Header(None),
):
    body = await request.body()
    if not payment_service.verify_webhook(body, x_paystack_signature or ""):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    payment_service.handle_paystack_webhook(db, payload.get("event", ""), payload.get("data", {}))
    return {"status": "ok"}
