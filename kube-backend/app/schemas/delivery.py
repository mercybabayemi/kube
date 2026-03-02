import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import ShipmentStatus


class ShipmentResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    delivery_officer_id: uuid.UUID | None
    tracking_number: str
    status: ShipmentStatus
    dispatched_at: datetime | None
    delivered_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class DeliveryConfirmRequest(BaseModel):
    otp: str
