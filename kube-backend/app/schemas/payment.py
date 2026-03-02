import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import PaymentStatus, PaymentGateway


class PaymentInitResponse(BaseModel):
    order_id: uuid.UUID
    payment_id: uuid.UUID
    authorization_url: str
    access_code: str
    reference: str


class PaymentResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    amount: float
    commission_deducted: float
    seller_payout: float
    status: PaymentStatus
    gateway: PaymentGateway
    gateway_reference: str | None
    created_at: datetime
    released_at: datetime | None

    model_config = {"from_attributes": True}


class PaystackWebhookEvent(BaseModel):
    event: str
    data: dict


class ReleaseEscrowRequest(BaseModel):
    payment_id: uuid.UUID
