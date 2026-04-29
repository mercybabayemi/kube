"""
OTP storage backed by Redis with an in-memory fallback for local dev
(when Redis is not running).
"""
import time
from typing import Optional

import redis

from app.config import settings

_redis: Optional[redis.Redis] = None
_redis_ok: bool = True  # becomes False once a connection error is detected

# In-memory fallback: {key: (otp, expiry_timestamp)}
_memory_store: dict[str, tuple[str, float]] = {}


def _get_redis() -> Optional[redis.Redis]:
    global _redis, _redis_ok
    if not _redis_ok:
        return None
    if _redis is None:
        try:
            # Short timeout for connection
            _redis = redis.from_url(
                settings.REDIS_URL, 
                decode_responses=True,
                socket_connect_timeout=2,
                socket_timeout=2
            )
        except Exception:
            _redis_ok = False
            return None
    return _redis


def _redis_available(r: Optional[redis.Redis]) -> bool:
    global _redis_ok
    if r is None:
        return False
    try:
        # Use a short timeout for the ping
        r.ping()
        return True
    except Exception:
        _redis_ok = False
        return False


def set_otp(key: str, otp: str) -> None:
    """Store OTP under `key` (email or phone)."""
    r = _get_redis()
    if _redis_available(r):
        try:
            r.setex(f"otp:{key}", settings.OTP_EXPIRE_SECONDS, otp)
            return
        except Exception:
            pass
    # Fallback to memory
    _memory_store[f"otp:{key}"] = (otp, time.time() + settings.OTP_EXPIRE_SECONDS)


def get_otp(key: str) -> Optional[str]:
    """Retrieve OTP stored under `key`."""
    r = _get_redis()
    if _redis_available(r):
        try:
            return r.get(f"otp:{key}")
        except Exception:
            pass
    # Fallback to memory
    entry = _memory_store.get(f"otp:{key}")
    if entry and time.time() < entry[1]:
        return entry[0]
    _memory_store.pop(f"otp:{key}", None)
    return None


def delete_otp(key: str) -> None:
    """Delete OTP stored under `key`."""
    r = _get_redis()
    if _redis_available(r):
        try:
            r.delete(f"otp:{key}")
        except Exception:
            pass
    _memory_store.pop(f"otp:{key}", None)
