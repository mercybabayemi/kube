import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.qc import QCInspection
    from app.models.user import Seller


class Warehouse(Base):
    __tablename__ = "warehouses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    manager_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    inspections: Mapped[list["QCInspection"]] = relationship("QCInspection", back_populates="warehouse")
    seller_warehouses: Mapped[list["SellerWarehouse"]] = relationship("SellerWarehouse", back_populates="warehouse")


class SellerWarehouse(Base):
    __tablename__ = "seller_warehouses"

    seller_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("sellers.user_id"), primary_key=True)
    warehouse_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("warehouses.id"), primary_key=True)

    seller: Mapped["Seller"] = relationship("Seller", back_populates="seller_warehouses")
    warehouse: Mapped["Warehouse"] = relationship("Warehouse", back_populates="seller_warehouses")
