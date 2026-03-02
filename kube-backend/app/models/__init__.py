# Import all models so SQLAlchemy can register them for Alembic
from app.models.user import User, Seller  # noqa: F401
from app.models.product import Product, Category  # noqa: F401
from app.models.order import Order, OrderItem  # noqa: F401
from app.models.payment import Payment  # noqa: F401
from app.models.qc import QCInspection  # noqa: F401
from app.models.delivery import Shipment  # noqa: F401
from app.models.return_model import Return  # noqa: F401
from app.models.refund import Refund  # noqa: F401
from app.models.review import Review  # noqa: F401
from app.models.warehouse import Warehouse, SellerWarehouse  # noqa: F401
