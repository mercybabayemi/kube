from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import CurrentUser, DBSession
from app.core.security import decode_token
from app.database import get_db
from app.schemas.auth import (
    RegisterRequest, LoginRequest, OTPVerifyRequest, OTPResendRequest,
    SellerApplyRequest, TokenResponse, RefreshRequest, UserResponse,
)
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
def register(data: RegisterRequest, db: DBSession):
    user = auth_service.register_buyer(db, data)
    return user


@router.post("/seller/apply", response_model=UserResponse, status_code=201)
def seller_apply(data: SellerApplyRequest, db: DBSession):
    user = auth_service.apply_as_seller(db, data)
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: DBSession):
    tokens = auth_service.login_user(db, data)
    return tokens


@router.post("/otp/verify")
def verify_otp(data: OTPVerifyRequest, db: DBSession):
    auth_service.verify_otp(db, data.phone, data.otp)
    return {"message": "Phone verified successfully"}


@router.post("/otp/resend")
def resend_otp(data: OTPResendRequest):
    auth_service.resend_otp(data.phone)
    return {"message": "OTP sent"}


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest):
    tokens = auth_service.refresh_tokens(data.refresh_token)
    return tokens


@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser):
    return current_user
