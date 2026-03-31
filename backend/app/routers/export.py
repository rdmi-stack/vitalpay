import csv
import io
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from app.core.database import get_db
from app.core.deps import get_provider

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/bills")
async def export_bills(user=Depends(get_provider)):
    db = get_db()
    query = {"provider_id": user["_id"]} if user["role"] == "provider" else {}
    bills = await db.bills.find(query).sort("created_at", -1).to_list(length=5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Service", "Amount", "Amount Due", "Insurance Adj", "Status", "Due Date", "Provider", "Created"])

    for b in bills:
        writer.writerow([
            b["service_description"],
            b["amount"],
            b.get("amount_due", b["amount"]),
            b.get("insurance_adjustment", 0),
            b["status"],
            b["due_date"],
            b["provider_name"],
            b["created_at"].strftime("%Y-%m-%d"),
        ])

    output.seek(0)
    filename = f"payvital_bills_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/payments")
async def export_payments(user=Depends(get_provider)):
    db = get_db()

    if user["role"] == "provider":
        provider_bills = await db.bills.find({"provider_id": user["_id"]}, {"_id": 1}).to_list(length=10000)
        bill_ids = [b["_id"] for b in provider_bills]
        query = {"bill_id": {"$in": bill_ids}}
    else:
        query = {}

    payments = await db.payments.find(query).sort("created_at", -1).to_list(length=5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Amount", "Method", "Status", "Stripe ID", "Date"])

    for p in payments:
        writer.writerow([
            p["amount"],
            p["method"],
            p["status"],
            p.get("stripe_payment_id", ""),
            p["created_at"].strftime("%Y-%m-%d %H:%M"),
        ])

    output.seek(0)
    filename = f"payvital_payments_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/patients")
async def export_patients(user=Depends(get_provider)):
    db = get_db()
    query = {"provider_ids": user["_id"]} if user["role"] == "provider" else {}
    patients = await db.patients.find(query).sort("created_at", -1).to_list(length=5000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["First Name", "Last Name", "Email", "Phone", "DOB", "Added"])

    for p in patients:
        writer.writerow([
            p["first_name"],
            p["last_name"],
            p["email"],
            p["phone"],
            p["date_of_birth"],
            p["created_at"].strftime("%Y-%m-%d"),
        ])

    output.seek(0)
    filename = f"payvital_patients_{datetime.now(timezone.utc).strftime('%Y%m%d')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
