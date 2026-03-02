import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import OrderStatus


class CartItemInput(BaseModel):
    product_id: uuid.UUID
    quantity: int = 1


class OrderCreate(BaseModel):
    items: list[CartItemInput]
    delivery_address: str
    delivery_name: str
    delivery_phone: str
    notes: str | None = None


class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: uuid.UUID
    order_number: str
    status: OrderStatus
    total_amount: float
    delivery_fee: float
    delivery_address: str
    delivery_name: str | None
    delivery_phone: str | None
    items: list[OrderItemResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    total: int


class ConfirmReceiptRequest(BaseModel):
    order_id: uuid.UUID
