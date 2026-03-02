import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, DateTime, Numeric, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import PaymentStatus, PaymentGateway

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.refund import Refund


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    commission_deducted: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    seller_payout: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    gateway: Mapped[PaymentGateway] = mapped_column(Enum(PaymentGateway), nullable=False, default=PaymentGateway.PAYSTACK)
    gateway_reference: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    paystack_access_code: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="payment")
    refund: Mapped["Refund | None"] = relationship("Refund", back_populates="payment", uselist=False)
