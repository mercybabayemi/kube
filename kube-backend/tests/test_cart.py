"""
tests/test_cart.py

Cart is managed client-side via Zustand.
The backend /cart endpoint exists but returns a message, not cart data.
These tests verify the actual backend behaviour.
"""
from unittest.mock import patch
import pytest


def register_and_login(client, phone="08044000001", password="pass1234", name="Cart User"):
    with patch("app.services.auth_service._send_otp_to_user", return_value=True):
        client.post("/api/v1/auth/register", json={
            "name": name, "phone": phone, "password": password,
        })
    resp = client.post("/api/v1/auth/login", json={
        "phone": f"+234{phone[1:]}", "password": password,
    })
    return resp.json().get("access_token")


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ── Cart is client-side ─────────────────────────────────────────────────────────

def test_cart_endpoint_exists(client):
    """GET /cart exists and responds — cart is client-side."""
    resp = client.get("/api/v1/cart")
    assert resp.status_code == 200


def test_cart_returns_message(client):
    """Cart endpoint returns the client-side redirect message."""
    resp = client.get("/api/v1/cart")
    data = resp.json()
    assert "message" in data


def test_cart_post_not_allowed(client):
    """POST to /cart is not implemented — cart is client-side."""
    resp = client.post("/api/v1/cart", json={"product_id": 1, "quantity": 1})
    assert resp.status_code == 405


def test_cart_delete_nonexistent_item(client):
    """DELETE /cart/{id} with non-existent ID returns 404."""
    resp = client.delete("/api/v1/cart/999999")
    assert resp.status_code == 404


def test_cart_authenticated_same_behaviour(client):
    """Auth does not change cart response — cart is always client-side."""
    token = register_and_login(client, phone="08044000002")
    if not token:
        pytest.skip("Login failed")
    resp = client.get("/api/v1/cart", headers=auth_headers(token))
    assert resp.status_code == 200
    assert "message" in resp.json()
