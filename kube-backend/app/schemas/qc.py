import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import QCStatus


class QCInspectionResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    product_id: uuid.UUID
    officer_id: uuid.UUID | None
    warehouse_id: uuid.UUID | None
    status: QCStatus
    notes: str | None
    repair_details: str | None
    received_at: datetime
    inspected_at: datetime | None
    ready_at: datetime | None

    model_config = {"from_attributes": True}


class QCUpdateRequest(BaseModel):
    notes: str | None = None
    repair_details: str | None = None
