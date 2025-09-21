"""
Middleware package for Crisis Unleashed Backend.
"""
# Use absolute import instead of relative import
from backend.middleware.service_dependency import ServiceDependencyMiddleware

__all__ = ["ServiceDependencyMiddleware"]
