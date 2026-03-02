import uuid

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.return_model import Return
from app.models.enums import ReturnStatus, OrderStatus


def create_return(db: Session, buyer_id: uuid.UUID, order_id: uuid.UUID, reason: str, description: str | None) -> Return:
    from app.models.order import Order
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if str(order.buyer_id) != str(buyer_id):
        raise HTTPException(status_code=403, detail="Not your order")
    if order.status not in [OrderStatus.DELIVERED, OrderStatus.CONFIRMED]:
        raise HTTPException(status_code=400, detail="Order must be delivered before requesting a return")
    if order.return_request:
        raise HTTPException(status_code=400, detail="Return already requested for this order")

    return_req = Return(
        order_id=order_id,
        buyer_id=buyer_id,
        reason=reason,
        description=description,
        status=ReturnStatus.REQUESTED,
    )
    order.status = OrderStatus.RETURN_REQUESTED
    db.add(return_req)
    db.commit()
    db.refresh(return_req)
    return return_req


def get_buyer_returns(db: Session, buyer_id: uuid.UUID) -> list[Return]:
    return db.query(Return).filter(Return.buyer_id == buyer_id).all()


def get_all_returns(db: Session) -> list[Return]:
    return db.query(Return).order_by(Return.created_at.desc()).all()
