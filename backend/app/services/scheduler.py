"""Background scheduler for automated payment reminders.

Runs every hour and sends reminders at 3, 7, 14, 30, 60, 90 days overdue.
"""

import asyncio
from datetime import datetime, timedelta, timezone

from app.core.database import get_db
from app.services.sms import send_reminder_sms
from app.services.email import send_reminder_email

REMINDER_DAYS = [3, 7, 14, 30, 60, 90]


async def run_reminder_check():
    """Check for overdue bills and send reminders."""
    db = get_db()
    now = datetime.now(timezone.utc)

    for days in REMINDER_DAYS:
        target_date = (now - timedelta(days=days)).strftime("%Y-%m-%d")

        # Find bills due on this date that aren't paid
        bills = await db.bills.find({
            "due_date": target_date,
            "status": {"$in": ["pending", "sent", "viewed", "overdue"]},
        }).to_list(length=500)

        for bill in bills:
            # Check if we already sent a reminder for this day
            existing = await db.statements.find_one({
                "bill_id": bill["_id"],
                "type": "reminder",
                "days_overdue": days,
            })
            if existing:
                continue

            patient = await db.patients.find_one({"_id": bill["patient_id"]})
            if not patient:
                continue

            results = {}

            # Send SMS
            if patient.get("phone"):
                results["sms"] = await send_reminder_sms(
                    to_phone=patient["phone"],
                    patient_name=patient["first_name"],
                    provider_name=bill["provider_name"],
                    amount=bill.get("amount_due", bill["amount"]),
                    pay_code=bill["pay_code"],
                    days_overdue=days,
                )

            # Send email
            if patient.get("email"):
                results["email"] = await send_reminder_email(
                    to_email=patient["email"],
                    patient_name=patient["first_name"],
                    provider_name=bill["provider_name"],
                    amount=bill.get("amount_due", bill["amount"]),
                    pay_code=bill["pay_code"],
                    days_overdue=days,
                )

            # Log the reminder
            await db.statements.insert_one({
                "bill_id": bill["_id"],
                "patient_id": patient["_id"],
                "provider_id": bill["provider_id"],
                "channels": list(results.keys()),
                "results": results,
                "type": "reminder",
                "days_overdue": days,
                "sent_at": now,
            })

            # Update bill status to overdue if needed
            if days >= 30 and bill["status"] != "overdue":
                await db.bills.update_one(
                    {"_id": bill["_id"]},
                    {"$set": {"status": "overdue", "updated_at": now}},
                )

            print(f"[REMINDER] Sent {days}-day reminder to {patient['first_name']} for bill {bill['_id']}")


async def scheduler_loop():
    """Run reminder check every hour."""
    while True:
        try:
            await run_reminder_check()
        except Exception as e:
            print(f"[SCHEDULER ERROR] {e}")
        await asyncio.sleep(3600)  # Run every hour
