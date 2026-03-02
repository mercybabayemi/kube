import uuid

from fastapi import APIRouter, Depends

from app.core.dependencies import DBSession, CurrentUser, require_role
from app.models.enums import UserRole
from app.schemas.delivery import ShipmentResponse, DeliveryConfirmRequest
from app.services import delivery_service

router = APIRouter()

DeliveryOnly = Depends(require_role(UserRole.DELIVERY_OFFICER))


@router.get("/assignments", response_model=list[ShipmentResponse], dependencies=[DeliveryOnly])
def my_assignments(current_user: CurrentUser, db: DBSession):
    return delivery_service.get_delivery_assignments(db, current_user.id)


@router.get("/pending", response_model=list[ShipmentResponse], dependencies=[DeliveryOnly])
def pending_shipments(db: DBSession):
    return delivery_service.get_pending_shipments(db)


@router.patch("/{shipment_id}/assign", response_model=ShipmentResponse, dependencies=[DeliveryOnly])
def assign_to_me(shipment_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return delivery_service.assign_shipment(db, shipment_id, current_user.id)


@router.patch("/{shipment_id}/pickup", response_model=ShipmentResponse, dependencies=[DeliveryOnly])
def pickup(shipment_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return delivery_service.pickup_shipment(db, shipment_id, current_user.id)


@router.patch("/{shipment_id}/en-route", response_model=ShipmentResponse, dependencies=[DeliveryOnly])
def en_route(shipment_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return delivery_service.mark_en_route(db, shipment_id, current_user.id)


@router.patch("/{shipment_id}/delivered", response_model=ShipmentResponse, dependencies=[DeliveryOnly])
def delivered(shipment_id: uuid.UUID, data: DeliveryConfirmRequest, current_user: CurrentUser, db: DBSession):
    return delivery_service.confirm_delivery(db, shipment_id, current_user.id, data.otp)
