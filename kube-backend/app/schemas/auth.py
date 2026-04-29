import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator
import re


class RegisterRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr  # now REQUIRED — OTP is sent here
    password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "").replace("-", "")
        if not re.match(r"^\+?[0-9]{10,15}$", v):
            raise ValueError("Invalid phone number format")
        # Normalise Nigerian numbers to +234
        if v.startswith("0") and len(v) == 11:
            v = "+234" + v[1:]
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ----- OTP via Email -----

class OTPEmailVerifyRequest(BaseModel):
    email: EmailStr
    otp: str


class OTPEmailResendRequest(BaseModel):
    email: EmailStr


# ----- OTP via Phone (legacy) -----

class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str


class OTPResendRequest(BaseModel):
    phone: str


class SellerApplyRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr | None = None
    password: str
    business_name: str
    bank_account_number: str | None = None
    bank_name: str | None = None
    cac_number: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip().replace(" ", "").replace("-", "")
        if not re.match(r"^\+?[0-9]{10,15}$", v):
            raise ValueError("Invalid phone number format")
        if v.startswith("0") and len(v) == 11:
            v = "+234" + v[1:]
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    email: str | None
    role: str
    email_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}
