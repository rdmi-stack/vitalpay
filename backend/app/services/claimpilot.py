import os
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


async def detect_denial_action(denial_reason: str, payer: str, amount: float) -> dict:
    """AI agent that decides next action for a denied claim."""
    if not OPENAI_API_KEY:
        return {
            "action": "appeal",
            "reasoning": f"[DEV] Denial '{denial_reason}' from {payer} for ${amount:.2f} — recommend appeal",
            "priority": "high" if amount > 500 else "medium",
        }

    prompt = f"""You are a healthcare claims recovery specialist AI.
A claim was denied. Analyze and recommend the best next action.

Denial reason: {denial_reason}
Payer: {payer}
Amount: ${amount:.2f}

Respond with JSON:
{{"action": "appeal|refile|call_payer|write_off", "reasoning": "brief explanation", "priority": "high|medium|low", "appeal_grounds": "if action is appeal, what grounds"}}"""

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
                "max_tokens": 300,
            },
            timeout=15.0,
        )
        if res.status_code == 200:
            import json
            content = res.json()["choices"][0]["message"]["content"]
            return json.loads(content)
        return {"action": "escalate", "reasoning": "AI unavailable", "priority": "high"}


async def generate_appeal_letter(
    patient_name: str,
    provider_name: str,
    payer: str,
    denial_reason: str,
    service_description: str,
    amount: float,
    service_date: str,
) -> str:
    """AI generates an appeal letter for a denied claim."""
    if not OPENAI_API_KEY:
        return f"[DEV] Appeal letter for {patient_name}, denied by {payer}: {denial_reason}"

    prompt = f"""Write a professional healthcare claim appeal letter.

Patient: {patient_name}
Provider: {provider_name}
Payer/Insurance: {payer}
Service: {service_description}
Service date: {service_date}
Claim amount: ${amount:.2f}
Denial reason: {denial_reason}

Write a concise, professional appeal letter arguing why this claim should be paid.
Include specific medical necessity arguments and cite relevant guidelines.
Keep it under 400 words."""

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 600,
            },
            timeout=20.0,
        )
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"]
        return "Appeal letter generation failed. Please draft manually."
