"""
web3 compatibility layer for providers.
- Centralizes web3 availability checks
- Provides exception class aliases with stable typing
- Offers a small factory to create a Web3 instance
"""
from __future__ import annotations

import importlib
from typing import Any, Optional, TYPE_CHECKING

# Determine web3 availability once
try:  # pragma: no cover - import detection only
    importlib.import_module("web3")
    WEB3_AVAILABLE: bool = True
except ImportError:  # pragma: no cover
    WEB3_AVAILABLE = False

# Explicit class types to keep type-checkers happy across reassignments
_TxnNotFoundT: type[Exception] = Exception
_TimeExhaustedT: type[Exception] = Exception

if WEB3_AVAILABLE:
    try:
        _w3_exc_mod = importlib.import_module("web3.exceptions")
        _TxnNotFoundT = getattr(_w3_exc_mod, "TransactionNotFound", Exception)
        _TimeExhaustedT = getattr(_w3_exc_mod, "TimeExhausted", Exception)
    except ImportError:
        pass
else:
    try:
        from ...app_types.web3_types import (
            MockTransactionNotFound as _TxNotFound,
            MockTimeExhausted as _TimeExhausted,
        )
        _TxnNotFoundT = _TxNotFound
        _TimeExhaustedT = _TimeExhausted
    except ImportError:
        class _FallbackTransactionNotFound(Exception):
            """Fallback TransactionNotFound when web3/types are unavailable."""

        class _FallbackTimeExhausted(Exception):
            """Fallback TimeExhausted when web3/types are unavailable."""

        _TxnNotFoundT = _FallbackTransactionNotFound
        _TimeExhaustedT = _FallbackTimeExhausted

# Public aliases
TransactionNotFound = _TxnNotFoundT
TimeExhausted = _TimeExhaustedT


def new_web3(url: str) -> Optional[Any]:
    """Create a Web3 instance for the given RPC URL.
    - http/https -> HTTPProvider
    - ws/wss     -> WebsocketProvider
    Returns None if web3 isn't available or initialization fails.
    Keeps import local to avoid global side-effects if web3 isn't installed.
    """
    if not WEB3_AVAILABLE:
        return None
    try:
        from urllib.parse import urlparse
        web3_mod = importlib.import_module("web3")
        parsed = urlparse(url)
        scheme = (parsed.scheme or "").lower()

        if scheme in ("ws", "wss"):
            provider_cls = getattr(web3_mod, "WebsocketProvider", None)
            if provider_cls is None:
                return None
            provider = provider_cls(url)
        elif scheme in ("http", "https"):
            provider = web3_mod.HTTPProvider(url)
        else:
            # Unsupported/unknown scheme
            return None

        return web3_mod.Web3(provider)
    except Exception:
        return None
