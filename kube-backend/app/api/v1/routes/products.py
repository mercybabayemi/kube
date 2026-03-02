import uuid

from fastapi import APIRouter, Query

from app.core.dependencies import DBSession
from app.schemas.product import ProductResponse, ProductListResponse, CategoryResponse
from app.services import product_service

router = APIRouter()


@router.get("/", response_model=ProductListResponse)
def list_products(
    db: DBSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_id: uuid.UUID | None = None,
    condition: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    search: str | None = None,
):
    return product_service.get_products(db, page, page_size, category_id, condition, min_price, max_price, search)


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(db: DBSession):
    return product_service.get_categories(db)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: uuid.UUID, db: DBSession):
    return product_service.get_product_by_id(db, product_id)
