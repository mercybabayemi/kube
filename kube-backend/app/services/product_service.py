import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.product import Product, Category
from app.models.enums import VerificationStatus
from app.schemas.product import ProductCreate, ProductUpdate


def get_products(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    category_id: uuid.UUID | None = None,
    condition: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    search: str | None = None,
) -> dict:
    query = db.query(Product).filter(
        Product.is_active == True,
        Product.verification_status == VerificationStatus.APPROVED,
        Product.stock_qty > 0,
    )

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if condition:
        query = query.filter(Product.condition == condition)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))

    total = query.count()
    items = query.order_by(Product.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    return {"items": items, "total": total, "page": page, "page_size": page_size}


def get_product_by_id(db: Session, product_id: uuid.UUID) -> Product:
    product = db.get(Product, product_id)
    if not product or not product.is_active:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


def create_product(db: Session, seller_id: uuid.UUID, data: ProductCreate) -> Product:
    category = db.get(Category, data.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    product = Product(
        seller_id=seller_id,
        category_id=data.category_id,
        title=data.title,
        description=data.description,
        condition=data.condition,
        price=data.price,
        stock_qty=data.stock_qty,
        images=data.images,
        verification_status=VerificationStatus.PENDING,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: uuid.UUID, seller_id: uuid.UUID, data: ProductUpdate) -> Product:
    product = db.get(Product, product_id)
    if not product or str(product.seller_id) != str(seller_id):
        raise HTTPException(status_code=404, detail="Product not found or not yours")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def get_categories(db: Session) -> list[Category]:
    return db.query(Category).filter(Category.parent_id == None).all()


def get_seller_products(db: Session, seller_id: uuid.UUID) -> list[Product]:
    return db.query(Product).filter(Product.seller_id == seller_id).all()


def approve_product(db: Session, product_id: uuid.UUID) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.verification_status = VerificationStatus.APPROVED
    db.commit()
    db.refresh(product)
    return product


def reject_product(db: Session, product_id: uuid.UUID) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.verification_status = VerificationStatus.REJECTED
    product.is_active = False
    db.commit()
    db.refresh(product)
    return product
