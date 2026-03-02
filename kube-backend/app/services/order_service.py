import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.payment import Payment
from app.models.qc import QCInspection
from app.models.delivery import Shipment
from app.models.enums import OrderStatus, PaymentStatus, QCStatus, ShipmentStatus
from app.schemas.order import OrderCreate
from app.utils.helpers import generate_order_number, generate_tracking_number, generate_delivery_otp

DELIVERY_FEE = 3500.0


def create_order(db: Session, buyer_id: uuid.UUID, data: OrderCreate) -> Order:
    total = 0.0
    order_items = []

    for item_input in data.items:
        product = db.get(Product, item_input.product_id)
        if not product or product.stock_qty < item_input.quantity:
            raise HTTPException(status_code=400, detail=f"Product {item_input.product_id} unavailable or insufficient stock")
        total += float(product.price) * item_input.quantity
        order_items.append((product, item_input.quantity))

    order = Order(
        order_number=generate_order_number(),
        buyer_id=buyer_id,
        status=OrderStatus.PENDING,
        total_amount=total,
        delivery_fee=DELIVERY_FEE,
        delivery_address=data.delivery_address,
        delivery_name=data.delivery_name,
        delivery_phone=data.delivery_phone,
        notes=data.notes,
    )
    db.add(order)
    db.flush()

    for product, qty in order_items:
        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=float(product.price),
        )
        db.add(item)
        product.stock_qty -= qty

    payment = Payment(
        order_id=order.id,
        amount=total + DELIVERY_FEE,
        status=PaymentStatus.PENDING,
    )
    db.add(payment)
    db.commit()
    db.refresh(order)
    return order


def get_buyer_orders(db: Session, buyer_id: uuid.UUID) -> list[Order]:
    return db.query(Order).filter(Order.buyer_id == buyer_id).order_by(Order.created_at.desc()).all()


def get_order(db: Session, order_id: uuid.UUID, buyer_id: uuid.UUID | None = None) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if buyer_id and str(order.buyer_id) != str(buyer_id):
        raise HTTPException(status_code=403, detail="Access denied")
    return order


def seller_ship_to_qc(db: Session, order_id: uuid.UUID, seller_id: uuid.UUID) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Verify the order contains a product from this seller
    seller_items = [i for i in order.items if str(i.product.seller_id) == str(seller_id)]
    if not seller_items:
        raise HTTPException(status_code=403, detail="Not your order")

    if order.status != OrderStatus.SELLER_NOTIFIED:
        raise HTTPException(status_code=400, detail=f"Order is in {order.status} state, cannot ship to QC")

    order.status = OrderStatus.SHIPPED_TO_QC

    # Create QC inspections for each item
    for item in seller_items:
        inspection = QCInspection(
            order_id=order.id,
            product_id=item.product_id,
            status=QCStatus.PENDING,
        )
        db.add(inspection)

    db.commit()
    db.refresh(order)
    return order


def confirm_receipt(db: Session, order_id: uuid.UUID, buyer_id: uuid.UUID) -> Order:
    order = get_order(db, order_id, buyer_id)
    if order.status != OrderStatus.DELIVERED:
        raise HTTPException(status_code=400, detail="Order has not been delivered yet")

    order.status = OrderStatus.CONFIRMED
    if order.payment:
        order.payment.status = PaymentStatus.AWAITING_RELEASE
    db.commit()
    db.refresh(order)
    return order


def get_seller_orders(db: Session, seller_id: uuid.UUID) -> list[Order]:
    return (
        db.query(Order)
        .join(OrderItem)
        .join(Product)
        .filter(Product.seller_id == seller_id)
        .distinct()
        .order_by(Order.created_at.desc())
        .all()
    )


def get_all_orders(db: Session, status: OrderStatus | None = None, page: int = 1, page_size: int = 20) -> dict:
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    total = query.count()
    items = query.order_by(Order.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": items, "total": total}
