from __future__ import annotations

import time
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api")


def _decks_store(request: Request) -> Dict[str, Dict[str, Any]]:
    db = getattr(request.state, "db", None)
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    store = getattr(db, "decks", None)
    if store is None:
        store = {}
        setattr(db, "decks", store)
    return store


def _user_index(request: Request) -> Dict[str, List[str]]:
    db = getattr(request.state, "db", None)
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    idx = getattr(db, "user_decks", None)
    if idx is None:
        idx = {}
        setattr(db, "user_decks", idx)
    return idx


def _now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


@router.get("/users/{user_id}/decks")
async def list_user_decks(user_id: str, request: Request) -> JSONResponse:
    decks = _decks_store(request)
    index = _user_index(request)
    ids = index.get(user_id, [])
    return JSONResponse([decks[d] for d in ids if d in decks])


@router.get("/decks/{deck_id}")
async def get_deck(deck_id: str, request: Request) -> JSONResponse:
    decks = _decks_store(request)
    deck = decks.get(deck_id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    return JSONResponse(deck)


@router.post("/decks")
async def create_deck(request: Request) -> JSONResponse:
    body = await request.json()
    user_id: Optional[str] = body.get("userId")
    if not user_id:
        raise HTTPException(status_code=400, detail="userId is required")
    decks = _decks_store(request)
    index = _user_index(request)
    deck_id = f"deck-{int(time.time()*1000)}"
    now = _now_iso()
    deck = {
        "id": deck_id,
        "userId": user_id,
        "name": body.get("name") or "Untitled Deck",
        "faction": body.get("faction"),
        "isActive": bool(body.get("isActive", True)),
        "cards": body.get("cards") or [],
        "version": 1,
        "createdAt": now,
        "updatedAt": now,
    }
    decks[deck_id] = deck
    index.setdefault(user_id, []).append(deck_id)
    return JSONResponse(deck, status_code=201)


@router.put("/decks/{deck_id}")
async def update_deck(deck_id: str, request: Request) -> JSONResponse:
    decks = _decks_store(request)
    deck = decks.get(deck_id)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    body = await request.json()
    deck.update({k: v for k, v in body.items() if k not in {"id", "userId", "createdAt"}})
    deck["version"] = int(deck.get("version", 1)) + 1
    deck["updatedAt"] = _now_iso()
    decks[deck_id] = deck
    return JSONResponse(deck)


@router.delete("/decks/{deck_id}")
async def delete_deck(deck_id: str, request: Request) -> JSONResponse:
    decks = _decks_store(request)
    index = _user_index(request)
    deck = decks.pop(deck_id, None)
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found")
    user_id = deck.get("userId")
    if user_id and user_id in index:
        index[user_id] = [d for d in index[user_id] if d != deck_id]
    return JSONResponse({"ok": True})


