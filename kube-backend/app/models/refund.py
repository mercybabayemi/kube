import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import RefundStatus

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.payment import Payment
    from app.models.return_model import Return


class Refund(Base):
    __tablename__ = "refunds"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    payment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=False)
    return_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("returns.id"), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    logistics_deduction: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    net_refund: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[RefundStatus] = mapped_column(Enum(RefundStatus), nullable=False, default=RefundStatus.PENDING)
    gateway_reference: Mapped[str | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    payment: Mapped["Payment"] = relationship("Payment", back_populates="refund")
    return_request: Mapped["Return | None"] = relationship("Return", back_populates="refund")
