import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import QCStatus

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product import Product
    from app.models.user import User
    from app.models.warehouse import Warehouse


class QCInspection(Base):
    __tablename__ = "qc_inspections"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    officer_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    warehouse_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("warehouses.id"), nullable=True)
    status: Mapped[QCStatus] = mapped_column(Enum(QCStatus), nullable=False, default=QCStatus.PENDING)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    repair_details: Mapped[str | None] = mapped_column(Text, nullable=True)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    inspected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ready_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="qc_inspection")
    product: Mapped["Product"] = relationship("Product")
    officer: Mapped["User | None"] = relationship("User", back_populates="qc_inspections", foreign_keys=[officer_id])
    warehouse: Mapped["Warehouse | None"] = relationship("Warehouse", back_populates="inspections")
