import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, DateTime, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import ShipmentStatus

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.user import User


class Shipment(Base):
    __tablename__ = "shipments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    delivery_officer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    tracking_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    status: Mapped[ShipmentStatus] = mapped_column(Enum(ShipmentStatus), nullable=False, default=ShipmentStatus.PENDING)
    delivery_otp: Mapped[str | None] = mapped_column(String(6), nullable=True)
    dispatched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    order: Mapped["Order"] = relationship("Order", back_populates="shipment")
    delivery_officer: Mapped["User | None"] = relationship(
        "User", back_populates="shipments", foreign_keys=[delivery_officer_id]
    )
