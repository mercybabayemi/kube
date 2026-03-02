from unittest.mock import patch


def test_health(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@patch("app.services.auth_service._send_otp_to_user", return_value=True)
def test_register(mock_otp, client):
    resp = client.post("/api/v1/auth/register", json={
        "name": "Test Buyer",
        "phone": "08012345678",
        "password": "secret123",
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["role"] == "BUYER"
    assert data["phone"] == "+2348012345678"


def test_login_invalid(client):
    resp = client.post("/api/v1/auth/login", json={
        "phone": "08099999999",
        "password": "wrongpassword",
    })
    assert resp.status_code == 401


@patch("app.services.auth_service._send_otp_to_user", return_value=True)
def test_register_duplicate_phone(mock_otp, client):
    payload = {"name": "Alice", "phone": "08011111111", "password": "pass1234"}
    r1 = client.post("/api/v1/auth/register", json=payload)
    assert r1.status_code == 201
    r2 = client.post("/api/v1/auth/register", json=payload)
    assert r2.status_code == 400
    assert "already registered" in r2.json()["detail"]


@patch("app.services.auth_service._send_otp_to_user", return_value=True)
def test_login_after_register(mock_otp, client):
    client.post("/api/v1/auth/register", json={
        "name": "Login User",
        "phone": "08022222222",
        "password": "mypassword",
    })
    resp = client.post("/api/v1/auth/login", json={
        "phone": "+2348022222222",
        "password": "mypassword",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
