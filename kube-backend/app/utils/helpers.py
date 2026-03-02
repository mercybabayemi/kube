import random
import string
import uuid
from datetime import datetime


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def generate_order_number() -> str:
    year = datetime.now().year
    suffix = "".join(random.choices(string.digits, k=5))
    return f"KUB-{year}-{suffix}"


def generate_tracking_number() -> str:
    return "SHP-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


def generate_delivery_otp() -> str:
    return "".join(random.choices(string.digits, k=6))
