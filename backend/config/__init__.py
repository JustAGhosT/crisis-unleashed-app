"""
Configuration Module for Crisis Unleashed Backend

This module handles all configuration settings for the application.
"""

from .settings import get_settings, Settings

# Re-export settings functionality for use in server.py
__all__ = ["get_settings", "Settings"]
