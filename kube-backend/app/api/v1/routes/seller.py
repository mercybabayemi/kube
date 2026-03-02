import uuid

from fastapi import APIRouter, Depends

from app.core.dependencies import DBSession, CurrentUser, require_role
from app.models.enums import UserRole
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.schemas.order import OrderResponse
from app.services import product_service, order_service

router = APIRouter()

SellerOnly = Depends(require_role(UserRole.SELLER))


@router.get("/products", response_model=list[ProductResponse], dependencies=[SellerOnly])
def my_products(current_user: CurrentUser, db: DBSession):
    return product_service.get_seller_products(db, current_user.id)


@router.post("/products", response_model=ProductResponse, status_code=201, dependencies=[SellerOnly])
def add_product(data: ProductCreate, current_user: CurrentUser, db: DBSession):
    return product_service.create_product(db, current_user.id, data)


@router.patch("/products/{product_id}", response_model=ProductResponse, dependencies=[SellerOnly])
def update_product(product_id: uuid.UUID, data: ProductUpdate, current_user: CurrentUser, db: DBSession):
    return product_service.update_product(db, product_id, current_user.id, data)


@router.get("/orders", response_model=list[OrderResponse], dependencies=[SellerOnly])
def seller_orders(current_user: CurrentUser, db: DBSession):
    return order_service.get_seller_orders(db, current_user.id)


@router.patch("/orders/{order_id}/ship-to-qc", response_model=OrderResponse, dependencies=[SellerOnly])
def ship_to_qc(order_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return order_service.seller_ship_to_qc(db, order_id, current_user.id)
