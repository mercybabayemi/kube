from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User, Seller
from app.models.enums import UserRole, VerificationStatus
from app.schemas.auth import RegisterRequest, LoginRequest, SellerApplyRequest
from app.utils.helpers import generate_otp
from app.utils.redis_client import set_otp, get_otp, delete_otp
from app.utils.email_sender import send_otp_email
from fastapi import HTTPException, status


def register_buyer(db: Session, data: RegisterRequest) -> User:
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    if db.query(User).filter(User.email == data.email).first():
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

    # Send OTP to the email address provided
    _send_otp_to_email(data.email)
    return user


def apply_as_seller(db: Session, data: SellerApplyRequest) -> User:
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    if data.email and db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

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

    if data.email:
        _send_otp_to_email(data.email)
    return user


def login_user(db: Session, data: LoginRequest) -> dict:
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")
    if not user.email_verified:
        raise HTTPException(status_code=403, detail="Email not verified. Please verify your OTP first.")

    return {
        "access_token": create_access_token(str(user.id), user.role.value),
        "refresh_token": create_refresh_token(str(user.id)),
    }


def verify_otp_by_email(db: Session, email: str, otp: str) -> dict:
    """Verify OTP sent to email, mark user verified, return auth tokens."""
    stored = get_otp(email)
    if not stored or stored != otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email_verified = True  # renaming flag to email_verified
    db.commit()
    delete_otp(email)

    return {
        "access_token": create_access_token(str(user.id), user.role.value),
        "refresh_token": create_refresh_token(str(user.id)),
    }


def verify_otp(db: Session, phone: str, otp: str) -> bool:
    """Legacy phone-based OTP verify (kept for backward compatibility)."""
    stored = get_otp(phone)
    if not stored or stored != otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email_verified = True
    db.commit()
    delete_otp(phone)
    return True


def resend_otp(email: str) -> bool:
    return _send_otp_to_email(email)


def refresh_tokens(refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = payload.get("sub")
    return {
        "access_token": create_access_token(user_id, "BUYER"),
        "refresh_token": create_refresh_token(user_id),
    }


def _send_otp_to_email(email: str) -> bool:
    otp = generate_otp()
    set_otp(email, otp)
    return send_otp_email(email, otp)
