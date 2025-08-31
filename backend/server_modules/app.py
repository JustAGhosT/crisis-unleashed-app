"""
Application Factory Module

This module provides functionality to create and configure the FastAPI application.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Any

from backend.middleware.service_dependency import ServiceDependencyMiddleware

logger = logging.getLogger(__name__)

def create_application(
    settings: Any,
    blockchain_router: Any,
    health_manager: Any,
    db: Any
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
        docs_url="/api/docs" if not settings.disable_docs else None,
        redoc_url="/api/redoc" if not settings.disable_docs else None,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add service dependency middleware
    app.add_middleware(
        ServiceDependencyMiddleware,
        health_manager=health_manager
    )

    # Add database to request state
    @app.middleware("http")
    async def add_db_to_request(request: Request, call_next):
        request.state.db = db
        response = await call_next(request)
        return response

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
