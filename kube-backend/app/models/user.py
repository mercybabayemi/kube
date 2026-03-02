import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, Enum, DateTime, Text, Boolean, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import UserRole, VerificationStatus

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.order import Order
    from app.models.review import Review
    from app.models.return_model import Return
    from app.models.qc import QCInspection
    from app.models.delivery import Shipment
    from app.models.warehouse import SellerWarehouse


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.BUYER)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    seller_profile: Mapped["Seller | None"] = relationship("Seller", back_populates="user", uselist=False)
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="buyer", foreign_keys="Order.buyer_id")
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates="buyer")
    returns: Mapped[list["Return"]] = relationship("Return", back_populates="buyer")
    qc_inspections: Mapped[list["QCInspection"]] = relationship(
        "QCInspection", back_populates="officer", foreign_keys="QCInspection.officer_id"
    )
    shipments: Mapped[list["Shipment"]] = relationship(
        "Shipment", back_populates="delivery_officer", foreign_keys="Shipment.delivery_officer_id"
    )


class Seller(Base):
    __tablename__ = "sellers"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    business_name: Mapped[str] = mapped_column(String(255), nullable=False)
    bank_account_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    bank_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cac_number: Mapped[str | None] = mapped_column(String(50), nullable=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus), nullable=False, default=VerificationStatus.PENDING
    )
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    rejection_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="seller_profile")
    products: Mapped[list["Product"]] = relationship("Product", back_populates="seller")
    seller_warehouses: Mapped[list["SellerWarehouse"]] = relationship("SellerWarehouse", back_populates="seller")
