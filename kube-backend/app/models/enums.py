import enum


class UserRole(str, enum.Enum):
    BUYER = "BUYER"
    SELLER = "SELLER"
    QC_OFFICER = "QC_OFFICER"
    DELIVERY_OFFICER = "DELIVERY_OFFICER"
    ADMIN = "ADMIN"


class VerificationStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ProductCondition(str, enum.Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    FAIR = "FAIR"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    SELLER_NOTIFIED = "SELLER_NOTIFIED"
    SHIPPED_TO_QC = "SHIPPED_TO_QC"
    QC_IN_PROGRESS = "QC_IN_PROGRESS"
    QC_PASSED = "QC_PASSED"
    QC_FAILED = "QC_FAILED"
    REPAIR_IN_PROGRESS = "REPAIR_IN_PROGRESS"
    DISPATCHED = "DISPATCHED"
    DELIVERED = "DELIVERED"
    CONFIRMED = "CONFIRMED"
    RETURN_REQUESTED = "RETURN_REQUESTED"
    RETURNED = "RETURNED"
    REFUNDED = "REFUNDED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    HELD = "HELD"
    AWAITING_RELEASE = "AWAITING_RELEASE"
    RELEASED = "RELEASED"
    REFUNDED = "REFUNDED"
    FAILED = "FAILED"


class PaymentGateway(str, enum.Enum):
    PAYSTACK = "PAYSTACK"
    MONNIFY = "MONNIFY"


class QCStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    PASSED = "PASSED"
    FAILED = "FAILED"
    REPAIR_NEEDED = "REPAIR_NEEDED"
    REPAIRED = "REPAIRED"
    READY_TO_SHIP = "READY_TO_SHIP"


class ShipmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    PICKED_UP = "PICKED_UP"
    EN_ROUTE = "EN_ROUTE"
    DELIVERED = "DELIVERED"


class ReturnStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    PICKED_UP = "PICKED_UP"
    AT_WAREHOUSE = "AT_WAREHOUSE"
    RESHIPPED = "RESHIPPED"
    RESOLVED = "RESOLVED"


class ReturnResolutionType(str, enum.Enum):
    REPAIR = "REPAIR"
    REPLACEMENT = "REPLACEMENT"
    REFUND = "REFUND"


class RefundStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"
    FAILED = "FAILED"
