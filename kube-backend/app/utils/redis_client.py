import redis

from app.config import settings

_redis = None


def get_redis() -> redis.Redis:
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis


def set_otp(phone: str, otp: str) -> None:
    r = get_redis()
    r.setex(f"otp:{phone}", settings.OTP_EXPIRE_SECONDS, otp)


def get_otp(phone: str) -> str | None:
    r = get_redis()
    return r.get(f"otp:{phone}")


def delete_otp(phone: str) -> None:
    r = get_redis()
    r.delete(f"otp:{phone}")
