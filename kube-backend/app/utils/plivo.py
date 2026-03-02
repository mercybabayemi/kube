import plivo

from app.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = plivo.RestClient(settings.PLIVO_AUTH_ID, settings.PLIVO_AUTH_TOKEN)
    return _client


def send_otp(phone: str, otp: str) -> bool:
    """Send OTP via Plivo SMS. Returns True on success."""
    if not settings.PLIVO_AUTH_ID:
        # Dev mode: just print the OTP
        print(f"[DEV] OTP for {phone}: {otp}")
        return True
    try:
        client = _get_client()
        client.messages.create(
            src=settings.PLIVO_SENDER_ID,
            dst=phone,
            text=f"Your Kube verification code is: {otp}. Valid for 5 minutes. Do not share this code.",
        )
        return True
    except Exception as e:
        print(f"Failed to send OTP to {phone}: {e}")
        return False
