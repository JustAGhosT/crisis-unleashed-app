from __future__ import annotations

import json
from typing import Dict, Set

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: Set[WebSocket] = set()
        # channel subscriptions: deckId -> websockets
        self.subscribers: Dict[str, Set[WebSocket]] = {}
        # reverse index: websocket -> set(deckId)
        self.ws_channels: Dict[WebSocket, Set[str]] = {}

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.add(websocket)
        self.ws_channels.setdefault(websocket, set())

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        # remove from all channels
        channels = self.ws_channels.pop(websocket, set())
        for ch in channels:
            subs = self.subscribers.get(ch)
            if subs:
                subs.discard(websocket)

    def subscribe(self, websocket: WebSocket, channel: str) -> None:
        self.subscribers.setdefault(channel, set()).add(websocket)
        self.ws_channels.setdefault(websocket, set()).add(channel)

    async def send_text(self, websocket: WebSocket, data: str) -> None:
        await websocket.send_text(data)

    async def broadcast_channel(self, channel: str, data: dict) -> None:
        payload = json.dumps(data)
        for ws in list(self.subscribers.get(channel, set())):
            try:
                await ws.send_text(payload)
            except Exception:
                # best-effort cleanup
                self.disconnect(ws)


manager = ConnectionManager()


# In-memory authoritative deck state per channel
DECK_STATE: Dict[str, dict] = {}
DECK_IDS_SEEN: Dict[str, Set[str]] = {}


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            try:
                data = json.loads(message)
            except Exception:
                # Echo raw message for non-JSON clients
                await manager.send_text(websocket, message)
                continue

            msg_type = data.get("type")
            payload = data.get("payload") or {}

            if msg_type == "ping":
                await manager.send_text(
                    websocket,
                    json.dumps({"type": "pong", "ts": data.get("ts")}),
                )
                continue

            if msg_type == "deck.subscribe":
                deck_id = str(payload.get("deckId") or "default")
                manager.subscribe(websocket, deck_id)
                # ensure state exists
                state = DECK_STATE.setdefault(deck_id, {"seq": 0, "cards": {}})
                await manager.send_text(
                    websocket,
                    json.dumps(
                        {
                            "type": "deck.state.update",
                            "payload": {
                                "deckId": deck_id,
                                "state": state,
                                "seq": state.get("seq", 0),
                            },
                        }
                    ),
                )
                continue

            if msg_type == "deck.update":
                deck_id = str(payload.get("deckId") or "default")
                action = str(payload.get("action") or "")
                card_id = payload.get("cardId")
                event_id = str(payload.get("id") or "")

                # idempotency per deck channel
                if event_id:
                    seen = DECK_IDS_SEEN.setdefault(deck_id, set())
                    if event_id in seen:
                        await manager.send_text(
                            websocket,
                            json.dumps({"type": "ack", "event": msg_type, "ok": True}),
                        )
                        continue
                    # cap memory by trimming
                    if len(seen) > 1000:
                        seen.clear()
                    seen.add(event_id)

                state = DECK_STATE.setdefault(deck_id, {"seq": 0, "cards": {}})
                cards = state.setdefault("cards", {})

                if action == "add" and card_id:
                    cards[card_id] = int(cards.get(card_id, 0)) + 1
                elif action == "remove" and card_id:
                    qty = int(cards.get(card_id, 0)) - 1
                    if qty <= 0:
                        cards.pop(card_id, None)
                    else:
                        cards[card_id] = qty
                elif action == "clear":
                    state["cards"] = {}

                state["seq"] = int(state.get("seq", 0)) + 1
                await manager.broadcast_channel(
                    deck_id,
                    {
                        "type": "deck.state.update",
                        "payload": {
                            "deckId": deck_id,
                            "state": state,
                            "seq": state["seq"],
                        },
                    },
                )
                await manager.send_text(
                    websocket,
                    json.dumps({"type": "ack", "event": msg_type, "ok": True}),
                )
                continue

            # Generic ack for other events
            await manager.send_text(
                websocket,
                json.dumps({"type": "ack", "event": msg_type, "ok": True}),
            )
    except WebSocketDisconnect:
        manager.disconnect(websocket)

