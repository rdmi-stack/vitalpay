import os
import httpx

MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY", "")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", f"PayVital <billing@{MAILGUN_DOMAIN}>")
BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


async def _send_mailgun(to_email: str, subject: str, html: str) -> dict:
    """Send an email via Mailgun API."""
    if not MAILGUN_API_KEY:
        print(f"[DEV EMAIL] To: {to_email} | Subject: {subject}")
        return {"status": "dev_sent", "to": to_email}

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
            auth=("api", MAILGUN_API_KEY),
            data={
                "from": FROM_EMAIL,
                "to": [to_email],
                "subject": subject,
                "html": html,
            },
        )
        return {"status": res.status_code, "to": to_email, "response": res.json()}


async def send_payment_email(
    to_email: str,
    patient_name: str,
    provider_name: str,
    amount: float,
    service_description: str,
    pay_code: str,
) -> dict:
    """Send a payment statement email to a patient."""
    payment_link = f"{BASE_URL}/pay/{pay_code}"

    html = f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span style="background: #635bff; color: white; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 14px;">+</span>
            <span style="font-weight: bold; font-size: 18px; margin-left: 8px; color: #0a2540;">PayVital</span>
        </div>

        <div style="background: #f7f9fc; border-radius: 16px; padding: 32px; text-align: center;">
            <p style="color: #6b7c93; font-size: 14px; margin: 0 0 8px;">New bill from <strong style="color: #0a2540;">{provider_name}</strong></p>
            <p style="font-size: 42px; font-weight: 800; color: #0a2540; margin: 8px 0;">${amount:.2f}</p>
            <p style="color: #6b7c93; font-size: 14px; margin: 0 0 24px;">{service_description}</p>
            <a href="{payment_link}" style="display: inline-block; background: #635bff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">View & Pay Now</a>
        </div>

        <p style="text-align: center; color: #a3b1c6; font-size: 12px; margin-top: 24px;">
            Hi {patient_name}, this is a secure billing notification from {provider_name} via PayVital.
            No account or app download needed.
        </p>

        <p style="text-align: center; color: #c4cdd9; font-size: 11px; margin-top: 16px;">
            PayVital, LLC &middot; HIPAA Compliant &middot; PCI-DSS Certified
        </p>
    </div>
    """

    return await _send_mailgun(
        to_email,
        f"New bill from {provider_name} — ${amount:.2f}",
        html,
    )


async def send_reminder_email(
    to_email: str,
    patient_name: str,
    provider_name: str,
    amount: float,
    pay_code: str,
    days_overdue: int,
) -> dict:
    """Send a payment reminder email."""
    payment_link = f"{BASE_URL}/pay/{pay_code}"

    html = f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <span style="background: #635bff; color: white; padding: 6px 10px; border-radius: 8px; font-weight: bold; font-size: 14px;">+</span>
            <span style="font-weight: bold; font-size: 18px; margin-left: 8px; color: #0a2540;">PayVital</span>
        </div>

        <div style="background: #fff4f0; border-radius: 16px; padding: 32px; text-align: center;">
            <p style="color: #6b7c93; font-size: 14px; margin: 0 0 8px;">Payment reminder from <strong style="color: #0a2540;">{provider_name}</strong></p>
            <p style="font-size: 42px; font-weight: 800; color: #0a2540; margin: 8px 0;">${amount:.2f}</p>
            <p style="color: #e25c3d; font-size: 14px; margin: 0 0 24px;">{days_overdue} days past due</p>
            <a href="{payment_link}" style="display: inline-block; background: #635bff; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">Pay Now</a>
        </div>

        <p style="text-align: center; color: #a3b1c6; font-size: 12px; margin-top: 24px;">
            Hi {patient_name}, this is a reminder about your outstanding balance.
            Need help? Call (888) 730-9374 or set up a payment plan.
        </p>
    </div>
    """

    return await _send_mailgun(
        to_email,
        f"Reminder: ${amount:.2f} due to {provider_name}",
        html,
    )
