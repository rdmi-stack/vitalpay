import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
TWILIO_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_VOICE_PHONE = os.getenv("TWILIO_VOICE_PHONE_NUMBER", "")

# ElevenLabs voice ID — Sarah: Mature, Reassuring, Confident
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID", "EXAVITQu4vr4xnSDxMaL")


async def generate_speech(text: str) -> bytes | None:
    """Convert text to speech using ElevenLabs v3 (most expressive model).
    Supports audio tags like [laughs], [sighs], [whispers], etc."""
    if not ELEVENLABS_API_KEY:
        print(f"[DEV TTS] {text[:80]}...")
        return None

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Try v3 first (supports audio tags for emotions)
        res = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            json={
                "text": text,
                "model_id": "eleven_v3",
                "voice_settings": {
                    "stability": 0.45,
                    "similarity_boost": 0.85,
                    "style": 0.35,
                    "use_speaker_boost": True,
                },
            },
        )
        if res.status_code == 200:
            return res.content

        # Fallback to turbo v2.5 if v3 not available
        res = await client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            json={
                "text": text,
                "model_id": "eleven_multilingual_v2",
                "voice_settings": {
                    "stability": 0.45,
                    "similarity_boost": 0.85,
                    "style": 0.35,
                    "use_speaker_boost": True,
                },
            },
        )
        if res.status_code == 200:
            return res.content

        print(f"[TTS ERROR] {res.status_code}: {res.text[:200]}")
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

    system_prompt = f"""You are Sarah, a warm and friendly billing assistant at PayVital — a healthcare payment platform. You speak exactly like a real human on a phone call. You are NOT a robot.

Patient context:
- Name: {patient_context.get('name', 'Unknown')}
- Balance due: ${patient_context.get('amount_due', 0):.2f}
- Provider: {patient_context.get('provider_name', 'Unknown')}
- Service: {patient_context.get('service_description', 'Unknown')}

Your capabilities:
1. Explain charges clearly — what insurance covered vs what patient owes
2. Send a secure payment link via text (never ask for card numbers)
3. Set up payment plans: 3, 6, or 12 months
4. Screen for financial assistance programs
5. Answer questions about PayVital for providers interested in the platform

CRITICAL VOICE RULES — you MUST follow these:
- You are being converted to speech via ElevenLabs v3. Use audio tags to express emotion naturally.
- Use [laughs] when something is funny or to lighten the mood
- Use [sighs] when expressing understanding about a tough situation
- Use [clears throat] before important information occasionally
- Use these SPARINGLY — like a real person would, not every sentence
- Keep responses to 1-3 short sentences max — you're on a phone call
- Use contractions: "I'll", "don't", "it's", "you're", "that's", "we'll"
- Add filler words occasionally: "So,", "Well,", "Oh,", "Hmm,", "Yeah,"
- Be warm, empathetic, sometimes a little lighthearted — patients are stressed about bills
- When someone thanks you, respond warmly like "Oh, you're so welcome!" or "Of course! Happy to help [laughs]"
- When discussing high balances, be empathetic: "[sighs] I know medical bills can be stressful, but I've got some great options for you."
- If someone asks about PayVital as a product: it's an AI-powered billing platform helping practices collect 85%+ of patient balances through text-to-pay, AI voice calls, and smart payment plans
- NEVER use markdown, bullet points, asterisks, or any formatting
- NEVER say "as an AI" or "I'm an AI assistant" — you're Sarah, a billing specialist
- Speak like you're having a friendly phone conversation with someone"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_message})

    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
            json={
                "model": "gpt-5.4-mini",
                "messages": messages,
                "max_completion_tokens": 250,
                "temperature": 0.85,
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
