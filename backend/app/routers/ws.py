"""WebSocket endpoint for real-time dashboard updates."""

import asyncio
import json
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.database import get_db
from app.core.security import decode_token

router = APIRouter(tags=["WebSocket"])


class ConnectionManager:
    def __init__(self):
        self.active: dict[str, list[WebSocket]] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        if user_id not in self.active:
            self.active[user_id] = []
        self.active[user_id].append(ws)

    def disconnect(self, user_id: str, ws: WebSocket):
        if user_id in self.active:
            self.active[user_id] = [w for w in self.active[user_id] if w != ws]
            if not self.active[user_id]:
                del self.active[user_id]

    async def send_to_user(self, user_id: str, data: dict):
        if user_id in self.active:
            message = json.dumps(data)
            for ws in self.active[user_id]:
                try:
                    await ws.send_text(message)
                except Exception:
                    pass

    async def broadcast(self, data: dict):
        message = json.dumps(data)
        for user_id in self.active:
            for ws in self.active[user_id]:
                try:
                    await ws.send_text(message)
                except Exception:
                    pass


manager = ConnectionManager()


@router.websocket("/ws/dashboard")
async def dashboard_ws(ws: WebSocket):
    """WebSocket for real-time dashboard updates.
    Client sends: {"token": "jwt_access_token"} on connect.
    Server sends: periodic stats updates + event notifications.
    """
    await ws.accept()

    # Authenticate via first message
    try:
        auth_msg = await asyncio.wait_for(ws.receive_text(), timeout=10)
        data = json.loads(auth_msg)
        token = data.get("token", "")
        payload = decode_token(token)
        if not payload:
            await ws.close(code=4001, reason="Invalid token")
            return
        user_id = payload["sub"]
    except Exception:
        await ws.close(code=4001, reason="Authentication required")
        return

    # Register connection
    manager.active.setdefault(user_id, []).append(ws)

    try:
        while True:
            # Send stats update every 30 seconds
            db = get_db()

            total_collected_pipeline = [
                {"$match": {"status": "completed"}},
                {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
            ]
            collected_result = await db.payments.aggregate(total_collected_pipeline).to_list(length=1)
            total_collected = collected_result[0]["total"] if collected_result else 0

            total_bills = await db.bills.count_documents({})
            pending_bills = await db.bills.count_documents({"status": {"$in": ["pending", "sent", "viewed"]}})
            total_patients = await db.patients.count_documents({})

            await ws.send_text(json.dumps({
                "type": "stats_update",
                "data": {
                    "total_collected": total_collected,
                    "total_bills": total_bills,
                    "pending_bills": pending_bills,
                    "total_patients": total_patients,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            }))

            # Wait 30s or until client sends a message
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=30)
                # Client can send ping or requests
                if msg == "ping":
                    await ws.send_text(json.dumps({"type": "pong"}))
            except asyncio.TimeoutError:
                pass  # No message — just send next update

    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
    except Exception:
        manager.disconnect(user_id, ws)


# Helper to notify dashboard when payment is made
async def notify_payment(provider_id: str, payment_data: dict):
    await manager.send_to_user(provider_id, {
        "type": "payment_received",
        "data": payment_data,
    })
