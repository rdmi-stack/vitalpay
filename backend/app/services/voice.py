import os
import httpx

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_VOICE_PHONE = os.getenv("TWILIO_VOICE_PHONE_NUMBER", "")

# ElevenLabs voice ID (default: Rachel)
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")


async def generate_speech(text: str) -> bytes | None:
    """Convert text to speech using ElevenLabs."""
    if not ELEVENLABS_API_KEY:
        print(f"[DEV TTS] {text[:80]}...")
        return None

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            json={
                "text": text,
                "model_id": "eleven_turbo_v2_5",
                "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
            },
        )
        if res.status_code == 200:
            return res.content
        return None


async def transcribe_audio(audio_data: bytes) -> str:
    """Transcribe audio using ElevenLabs STT."""
    if not ELEVENLABS_API_KEY:
        return "[DEV] Transcribed audio placeholder"

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.elevenlabs.io/v1/speech-to-text",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            files={"file": ("audio.wav", audio_data, "audio/wav")},
            data={"model_id": "scribe_v1"},
        )
        if res.status_code == 200:
            return res.json().get("text", "")
        return ""


async def get_ai_response(
    patient_context: dict,
    conversation_history: list[dict],
    user_message: str,
) -> str:
    """Get AI response for billing conversation using OpenAI."""
    if not OPENAI_API_KEY:
        return f"[DEV AI] Response to: {user_message[:50]}..."

    system_prompt = f"""You are a helpful, empathetic billing assistant for PayVital.
You help patients understand and pay their medical bills.

Patient context:
- Name: {patient_context.get('name', 'Unknown')}
- Balance due: ${patient_context.get('amount_due', 0):.2f}
- Provider: {patient_context.get('provider_name', 'Unknown')}
- Service: {patient_context.get('service_description', 'Unknown')}

You can:
1. Explain what they owe and why
2. Walk through line items and insurance adjustments
3. Help them pay (say "I'll send you a secure payment link via text")
4. Set up payment plans (3, 6, or 12 months)
5. Screen for financial assistance programs
6. Transfer to a human agent if needed

Be concise, warm, and professional. Keep responses under 3 sentences.
Never ask for card numbers — always direct to the secure payment link."""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_message})

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-4o",
                "messages": messages,
                "max_tokens": 200,
                "temperature": 0.7,
            },
            timeout=15.0,
        )
        if res.status_code == 200:
            return res.json()["choices"][0]["message"]["content"]
        return "I'm sorry, I'm having trouble right now. Let me connect you with a team member."


async def make_outbound_call(to_phone: str, twiml_url: str) -> dict:
    """Initiate an outbound call via Twilio."""
    if not TWILIO_SID:
        print(f"[DEV CALL] To: {to_phone}")
        return {"status": "dev_queued", "to": to_phone}

    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Calls.json"
    async with httpx.AsyncClient() as client:
        res = await client.post(
            url,
            auth=(TWILIO_SID, TWILIO_TOKEN),
            data={
                "From": TWILIO_VOICE_PHONE,
                "To": to_phone,
                "Url": twiml_url,
            },
        )
        return res.json()
