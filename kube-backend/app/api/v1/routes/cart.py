"""
Cart is managed client-side (localStorage/Zustand store).
This route exists as a stub for future server-side cart persistence.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_cart():
    return {"message": "Cart is managed client-side. Use POST /orders to checkout."}
