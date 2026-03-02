"""Seed initial data: categories + admin user."""
import uuid
from app.database import SessionLocal
from app.models.user import User
from app.models.product import Category
from app.models.enums import UserRole
from app.core.security import hash_password

db = SessionLocal()

# ── Categories ──────────────────────────────────────────────────────────────
root_categories = [
    "Phones & Tablets",
    "Laptops & Computers",
    "Home Appliances",
    "Audio & Accessories",
    "Cameras & Photography",
    "Gaming",
    "Fashion",
    "Other Electronics",
]

existing = {c.name for c in db.query(Category).all()}
for name in root_categories:
    if name not in existing:
        db.add(Category(id=str(uuid.uuid4()), name=name, slug=name.lower().replace(" ", "-").replace("&", "and")))

db.flush()

# ── Admin user ───────────────────────────────────────────────────────────────
ADMIN_EMAIL = "admin@kube.ng"
ADMIN_PHONE = "+2348000000000"
ADMIN_PASSWORD = "Admin1234!"

admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if not admin:
    admin = User(
        name="Kube Admin",
        email=ADMIN_EMAIL,
        phone=ADMIN_PHONE,
        password_hash=hash_password(ADMIN_PASSWORD),
        role=UserRole.ADMIN,
        phone_verified=True,
        is_active=True,
    )
    db.add(admin)
    print(f"Admin created → {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
else:
    print("Admin already exists")

db.commit()
db.close()
print("Seed complete.")
