import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.qc import QCInspection
from app.models.order import Order
from app.models.delivery import Shipment
from app.models.enums import QCStatus, OrderStatus, ShipmentStatus
from app.utils.helpers import generate_tracking_number, generate_delivery_otp


def get_qc_assignments(db: Session, officer_id: uuid.UUID) -> list[QCInspection]:
    return (
        db.query(QCInspection)
        .filter(QCInspection.officer_id == officer_id)
        .order_by(QCInspection.received_at.asc())
        .all()
    )


def get_pending_inspections(db: Session) -> list[QCInspection]:
    return (
        db.query(QCInspection)
        .filter(QCInspection.status.in_([QCStatus.PENDING, QCStatus.IN_PROGRESS]))
        .all()
    )


def assign_inspection(db: Session, inspection_id: uuid.UUID, officer_id: uuid.UUID) -> QCInspection:
    inspection = db.get(QCInspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    inspection.officer_id = officer_id
    db.commit()
    db.refresh(inspection)
    return inspection


def start_inspection(db: Session, inspection_id: uuid.UUID, officer_id: uuid.UUID) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.officer_id = officer_id
    inspection.status = QCStatus.IN_PROGRESS
    inspection.inspected_at = datetime.now(timezone.utc)
    inspection.order.status = OrderStatus.QC_IN_PROGRESS
    db.commit()
    db.refresh(inspection)
    return inspection


def pass_inspection(db: Session, inspection_id: uuid.UUID, notes: str | None = None) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.status = QCStatus.PASSED
    if notes:
        inspection.notes = notes
    inspection.order.status = OrderStatus.QC_PASSED
    db.commit()
    db.refresh(inspection)
    return inspection


def fail_inspection(db: Session, inspection_id: uuid.UUID, notes: str, repair_details: str | None = None) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.status = QCStatus.FAILED
    inspection.notes = notes
    inspection.order.status = OrderStatus.QC_FAILED
    db.commit()
    db.refresh(inspection)
    return inspection


def log_repair(db: Session, inspection_id: uuid.UUID, repair_details: str) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.status = QCStatus.REPAIR_NEEDED
    inspection.repair_details = repair_details
    inspection.order.status = OrderStatus.REPAIR_IN_PROGRESS
    db.commit()
    db.refresh(inspection)
    return inspection


def mark_repaired(db: Session, inspection_id: uuid.UUID) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.status = QCStatus.REPAIRED
    db.commit()
    db.refresh(inspection)
    return inspection


def mark_ready_to_ship(db: Session, inspection_id: uuid.UUID) -> QCInspection:
    inspection = _get_inspection(db, inspection_id)
    inspection.status = QCStatus.READY_TO_SHIP
    inspection.ready_at = datetime.now(timezone.utc)
    inspection.order.status = OrderStatus.DISPATCHED

    # Create shipment
    shipment = Shipment(
        order_id=inspection.order_id,
        tracking_number=generate_tracking_number(),
        status=ShipmentStatus.PENDING,
        delivery_otp=generate_delivery_otp(),
    )
    db.add(shipment)
    db.commit()
    db.refresh(inspection)
    return inspection


def _get_inspection(db: Session, inspection_id: uuid.UUID) -> QCInspection:
    inspection = db.get(QCInspection, inspection_id)
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return inspection
