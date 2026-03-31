"""Seed demo data for PayVital dashboard demos."""

import asyncio
import secrets
from datetime import datetime, timedelta, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings
from app.core.security import hash_password

MONGODB_URI = settings.MONGODB_URI
DB_NAME = settings.DB_NAME


async def seed():
    client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=10000)
    db = client[DB_NAME]

    # Test connection first
    await client.admin.command("ping")
    print("Seeding demo data...")

    # Clear existing demo data
    for col in ["users", "patients", "bills", "payments", "payment_plans", "statements", "voice_calls", "voice_campaigns", "claims", "leads", "audit_logs"]:
        await db[col].delete_many({})
    print("  Cleared existing data")

    # --- Users ---
    admin_id = (await db.users.insert_one({
        "email": "admin@payvital.com",
        "password_hash": hash_password("admin123"),
        "role": "admin",
        "first_name": "Ranjit",
        "last_name": "Rajput",
        "is_active": True,
        "email_verified": True,
        "created_at": datetime.now(timezone.utc) - timedelta(days=90),
        "updated_at": datetime.now(timezone.utc),
    })).inserted_id

    provider_id = (await db.users.insert_one({
        "email": "provider@valleyhealth.com",
        "password_hash": hash_password("provider123"),
        "role": "provider",
        "first_name": "Dr. Sarah",
        "last_name": "Miller",
        "is_active": True,
        "email_verified": True,
        "created_at": datetime.now(timezone.utc) - timedelta(days=60),
        "updated_at": datetime.now(timezone.utc),
    })).inserted_id

    print(f"  Created users: admin + provider")

    # --- Patients ---
    patients_data = [
        {"first_name": "Sarah", "last_name": "Johnson", "date_of_birth": "1988-03-15", "phone": "+14155551234", "email": "sarah.j@email.com"},
        {"first_name": "James", "last_name": "Kim", "date_of_birth": "1975-07-22", "phone": "+14155552345", "email": "james.kim@email.com"},
        {"first_name": "Lisa", "last_name": "Rodriguez", "date_of_birth": "1992-11-08", "phone": "+14155553456", "email": "lisa.r@email.com"},
        {"first_name": "Michael", "last_name": "Chen", "date_of_birth": "1965-01-30", "phone": "+14155554567", "email": "m.chen@email.com"},
        {"first_name": "Emily", "last_name": "Davis", "date_of_birth": "1998-06-12", "phone": "+14155555678", "email": "emily.d@email.com"},
        {"first_name": "Robert", "last_name": "Wilson", "date_of_birth": "1970-09-25", "phone": "+14155556789", "email": "r.wilson@email.com"},
        {"first_name": "Maria", "last_name": "Garcia", "date_of_birth": "1985-04-18", "phone": "+14155557890", "email": "maria.g@email.com"},
        {"first_name": "David", "last_name": "Brown", "date_of_birth": "1955-12-03", "phone": "+14155558901", "email": "d.brown@email.com"},
    ]

    patient_ids = []
    for p in patients_data:
        pid = (await db.patients.insert_one({
            **p,
            "address": None,
            "provider_ids": [provider_id],
            "created_at": datetime.now(timezone.utc) - timedelta(days=45),
            "updated_at": datetime.now(timezone.utc),
        })).inserted_id
        patient_ids.append(pid)
    print(f"  Created {len(patient_ids)} patients")

    # --- Bills ---
    services = [
        ("Office Visit", 245.00, 55.00),
        ("Lab Work — CBC Panel", 180.00, 30.00),
        ("X-Ray — Chest", 320.00, 80.00),
        ("Physical Therapy Session", 150.00, 25.00),
        ("Annual Physical Exam", 275.00, 75.00),
        ("Specialist Consultation", 400.00, 100.00),
        ("Urgent Care Visit", 195.00, 45.00),
        ("Blood Draw + Analysis", 125.00, 20.00),
        ("EKG / ECG Test", 350.00, 90.00),
        ("MRI — Lower Back", 850.00, 200.00),
        ("Dermatology Consult", 225.00, 50.00),
        ("Follow-up Visit", 145.00, 35.00),
    ]

    statuses = ["paid", "paid", "paid", "paid", "sent", "viewed", "pending", "overdue", "plan_active", "paid", "sent", "pending"]
    bill_ids = []

    for i, (service, amount, adj) in enumerate(services):
        patient = patient_ids[i % len(patient_ids)]
        days_ago = 60 - (i * 4)
        pay_code = secrets.token_urlsafe(8)
        status = statuses[i]

        bid = (await db.bills.insert_one({
            "patient_id": patient,
            "provider_id": provider_id,
            "amount": amount,
            "amount_due": 0 if status == "paid" else amount - adj,
            "service_description": service,
            "service_date": (datetime.now(timezone.utc) - timedelta(days=days_ago + 7)).strftime("%Y-%m-%d"),
            "insurance_adjustment": adj,
            "status": status,
            "due_date": (datetime.now(timezone.utc) - timedelta(days=days_ago - 30)).strftime("%Y-%m-%d"),
            "provider_name": "Valley Health",
            "payment_link": f"/pay/{pay_code}",
            "pay_code": pay_code,
            "created_at": datetime.now(timezone.utc) - timedelta(days=days_ago),
            "updated_at": datetime.now(timezone.utc),
        })).inserted_id
        bill_ids.append(bid)
    print(f"  Created {len(bill_ids)} bills")

    # --- Payments (for paid bills) ---
    payment_count = 0
    for i, bid in enumerate(bill_ids):
        if statuses[i] == "paid":
            service, amount, adj = services[i]
            await db.payments.insert_one({
                "bill_id": bid,
                "patient_id": patient_ids[i % len(patient_ids)],
                "amount": amount - adj,
                "method": ["card", "apple_pay", "hsa", "card"][payment_count % 4],
                "status": "completed",
                "stripe_payment_id": f"pi_{secrets.token_hex(12)}",
                "created_at": datetime.now(timezone.utc) - timedelta(days=50 - (i * 3)),
            })
            payment_count += 1
    print(f"  Created {payment_count} payments")

    # --- Payment Plans ---
    for i, bid in enumerate(bill_ids):
        if statuses[i] == "plan_active":
            service, amount, adj = services[i]
            await db.payment_plans.insert_one({
                "bill_id": bid,
                "patient_id": patient_ids[i % len(patient_ids)],
                "total_amount": amount - adj,
                "installment_amount": round((amount - adj) / 3, 2),
                "installments": 3,
                "installments_paid": 1,
                "frequency": "monthly",
                "status": "active",
                "next_due_date": (datetime.now(timezone.utc) + timedelta(days=15)).strftime("%Y-%m-%d"),
                "created_at": datetime.now(timezone.utc) - timedelta(days=20),
            })
    print("  Created payment plans")

    # --- Statements ---
    statement_count = 0
    for i, bid in enumerate(bill_ids):
        if statuses[i] in ("sent", "viewed", "paid"):
            await db.statements.insert_one({
                "bill_id": bid,
                "patient_id": patient_ids[i % len(patient_ids)],
                "provider_id": provider_id,
                "channels": ["sms", "email"],
                "results": {},
                "type": "initial",
                "sent_at": datetime.now(timezone.utc) - timedelta(days=40 - (i * 3)),
                "opened": statuses[i] in ("viewed", "paid"),
                "clicked": statuses[i] == "paid",
                "paid": statuses[i] == "paid",
            })
            statement_count += 1
    print(f"  Created {statement_count} statements")

    # --- Voice Calls ---
    call_outcomes = ["paid", "plan_setup", "completed", "escalated", "no_answer"]
    for i in range(8):
        await db.voice_calls.insert_one({
            "call_id": f"call_{secrets.token_hex(8)}",
            "patient_id": patient_ids[i % len(patient_ids)],
            "patient_phone": patients_data[i % len(patients_data)]["phone"],
            "direction": "inbound" if i % 3 == 0 else "outbound",
            "duration": 45 + (i * 30),
            "transcript": f"Patient called about bill #{i+1}. Resolved via {'payment' if i % 2 == 0 else 'plan setup'}.",
            "outcome": call_outcomes[i % len(call_outcomes)],
            "created_at": datetime.now(timezone.utc) - timedelta(days=20 - (i * 2)),
        })
    print("  Created 8 voice calls")

    # --- Voice Campaigns ---
    await db.voice_campaigns.insert_one({
        "name": "30-Day Reminder Campaign",
        "type": "reminder",
        "filters": {"days_overdue_min": 25, "days_overdue_max": 35},
        "status": "active",
        "stats": {"total": 45, "completed": 32, "paid": 18},
        "created_by": str(provider_id),
        "created_at": datetime.now(timezone.utc) - timedelta(days=10),
    })
    await db.voice_campaigns.insert_one({
        "name": "Pre-Visit Cost Estimates",
        "type": "previsit",
        "filters": {"days_overdue_min": 0, "days_overdue_max": 0},
        "status": "completed",
        "stats": {"total": 120, "completed": 120, "paid": 45},
        "created_by": str(provider_id),
        "created_at": datetime.now(timezone.utc) - timedelta(days=30),
    })
    print("  Created 2 voice campaigns")

    # --- Claims (ClaimPilot) ---
    denial_reasons = [
        "Missing prior authorization",
        "Service not covered under plan",
        "Duplicate claim submission",
        "Incorrect CPT code",
        "Patient eligibility expired",
    ]
    payers = ["Aetna", "Blue Cross", "United Healthcare", "Cigna", "Humana"]
    claim_statuses = ["denied", "denied", "appealed", "recovered", "denied"]

    for i in range(5):
        await db.claims.insert_one({
            "provider_id": provider_id,
            "patient_name": f"{patients_data[i]['first_name']} {patients_data[i]['last_name']}",
            "payer": payers[i],
            "claim_number": f"CLM-2026-{1000 + i}",
            "amount": [1200, 850, 2400, 560, 1800][i],
            "service_description": services[i][0],
            "service_date": (datetime.now(timezone.utc) - timedelta(days=60 - (i * 10))).strftime("%Y-%m-%d"),
            "denial_reason": denial_reasons[i],
            "status": claim_statuses[i],
            "actions_taken": [],
            "appeal_letter": None,
            "recovered_amount": 560 if claim_statuses[i] == "recovered" else 0,
            "created_at": datetime.now(timezone.utc) - timedelta(days=40 - (i * 5)),
            "updated_at": datetime.now(timezone.utc),
        })
    print("  Created 5 claims")

    # --- Leads ---
    await db.leads.insert_one({
        "first_name": "John",
        "last_name": "Smith",
        "email": "john@metrohealth.com",
        "phone": "+14155559999",
        "organization": "Metro Health System",
        "ehr_system": "Epic",
        "provider_count": "21-50",
        "message": "Interested in the platform for our 30-provider group.",
        "status": "new",
        "created_at": datetime.now(timezone.utc) - timedelta(days=2),
    })
    print("  Created 1 lead")

    print("\nDemo data seeded successfully!")
    print("Login credentials:")
    print("  Admin:    admin@payvital.com / admin123")
    print("  Provider: provider@valleyhealth.com / provider123")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
