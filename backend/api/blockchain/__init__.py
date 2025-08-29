"""
Blockchain API endpoints package.

This package contains modules for blockchain operations,
status checking, and transaction management using the outbox pattern.
"""

from fastapi import APIRouter
from backend.api.blockchain.router import router

__all__ = ["router"]
