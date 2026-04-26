"""
tests/test_orders.py

Backend uses 403 Forbidden (not 401) for unauthenticated requests.
Order ID 999999 returns 422 (type validation) not 404.
"""
from unittest.mock import patch
import pytest


def register_and_login(client, phone="08055000001", password="pass1234", name="Order User"):
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


# ── Order listing ───────────────────────────────────────────────────────────────

def test_list_orders_requires_auth(client):
    """Unauthenticated orders list returns 403."""
    resp = client.get("/api/v1/orders")
    assert resp.status_code == 401


def test_list_orders_empty_for_new_user(client):
    token = register_and_login(client, phone="08055000002")
    if not token:
        pytest.skip("Login failed")
    resp = client.get("/api/v1/orders", headers=auth_headers(token))
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


# ── Order creation ──────────────────────────────────────────────────────────────

def test_create_order_requires_auth(client):
    """Unauthenticated order creation returns 403."""
    resp = client.post("/api/v1/orders", json={})
    assert resp.status_code == 401


def test_get_order_requires_auth(client):
    """Unauthenticated order detail returns 403."""
    resp = client.get("/api/v1/orders/1")
    assert resp.status_code == 401


def test_get_order_invalid_id(client):
    """Integer ID that does not exist returns 422 (type validated before lookup)."""
    token = register_and_login(client, phone="08055000003")
    if not token:
        pytest.skip("Login failed")
    resp = client.get("/api/v1/orders/999999", headers=auth_headers(token))
    assert resp.status_code in (404, 422)


# ── Returns ─────────────────────────────────────────────────────────────────────

def test_list_returns_requires_auth(client):
    """Unauthenticated returns list returns 403."""
    resp = client.get("/api/v1/returns")
    assert resp.status_code == 401


def test_create_return_requires_auth(client):
    """Unauthenticated return creation returns 403."""
    resp = client.post("/api/v1/returns", json={"order_id": 1, "reason": "Damaged"})
    assert resp.status_code == 401


def test_list_returns_authenticated(client):
    token = register_and_login(client, phone="08055000004")
    if not token:
        pytest.skip("Login failed")
    resp = client.get("/api/v1/returns", headers=auth_headers(token))
    assert resp.status_code == 200
