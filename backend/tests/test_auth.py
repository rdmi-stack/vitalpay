"""Tests for authentication endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.asyncio
async def test_health_check(client):
    res = await client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_register_and_login(client):
    # Register
    res = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "test123456",
        "role": "provider",
        "first_name": "Test",
        "last_name": "User",
    })
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Login
    res = await client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "test123456",
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data

    # Get me
    token = data["access_token"]
    res = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    me = res.json()
    assert me["email"] == "test@example.com"
    assert me["role"] == "provider"


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    res = await client.post("/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword",
    })
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_register_duplicate(client):
    # First register
    await client.post("/api/auth/register", json={
        "email": "dupe@example.com",
        "password": "test123456",
        "role": "provider",
        "first_name": "Dupe",
        "last_name": "User",
    })

    # Second register — should fail
    res = await client.post("/api/auth/register", json={
        "email": "dupe@example.com",
        "password": "test123456",
        "role": "provider",
        "first_name": "Dupe",
        "last_name": "User",
    })
    assert res.status_code == 409


@pytest.mark.asyncio
async def test_protected_route_no_token(client):
    res = await client.get("/api/auth/me")
    assert res.status_code in (401, 403)


@pytest.mark.asyncio
async def test_refresh_token(client):
    # Register
    res = await client.post("/api/auth/register", json={
        "email": "refresh@example.com",
        "password": "test123456",
        "role": "provider",
        "first_name": "Refresh",
        "last_name": "User",
    })
    refresh = res.json()["refresh_token"]

    # Refresh
    res = await client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert res.status_code == 200
    assert "access_token" in res.json()
