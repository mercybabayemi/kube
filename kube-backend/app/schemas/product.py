import uuid
from datetime import datetime

from pydantic import BaseModel, field_validator

from app.models.enums import ProductCondition, VerificationStatus


class CategoryCreate(BaseModel):
    name: str
    slug: str
    icon: str | None = None
    parent_id: uuid.UUID | None = None
    commission_rate: float = 0.10


class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    icon: str | None
    parent_id: uuid.UUID | None
    commission_rate: float

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    title: str
    description: str
    category_id: uuid.UUID
    condition: ProductCondition
    price: float
    stock_qty: int
    images: list[str] = []

    @field_validator("price")
    @classmethod
    def positive_price(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Price must be positive")
        return v

    @field_validator("stock_qty")
    @classmethod
    def non_negative_stock(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v


class ProductUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category_id: uuid.UUID | None = None
    condition: ProductCondition | None = None
    price: float | None = None
    stock_qty: int | None = None
    images: list[str] | None = None


class SellerSummary(BaseModel):
    business_name: str
    rating: float

    model_config = {"from_attributes": True}


class ProductResponse(BaseModel):
    id: uuid.UUID
    seller_id: uuid.UUID
    category_id: uuid.UUID
    title: str
    description: str
    condition: ProductCondition
    price: float
    stock_qty: int
    images: list[str]
    verification_status: VerificationStatus
    is_active: bool
    created_at: datetime
    category: CategoryResponse | None = None

    model_config = {"from_attributes": True}


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
