from __future__ import annotations

import asyncio
import psutil
import time
from typing import Dict, Any

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from . import realtime_ws

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

# Global metrics storage
_server_metrics = {
    'start_time': time.time(),
    'request_count': 0,
    'error_count': 0,
    'response_times': [],
    'active_connections': 0,
    'peak_memory_usage': 0,
    'database_operations': 0
}


def record_request():
    """Record a new request for metrics tracking."""
    _server_metrics['request_count'] += 1


def record_error():
    """Record an error for metrics tracking."""
    _server_metrics['error_count'] += 1


def record_response_time(response_time: float):
    """Record response time for metrics tracking."""
    _server_metrics['response_times'].append(response_time)
    # Keep only last 1000 response times to avoid memory growth
    if len(_server_metrics['response_times']) > 1000:
        _server_metrics['response_times'] = _server_metrics['response_times'][-1000:]


def record_db_operation():
    """Record a database operation for metrics tracking."""
    _server_metrics['database_operations'] += 1


def update_active_connections(delta: int):
    """Update active connection count."""
    _server_metrics['active_connections'] += delta


@router.get("/realtime")
def get_realtime_metrics() -> JSONResponse:
    """Get real-time WebSocket metrics."""
    m = getattr(realtime_ws.manager, "metrics", None)
    if not isinstance(m, dict):
        return JSONResponse({"error": "metrics unavailable"}, status_code=503)
    return JSONResponse(m)


@router.get("/server")
async def get_server_metrics() -> JSONResponse:
    """Get comprehensive server performance metrics."""
    # Get system resource usage
    process = psutil.Process()
    memory_info = process.memory_info()
    cpu_percent = process.cpu_percent()

    # Update peak memory usage
    if memory_info.rss > _server_metrics['peak_memory_usage']:
        _server_metrics['peak_memory_usage'] = memory_info.rss

    # Calculate response time statistics
    response_times = _server_metrics['response_times']
    avg_response_time = sum(response_times) / len(response_times) if response_times else 0
    max_response_time = max(response_times) if response_times else 0
    min_response_time = min(response_times) if response_times else 0

    # Calculate uptime
    uptime = time.time() - _server_metrics['start_time']

    metrics = {
        "server": {
            "uptime_seconds": uptime,
            "request_count": _server_metrics['request_count'],
            "error_count": _server_metrics['error_count'],
            "error_rate": _server_metrics['error_count'] / max(_server_metrics['request_count'], 1),
            "active_connections": _server_metrics['active_connections'],
            "database_operations": _server_metrics['database_operations']
        },
        "performance": {
            "avg_response_time_ms": avg_response_time * 1000,
            "max_response_time_ms": max_response_time * 1000,
            "min_response_time_ms": min_response_time * 1000,
            "requests_per_second": _server_metrics['request_count'] / max(uptime, 1)
        },
        "system": {
            "memory_usage_mb": memory_info.rss / (1024 * 1024),
            "peak_memory_usage_mb": _server_metrics['peak_memory_usage'] / (1024 * 1024),
            "cpu_percent": cpu_percent,
            "virtual_memory_mb": memory_info.vms / (1024 * 1024),
            "open_files": len(process.open_files()),
            "thread_count": process.num_threads()
        }
    }

    return JSONResponse(metrics)


@router.get("/health")
async def get_health_metrics() -> JSONResponse:
    """Get basic health status and key metrics for monitoring."""
    uptime = time.time() - _server_metrics['start_time']
    memory_usage = psutil.Process().memory_info().rss / (1024 * 1024)

    # Determine health status based on key metrics
    health_status = "healthy"
    warnings = []

    # Check error rate (> 5% is concerning)
    error_rate = _server_metrics['error_count'] / max(_server_metrics['request_count'], 1)
    if error_rate > 0.05:
        health_status = "warning"
        warnings.append(f"High error rate: {error_rate:.1%}")

    # Check memory usage (> 1GB is concerning for this app)
    if memory_usage > 1024:
        health_status = "warning"
        warnings.append(f"High memory usage: {memory_usage:.0f}MB")

    # Check if server has been running (< 60s might indicate restart issues)
    if uptime < 60 and _server_metrics['request_count'] > 0:
        health_status = "warning"
        warnings.append("Recent restart detected")

    health_data = {
        "status": health_status,
        "uptime_seconds": uptime,
        "memory_usage_mb": memory_usage,
        "request_count": _server_metrics['request_count'],
        "error_rate": error_rate,
        "warnings": warnings
    }

    status_code = 200 if health_status == "healthy" else 418
    return JSONResponse(health_data, status_code=status_code)
