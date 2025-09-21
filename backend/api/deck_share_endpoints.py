from __future__ import annotations

import json
import os
import secrets
from typing import Any, Dict

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/decks", tags=["decks"])


def _store(request: Request) -> Dict[str, Any]:
    """Return a simple key-value store from request.state.db.

    Compatible with the in-memory DB used elsewhere; we hang a `deck_shares`
    collection onto it if it doesn't already exist.
    """
    db = getattr(request.state, "db", None)
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    store = getattr(db, "deck_shares", None)
    if store is None:
        store = {}
        setattr(db, "deck_shares", store)
    return store  # noqa: TAE001 - simple dict used as in-memory store


def _generate_short_id() -> str:
    # URL-safe 8-10 char id
    return secrets.token_urlsafe(7).rstrip("_")


@router.post("/share")
async def create_share(request: Request) -> JSONResponse:
    """Create a short id for a deck JSON supplied in the request body.

    Body: { deck: <json object> }
    Returns: { id, url }
    """
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    deck = payload.get("deck")
    if not isinstance(deck, dict):
        raise HTTPException(
            status_code=400,
            detail="Missing or invalid 'deck' object",
        )

    # Optionally cap size to prevent abuse
    raw = json.dumps(deck, separators=(",", ":")).encode("utf-8")
    if len(raw) > 200_000:  # ~200KB
        raise HTTPException(status_code=413, detail="Deck payload too large")

    store = _store(request)
    short_id = _generate_short_id()
    # Deduplicate collisions
    while short_id in store:
        short_id = _generate_short_id()

    store[short_id] = deck

    # Compose share URL (frontend route uses query param fallback `d` as well)
    origin = os.environ.get("FRONTEND_ORIGIN")
    if not origin:
        # best-effort: derive from request
        hdr_origin = request.headers.get("origin") or ""
        base_scheme = getattr(getattr(request, "url", None), "scheme", "http")
        client = getattr(request, "client", None)
        client_host = getattr(client, "host", None)
        derived = f"{base_scheme}://{client_host}" if client_host else ""
        origin = str(hdr_origin) or derived or ""
    url = f"{origin}/deck-builder?s={short_id}"

    return JSONResponse({"id": short_id, "url": url})


@router.get("/share/{short_id}")
async def resolve_share(short_id: str, request: Request) -> JSONResponse:
    """Resolve a short id to the original deck JSON.

    Returns: { deck }
    """
    store = _store(request)
    deck = store.get(short_id)
    if deck is None:
        raise HTTPException(status_code=404, detail="Not found")
    return JSONResponse({"deck": deck})
