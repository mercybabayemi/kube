import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import VerificationStatus, ReturnResolutionType


class SellerApprovalRequest(BaseModel):
    rejection_reason: str | None = None


class SellerAdminResponse(BaseModel):
    user_id: uuid.UUID
    business_name: str
    bank_account_number: str | None
    bank_name: str | None
    cac_number: str | None
    verification_status: VerificationStatus
    rating: float
    approved_at: datetime | None

    model_config = {"from_attributes": True}


class DisputeResolutionRequest(BaseModel):
    resolution_type: ReturnResolutionType
    logistics_deduction: float = 0
    admin_notes: str | None = None


class AdminDashboardStats(BaseModel):
    total_revenue_month: float
    active_orders: int
    pending_payouts: int
    open_disputes: int
    pending_seller_applications: int


class AdminReportResponse(BaseModel):
    total_orders: int
    total_revenue: float
    total_commission: float
    total_payouts: float
    pending_payouts: float
