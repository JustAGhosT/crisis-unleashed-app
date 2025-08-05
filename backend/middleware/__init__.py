"""
Middleware package for Crisis Unleashed Backend.
"""
from .service_dependency import ServiceDependencyMiddleware

__all__ = ["ServiceDependencyMiddleware"]