"""
Crisis Unleashed Backend Package.

This is the main backend package for Crisis Unleashed, a strategic digital
collectible card game. The backend provides APIs for game management,
blockchain integration, and user operations.

Architecture:
- api/: HTTP endpoints and FastAPI routers
- repository/: Data access layer and database operations  
- services/: Business logic and service layer
- src/: Additional source code and utilities

Key Features:
- Transaction outbox pattern for blockchain consistency
- RESTful API endpoints
- MongoDB data persistence
- Blockchain integration (Etherlink, Ethereum)
"""

# Package metadata
__title__ = "Crisis Unleashed Backend"
__version__ = "1.0.0" 
__author__ = "Crisis Unleashed Team"
__description__ = "Backend API for Crisis Unleashed card game"

# Lazy submodule loading to avoid importing heavy dependencies (e.g., FastAPI) during test discovery.
# This preserves the public API: backend.api, backend.repository, backend.services

__all__ = ["api", "repository", "services"]

from types import ModuleType
from typing import Any, Optional

# Placeholders for static analyzers; actual modules are loaded lazily in __getattr__
# They remain None until first attribute access.
api: Optional[ModuleType] = None
repository: Optional[ModuleType] = None
services: Optional[ModuleType] = None

def __getattr__(name: str) -> Any:  # PEP 562
    if name in {"api", "repository", "services"}:
        import importlib
        module = importlib.import_module(f".{name}", __name__)
        globals()[name] = module
        return module
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")