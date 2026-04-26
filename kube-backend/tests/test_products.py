"""
tests/test_products.py

Products endpoint returns a paginated response object, not a plain list.
Shape: {items: [], page: int, page_size: int, total: int}
POST /products returns 405 — product creation likely goes through /seller/products
"""
from unittest.mock import patch
import pytest


def register_and_login(client, phone="08033000001", password="pass1234", name="Test User"):
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


# ── Product listing ─────────────────────────────────────────────────────────────

def test_list_products_no_auth(client):
    """Anyone can browse products — no auth required."""
    resp = client.get("/api/v1/products")
    assert resp.status_code == 200


def test_list_products_returns_paginated_response(client):
    """Products endpoint returns paginated shape."""
    resp = client.get("/api/v1/products")
    data = resp.json()
    assert "items" in data
    assert "page" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_list_products_default_pagination(client):
    """Default page is 1, page_size is 20."""
    resp = client.get("/api/v1/products")
    data = resp.json()
    assert data["page"] == 1
    assert data["page_size"] == 20


def test_list_products_empty_on_fresh_db(client):
    """Fresh test DB has no products."""
    resp = client.get("/api/v1/products")
    data = resp.json()
    assert data["total"] == 0
    assert data["items"] == []


# ── Product creation via POST /products is not available ───────────────────────

def test_create_product_direct_post_not_allowed(client):
    """POST /products returns 405 — creation goes through seller routes."""
    resp = client.post("/api/v1/products", json={
        "title": "Test", "price": 10000,
    })
    assert resp.status_code == 405


# ── Product detail ──────────────────────────────────────────────────────────────

def test_get_product_nonexistent_valid_id_format(client):
    """Valid integer ID that does not exist returns 422 (type validated before lookup)."""
    resp = client.get("/api/v1/products/999999")
    # Backend validates type first, returns 422 before 404
    assert resp.status_code in (404, 422)


def test_get_product_string_id(client):
    """Non-integer ID returns 404 or 422."""
    resp = client.get("/api/v1/products/not-a-number")
    assert resp.status_code in (404, 422)
