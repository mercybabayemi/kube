import uuid

from fastapi import APIRouter

from app.core.dependencies import CurrentUser, DBSession
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.services import order_service

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(data: OrderCreate, current_user: CurrentUser, db: DBSession):
    return order_service.create_order(db, current_user.id, data)


@router.get("/", response_model=list[OrderResponse])
def my_orders(current_user: CurrentUser, db: DBSession):
    return order_service.get_buyer_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return order_service.get_order(db, order_id, current_user.id)


@router.patch("/{order_id}/confirm-receipt", response_model=OrderResponse)
def confirm_receipt(order_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return order_service.confirm_receipt(db, order_id, current_user.id)
