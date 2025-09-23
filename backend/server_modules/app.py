"""
Application Factory Module

This module provides functionality to create and configure the FastAPI application.
"""

import asyncio
import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.middleware.service_dependency import ServiceDependencyMiddleware

logger = logging.getLogger(__name__)

def create_application(
    settings: Any,
    blockchain_router: Any,
    health_manager: Any,
    db: Any,
    lifespan: Any = None
) -> FastAPI:
    """
    Create and configure the FastAPI application with all middleware and routers.

    Args:
        settings: Application settings
        blockchain_router: Router for blockchain endpoints
        health_manager: Service health manager
        db: Database connection

    Returns:
        Configured FastAPI application
    """
    # Create FastAPI app with appropriate metadata
    app = FastAPI(
        title="Crisis Unleashed API",
        description="Backend API for the Crisis Unleashed game",
        version="1.0.0",
        docs_url="/api/docs" if not getattr(settings, "disable_docs", False) else None,
        redoc_url="/api/redoc" if not getattr(settings, "disable_docs", False) else None,
        lifespan=lifespan
    )

    # Configure CORS with proper validation
    cors_origins = getattr(settings, "cors_origins", [])
    if isinstance(cors_origins, str):
        cors_origins = [o.strip() for o in cors_origins.split(",") if o.strip()]
    if not isinstance(cors_origins, (list, tuple)):
        raise ValueError("settings.cors_origins must be a list/tuple of origins")
    allow_credentials = bool(getattr(settings, "cors_allow_credentials", True))
    if "*" in cors_origins and allow_credentials:
        raise ValueError("Cannot use '*' in CORS when allow_credentials=True")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "X-CSRF-Token",
        ],
        expose_headers=getattr(settings, "cors_expose_headers", ["X-Request-Id"]),
        max_age=600,
    )

    # Add service dependency middleware
    app.add_middleware(
        ServiceDependencyMiddleware,
        health_manager=health_manager
    )

    # Add database to request state with proper session management
    @app.middleware("http")
    async def add_db_to_request(request: Request, call_next):
        created_session = callable(db)
        session = db() if created_session else db
        try:
            request.state.db = session
            return await call_next(request)
        finally:
            if created_session:
                close = getattr(session, "close", None)
                if close is not None:
                    res = close()
                    if asyncio.iscoroutine(res):
                        await res

    # Basic root endpoint
    @app.get("/")
    def root():
        return {
            "name": "Crisis Unleashed API",
            "version": "1.0.0",
            "status": "operational"
        }

    # Add exception handlers
    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

    # Include blockchain router under /api prefix
    app.include_router(blockchain_router, prefix="/api")

    return app