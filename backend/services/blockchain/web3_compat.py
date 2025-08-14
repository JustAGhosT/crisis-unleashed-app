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
except Exception:  # pragma: no cover
    WEB3_AVAILABLE = False

# Explicit class types to keep type-checkers happy across reassignments
_TxnNotFoundT: type[Exception] = Exception
_TimeExhaustedT: type[Exception] = Exception

if WEB3_AVAILABLE:
    try:
        _w3_exc_mod = importlib.import_module("web3.exceptions")
        _TxnNotFoundT = getattr(_w3_exc_mod, "TransactionNotFound", Exception)
        _TimeExhaustedT = getattr(_w3_exc_mod, "TimeExhausted", Exception)
    except Exception:
        pass
else:
    try:
        from ...types.web3_types import (
            MockTransactionNotFound as _TxNotFound,
            MockTimeExhausted as _TimeExhausted,
        )
        _TxnNotFoundT = _TxNotFound
        _TimeExhaustedT = _TimeExhausted
    except Exception:
        class _FallbackTransactionNotFound(Exception):
            """Fallback TransactionNotFound when web3/types are unavailable."""

        class _FallbackTimeExhausted(Exception):
            """Fallback TimeExhausted when web3/types are unavailable."""

        _TxnNotFoundT = _FallbackTransactionNotFound
        _TimeExhaustedT = _FallbackTimeExhausted

# Public aliases
TransactionNotFound = _TxnNotFoundT
TimeExhausted = _TimeExhaustedT


def new_web3(http_url: str) -> Optional[Any]:
    """Create a Web3 instance for the given HTTP RPC URL, or None if unavailable.
    Keeps import local to avoid global side-effects if web3 isn't installed.
    """
    if not WEB3_AVAILABLE:
        return None
    try:
        web3_mod = importlib.import_module("web3")
        return web3_mod.Web3(web3_mod.HTTPProvider(http_url))
    except Exception:
        return None
