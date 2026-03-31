"""Tests for bills endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def auth_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        # Register and login
        res = await c.post("/api/auth/register", json={
            "email": "billtest@example.com",
            "password": "test123456",
            "role": "provider",
            "first_name": "Bill",
            "last_name": "Tester",
        })
        token = res.json()["access_token"]
        c.headers["Authorization"] = f"Bearer {token}"

        # Create a patient first
        res = await c.post("/api/patients", json={
            "first_name": "Jane",
            "last_name": "Doe",
            "date_of_birth": "1990-01-15",
            "phone": "+14155551111",
            "email": "jane@example.com",
        })
        patient_id = res.json()["id"]
        c.patient_id = patient_id  # type: ignore
        yield c


@pytest.mark.asyncio
async def test_create_bill(auth_client):
    res = await auth_client.post("/api/bills", json={
        "patient_id": auth_client.patient_id,  # type: ignore
        "amount": 245.00,
        "service_description": "Office Visit",
        "service_date": "2026-03-01",
        "insurance_adjustment": 55.00,
        "due_date": "2026-04-01",
        "provider_name": "Test Clinic",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["amount"] == 245.00
    assert data["amount_due"] == 190.00
    assert data["status"] == "pending"
    assert data["payment_link"] is not None


@pytest.mark.asyncio
async def test_list_bills(auth_client):
    res = await auth_client.get("/api/bills")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


@pytest.mark.asyncio
async def test_dashboard_stats(auth_client):
    res = await auth_client.get("/api/dashboard/stats")
    assert res.status_code == 200
    data = res.json()
    assert "total_bills" in data
    assert "total_collected" in data
    assert "collection_rate" in data
