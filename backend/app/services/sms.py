import os
import httpx

TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER", "")
BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


async def send_payment_sms(
    to_phone: str,
    patient_name: str,
    provider_name: str,
    amount: float,
    pay_code: str,
) -> dict:
    """Send a text-to-pay SMS to a patient."""
    payment_link = f"{BASE_URL}/pay/{pay_code}"
    body = (
        f"Hi {patient_name}, you have a ${amount:.2f} bill from {provider_name}. "
        f"Tap to view & pay securely: {payment_link}"
    )

    if not TWILIO_SID:
        # Dev mode — just return mock
        print(f"[DEV SMS] To: {to_phone} | {body}")
        return {"status": "dev_sent", "body": body, "to": to_phone}

    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json"
    async with httpx.AsyncClient() as client:
        res = await client.post(
            url,
            auth=(TWILIO_SID, TWILIO_TOKEN),
            data={"From": TWILIO_PHONE, "To": to_phone, "Body": body},
        )
        return res.json()


async def send_reminder_sms(
    to_phone: str,
    patient_name: str,
    provider_name: str,
    amount: float,
    pay_code: str,
    days_overdue: int,
) -> dict:
    """Send a payment reminder SMS."""
    payment_link = f"{BASE_URL}/pay/{pay_code}"
    body = (
        f"Hi {patient_name}, a friendly reminder: your ${amount:.2f} bill from "
        f"{provider_name} is {days_overdue} days past due. "
        f"Pay now: {payment_link}"
    )

    if not TWILIO_SID:
        print(f"[DEV SMS REMINDER] To: {to_phone} | {body}")
        return {"status": "dev_sent", "body": body, "to": to_phone}

    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json"
    async with httpx.AsyncClient() as client:
        res = await client.post(
            url,
            auth=(TWILIO_SID, TWILIO_TOKEN),
            data={"From": TWILIO_PHONE, "To": to_phone, "Body": body},
        )
        return res.json()
