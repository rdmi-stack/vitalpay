from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.core.deps import get_provider

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(user=Depends(get_provider)):
    db = get_db()

    provider_filter = {}
    if user["role"] == "provider":
        provider_filter = {"provider_id": user["_id"]}

    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)

    # Total bills
    total_bills = await db.bills.count_documents(provider_filter)

    # Bills this month
    bills_this_month = await db.bills.count_documents(
        {**provider_filter, "created_at": {"$gte": thirty_days_ago}}
    )

    # Total collected (sum of completed payments)
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]

    if provider_filter:
        # Get bill IDs for this provider first
        provider_bills = await db.bills.find(
            provider_filter, {"_id": 1}
        ).to_list(length=10000)
        bill_ids = [b["_id"] for b in provider_bills]
        pipeline.insert(0, {"$match": {"bill_id": {"$in": bill_ids}}})

    collected_result = await db.payments.aggregate(pipeline).to_list(length=1)
    total_collected = collected_result[0]["total"] if collected_result else 0

    # Collections this month
    pipeline_month = [
        {
            "$match": {
                "status": "completed",
                "created_at": {"$gte": thirty_days_ago},
            }
        },
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    month_result = await db.payments.aggregate(pipeline_month).to_list(length=1)
    collected_this_month = month_result[0]["total"] if month_result else 0

    # Outstanding amount
    outstanding_pipeline = [
        {"$match": {**provider_filter, "status": {"$in": ["pending", "sent", "viewed", "overdue"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount_due"}}},
    ]
    outstanding_result = await db.bills.aggregate(outstanding_pipeline).to_list(length=1)
    total_outstanding = outstanding_result[0]["total"] if outstanding_result else 0

    # Bill status counts
    status_pipeline = [
        {"$match": provider_filter} if provider_filter else {"$match": {}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}},
    ]
    status_result = await db.bills.aggregate(status_pipeline).to_list(length=20)
    status_counts = {s["_id"]: s["count"] for s in status_result}

    # Active patients
    total_patients = await db.patients.count_documents(
        {"provider_ids": user["_id"]} if user["role"] == "provider" else {}
    )

    # Active payment plans
    active_plans = await db.payment_plans.count_documents({"status": "active"})

    # Collection rate
    total_billed_pipeline = [
        {"$match": provider_filter} if provider_filter else {"$match": {}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    total_billed_result = await db.bills.aggregate(total_billed_pipeline).to_list(length=1)
    total_billed = total_billed_result[0]["total"] if total_billed_result else 0
    collection_rate = round((total_collected / total_billed * 100), 1) if total_billed > 0 else 0

    return {
        "total_bills": total_bills,
        "bills_this_month": bills_this_month,
        "total_collected": total_collected,
        "collected_this_month": collected_this_month,
        "total_outstanding": total_outstanding,
        "collection_rate": collection_rate,
        "total_patients": total_patients,
        "active_payment_plans": active_plans,
        "bill_status_counts": status_counts,
    }
