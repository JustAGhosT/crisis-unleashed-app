from __future__ import annotations

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from . import realtime_ws

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("/realtime")
def get_realtime_metrics() -> JSONResponse:
    m = getattr(realtime_ws.manager, "metrics", None)
    if not isinstance(m, dict):
        return JSONResponse({"error": "metrics unavailable"}, status_code=503)
    return JSONResponse(m)
