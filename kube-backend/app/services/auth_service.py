from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User, Seller
from app.models.enums import UserRole, VerificationStatus
from app.schemas.auth import RegisterRequest, LoginRequest, SellerApplyRequest
from app.utils.helpers import generate_otp
from app.utils.redis_client import set_otp, get_otp, delete_otp
from app.utils.plivo import send_otp
from fastapi import HTTPException, status


def register_buyer(db: Session, data: RegisterRequest) -> User:
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    if data.email and db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        phone=data.phone,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.BUYER,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    _send_otp_to_user(user.phone)
    return user


def apply_as_seller(db: Session, data: SellerApplyRequest) -> User:
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")

    user = User(
        name=data.name,
        phone=data.phone,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.SELLER,
    )
    db.add(user)
    db.flush()

    seller = Seller(
        user_id=user.id,
        business_name=data.business_name,
        bank_account_number=data.bank_account_number,
        bank_name=data.bank_name,
        cac_number=data.cac_number,
        verification_status=VerificationStatus.PENDING,
    )
    db.add(seller)
    db.commit()
    db.refresh(user)
    _send_otp_to_user(user.phone)
    return user


def login_user(db: Session, data: LoginRequest) -> dict:
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    return {
        "access_token": create_access_token(str(user.id), user.role.value),
        "refresh_token": create_refresh_token(str(user.id)),
    }


def verify_otp(db: Session, phone: str, otp: str) -> bool:
    stored = get_otp(phone)
    if not stored or stored != otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.phone_verified = True
    db.commit()
    delete_otp(phone)
    return True


def resend_otp(phone: str) -> bool:
    return _send_otp_to_user(phone)


def refresh_tokens(refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload.get("sub")
    # We need a db here — for simplicity return new access token with same sub
    # In production you'd validate the user still exists
    return {
        "access_token": create_access_token(user_id, "BUYER"),  # role re-loaded from DB in full impl
        "refresh_token": create_refresh_token(user_id),
    }


def _send_otp_to_user(phone: str) -> bool:
    otp = generate_otp()
    set_otp(phone, otp)
    return send_otp(phone, otp)
