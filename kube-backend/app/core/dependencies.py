import uuid
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.security import decode_token
from app.database import get_db
from app.models.enums import UserRole
from app.models.user import User

# auto_error=False means FastAPI won't throw 403 when no token is sent.
# We handle the missing token ourselves and raise 401 instead.
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user_id = payload.get("sub")
    user = db.get(User, uuid.UUID(user_id))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_role(*roles: UserRole):
    def role_checker(current_user: CurrentUser) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[r.value for r in roles]}",
            )
        return current_user
    return role_checker


def get_current_admin(current_user: CurrentUser) -> User:
    return require_role(UserRole.ADMIN)(current_user)

def get_current_seller(current_user: CurrentUser) -> User:
    return require_role(UserRole.SELLER)(current_user)

def get_current_qc_officer(current_user: CurrentUser) -> User:
    return require_role(UserRole.QC_OFFICER)(current_user)

def get_current_delivery_officer(current_user: CurrentUser) -> User:
    return require_role(UserRole.DELIVERY_OFFICER)(current_user)


AdminUser = Annotated[User, Depends(get_current_admin)]
SellerUser = Annotated[User, Depends(get_current_seller)]
QCUser = Annotated[User, Depends(get_current_qc_officer)]
DeliveryUser = Annotated[User, Depends(get_current_delivery_officer)]
DBSession = Annotated[Session, Depends(get_db)]
