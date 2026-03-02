import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.delivery import Shipment
from app.models.enums import ShipmentStatus, OrderStatus


def get_delivery_assignments(db: Session, officer_id: uuid.UUID) -> list[Shipment]:
    return (
        db.query(Shipment)
        .filter(Shipment.delivery_officer_id == officer_id)
        .order_by(Shipment.created_at.desc())
        .all()
    )


def get_pending_shipments(db: Session) -> list[Shipment]:
    return db.query(Shipment).filter(Shipment.status == ShipmentStatus.PENDING).all()


def assign_shipment(db: Session, shipment_id: uuid.UUID, officer_id: uuid.UUID) -> Shipment:
    shipment = db.get(Shipment, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    shipment.delivery_officer_id = officer_id
    db.commit()
    db.refresh(shipment)
    return shipment


def pickup_shipment(db: Session, shipment_id: uuid.UUID, officer_id: uuid.UUID) -> Shipment:
    shipment = _get_shipment(db, shipment_id, officer_id)
    if shipment.status != ShipmentStatus.PENDING:
        raise HTTPException(status_code=400, detail="Shipment already picked up")
    shipment.status = ShipmentStatus.PICKED_UP
    shipment.dispatched_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(shipment)
    return shipment


def mark_en_route(db: Session, shipment_id: uuid.UUID, officer_id: uuid.UUID) -> Shipment:
    shipment = _get_shipment(db, shipment_id, officer_id)
    shipment.status = ShipmentStatus.EN_ROUTE
    db.commit()
    db.refresh(shipment)
    return shipment


def confirm_delivery(db: Session, shipment_id: uuid.UUID, officer_id: uuid.UUID, otp: str) -> Shipment:
    shipment = _get_shipment(db, shipment_id, officer_id)
    if shipment.delivery_otp != otp:
        raise HTTPException(status_code=400, detail="Invalid delivery OTP")
    shipment.status = ShipmentStatus.DELIVERED
    shipment.delivered_at = datetime.now(timezone.utc)
    shipment.order.status = OrderStatus.DELIVERED
    db.commit()
    db.refresh(shipment)
    return shipment


def _get_shipment(db: Session, shipment_id: uuid.UUID, officer_id: uuid.UUID) -> Shipment:
    shipment = db.get(Shipment, shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    if shipment.delivery_officer_id and str(shipment.delivery_officer_id) != str(officer_id):
        raise HTTPException(status_code=403, detail="Not your shipment")
    return shipment
