from __future__ import annotations

import json as _json
import os
import time as _time
from typing import Any, Dict, List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api", tags=["cards"])


def _cards_store(request: Request) -> List[Dict[str, Any]]:
    """Minimal in-memory card catalog for development.

    In production, replace with real database/provider.
    """
    db = getattr(request.state, "db", None)
    if db is None:
        raise HTTPException(status_code=500, detail="Database not available")
    # If external source provided, fetch and cache
    source_url = os.environ.get("CARDS_SOURCE_URL")
    source_file = os.environ.get("CARDS_SOURCE_FILE")
    cache_ttl = int(os.environ.get("CARDS_SOURCE_TTL", "300"))  # seconds
    now = int(_time.time())
    cards = getattr(db, "cards_catalog", None)
    last_fetched = getattr(db, "cards_catalog_last_fetched", 0)

    def _validate_cards(candidate: Any) -> Tuple[bool, List[Dict[str, Any]]]:
        if not isinstance(candidate, list):
            return False, []
        validated: List[Dict[str, Any]] = []
        for item in candidate:
            if not isinstance(item, dict):
                continue
            cid = item.get("id")
            name = item.get("name")
            ctype = item.get("type")
            if not isinstance(cid, str) or not isinstance(name, str) or not isinstance(ctype, str):
                continue
            validated.append(item)
        # Require at least a handful of valid entries to accept source
        return (len(validated) >= 1), validated
    if source_url and (cards is None or now - int(last_fetched) > cache_ttl):
        try:
            with urlopen(source_url, timeout=5) as resp:
                data = resp.read()
                fetched = _json.loads(data)
                ok, validated = _validate_cards(fetched)
                if ok:
                    cards = validated
                    setattr(db, "cards_catalog", cards)
                    setattr(db, "cards_catalog_last_fetched", now)
        except (URLError, HTTPError, ValueError):
            # fall through to in-memory default on failure
            cards = getattr(db, "cards_catalog", None)

    # Local file fallback if provided and still no cards or cache expired
    if source_file and (cards is None or now - int(last_fetched) > cache_ttl):
        try:
            with open(source_file, "r", encoding="utf-8") as fh:
                fetched = _json.load(fh)
                ok, validated = _validate_cards(fetched)
                if ok:
                    cards = validated
                    setattr(db, "cards_catalog", cards)
                    setattr(db, "cards_catalog_last_fetched", now)
        except Exception:
            cards = getattr(db, "cards_catalog", None)

    if cards is None:
        cards = [
            {
                "id": "card-001",
                "name": "Solar Guard",
                "description": "Shielded unit of the Solaris Nexus.",
                "type": "unit",
                "unitType": "melee",
                "faction": "solaris",
                "rarity": "common",
                "cost": 2,
                "attack": 2,
                "health": 3,
                "abilities": [],
                "energyCost": 2,
                "isActive": True,
                "createdAt": "2025-01-01T00:00:00Z",
                "updatedAt": "2025-01-01T00:00:00Z",
            },
            {
                "id": "card-002",
                "name": "Shadow Operative",
                "description": "Stealth unit of Umbral Eclipse.",
                "type": "unit",
                "unitType": "ranged",
                "faction": "umbral-eclipse",
                "rarity": "uncommon",
                "cost": 3,
                "attack": 3,
                "health": 2,
                "abilities": ["Stealth"],
                "energyCost": 3,
                "isActive": True,
                "createdAt": "2025-01-01T00:00:00Z",
                "updatedAt": "2025-01-01T00:00:00Z",
            },
        ]
        setattr(db, "cards_catalog", cards)
        setattr(db, "cards_catalog_last_fetched", now)
    return cards


@router.get("/cards/search")
async def search_cards(
    request: Request,
    faction: Optional[str] = None,
    type: Optional[str] = None,  # card type
    rarity: Optional[str] = None,
    costMin: Optional[int] = None,
    costMax: Optional[int] = None,
    search: Optional[str] = None,
    page: int = 1,
    pageSize: int = 20,
) -> JSONResponse:
    cards = _cards_store(request)
    results: List[Dict[str, Any]] = []
    for c in cards:
        if faction and c.get("faction") != faction:
            continue
        if type and c.get("type") != type:
            continue
        if rarity and c.get("rarity") != rarity:
            continue
        if costMin is not None and int(c.get("cost", 0)) < costMin:
            continue
        if costMax is not None and int(c.get("cost", 0)) > costMax:
            continue
        if search:
            s = search.lower()
            if (
                s not in str(c.get("name", "")).lower()
                and s not in str(c.get("description", "")).lower()
            ):
                continue
        results.append(c)

    start = max(0, (page - 1) * pageSize)
    end = start + pageSize
    page_items = results[start:end]
    resp = JSONResponse({
        "cards": page_items,
        "total": len(results),
        "page": page,
        "pageSize": pageSize,
    })
    # Encourage edge/browser caching for brief period to reduce load
    try:
        max_age = int(os.environ.get("CARDS_HTTP_CACHE_SEC", "60"))
    except ValueError:
        max_age = 60
    try:
        swr = int(os.environ.get("CARDS_HTTP_SWR_SEC", "300"))
    except ValueError:
        swr = 300
    resp.headers["Cache-Control"] = (
        f"public, max-age={max_age}, stale-while-revalidate={swr}"
    )
    return resp


@router.get("/cards/{card_id}")
async def get_card(card_id: str, request: Request) -> JSONResponse:
    cards = _cards_store(request)
    for c in cards:
        if c.get("id") == card_id:
            return JSONResponse(c)
    raise HTTPException(status_code=404, detail="Card not found")


@router.get("/users/{user_id}/cards")
async def get_user_cards(user_id: str, request: Request) -> JSONResponse:
    # Placeholder: return empty collection; integrate with real DB later
    return JSONResponse([])


