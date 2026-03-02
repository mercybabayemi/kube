import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import ReturnStatus, ReturnResolutionType, RefundStatus


class ReturnCreateRequest(BaseModel):
    order_id: uuid.UUID
    reason: str
    description: str | None = None


class ReturnResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    buyer_id: uuid.UUID
    reason: str
    description: str | None
    status: ReturnStatus
    resolution_type: ReturnResolutionType | None
    admin_notes: str | None
    created_at: datetime
    resolved_at: datetime | None

    model_config = {"from_attributes": True}


class RefundResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    payment_id: uuid.UUID
    amount: float
    logistics_deduction: float
    net_refund: float
    status: RefundStatus
    created_at: datetime
    processed_at: datetime | None

    model_config = {"from_attributes": True}
