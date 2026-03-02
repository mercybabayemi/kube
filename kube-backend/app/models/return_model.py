import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import ReturnStatus, ReturnResolutionType

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.user import User
    from app.models.refund import Refund


class Return(Base):
    __tablename__ = "returns"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), unique=True, nullable=False)
    buyer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ReturnStatus] = mapped_column(Enum(ReturnStatus), nullable=False, default=ReturnStatus.REQUESTED)
    resolution_type: Mapped[ReturnResolutionType | None] = mapped_column(Enum(ReturnResolutionType), nullable=True)
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="return_request")
    buyer: Mapped["User"] = relationship("User", back_populates="returns")
    refund: Mapped["Refund | None"] = relationship("Refund", back_populates="return_request", uselist=False)
