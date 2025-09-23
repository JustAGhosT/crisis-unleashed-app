"""
Comprehensive API documentation utilities for Crisis Unleashed backend.

This module provides enhanced documentation features for FastAPI including
automatic schema generation, examples, and interactive documentation.
"""

from typing import Dict, Any, List, Optional, Union
from fastapi import FastAPI
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse


class APIDocumentationConfig:
    """Configuration for API documentation generation."""

    def __init__(
        self,
        title: str = "Crisis Unleashed API",
        description: str = "Comprehensive API for Crisis Unleashed - Strategic Card Game",
        version: str = "1.0.0",
        terms_of_service: Optional[str] = None,
        contact: Optional[Dict[str, str]] = None,
        license_info: Optional[Dict[str, str]] = None,
        servers: Optional[List[Dict[str, str]]] = None
    ):
        """
        Initialize API documentation configuration.

        Args:
            title: API title
            description: API description
            version: API version
            terms_of_service: Terms of service URL
            contact: Contact information
            license_info: License information
            servers: Server information
        """
        self.title = title
        self.description = description
        self.version = version
        self.terms_of_service = terms_of_service
        self.contact = contact or {
            "name": "Crisis Unleashed Team",
            "url": "https://crisis-unleashed.com/support",
            "email": "support@crisis-unleashed.com"
        }
        self.license_info = license_info or {
            "name": "Proprietary",
            "url": "https://crisis-unleashed.com/license"
        }
        self.servers = servers or [
            {
                "url": "https://api.crisis-unleashed.com",
                "description": "Production server"
            },
            {
                "url": "https://staging-api.crisis-unleashed.com",
                "description": "Staging server"
            },
            {
                "url": "http://localhost:8010",
                "description": "Development server"
            }
        ]

    def get_extended_description(self) -> str:
        """Get extended API description with features and usage information."""
        return f"""
{self.description}

## Features

🎮 **Game Management**
- Comprehensive card and deck management
- Real-time multiplayer functionality
- Advanced faction-based gameplay mechanics

🔗 **Blockchain Integration**
- Multi-chain NFT support (Ethereum, Etherlink, Solana)
- Secure transaction processing
- Decentralized asset ownership

🔐 **Authentication & Security**
- JWT-based authentication
- OAuth2 social login support
- Advanced rate limiting and security measures

📊 **Analytics & Monitoring**
- Real-time health monitoring
- Comprehensive metrics and statistics
- Performance analytics

## Getting Started

### Authentication
Most endpoints require authentication. You can authenticate using:
1. **JWT Bearer Token**: Include `Authorization: Bearer <token>` header
2. **Social OAuth**: Use `/auth/social-login` endpoint

### Rate Limits
- **Anonymous users**: 100 requests/minute, 1000 requests/hour
- **Authenticated users**: 200 requests/minute, 2000 requests/hour
- **Premium users**: 500 requests/minute, 5000 requests/hour

### Error Handling
The API uses standard HTTP status codes and returns detailed error information:
```json
{{
  "error": "Error type",
  "message": "Detailed error message",
  "details": {{ "additional": "context" }}
}}
```

### WebSocket Support
Real-time features are available via WebSocket connections at `/ws/realtime`.

## Response Format

All API responses follow a consistent format:
- **Success**: HTTP 2xx with JSON data
- **Error**: HTTP 4xx/5xx with error details
- **Rate Limited**: HTTP 429 with retry information

## Support

For technical support or questions:
- 📧 Email: {self.contact.get('email', 'support@crisis-unleashed.com')}
- 🌐 Website: {self.contact.get('url', 'https://crisis-unleashed.com')}
- 📖 Documentation: https://docs.crisis-unleashed.com

## Version History

### v1.0.0
- Initial API release
- Core game functionality
- Blockchain integration
- Authentication system
"""


def create_custom_openapi_schema(app: FastAPI, config: APIDocumentationConfig) -> Dict[str, Any]:
    """
    Create enhanced OpenAPI schema with comprehensive documentation.

    Args:
        app: FastAPI application
        config: Documentation configuration

    Returns:
        Enhanced OpenAPI schema
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=config.title,
        version=config.version,
        description=config.get_extended_description(),
        routes=app.routes,
        servers=config.servers,
        terms_of_service=config.terms_of_service,
        contact=config.contact,
        license_info=config.license_info
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT Bearer token for authenticated requests"
        },
        "OAuth2": {
            "type": "oauth2",
            "flows": {
                "authorizationCode": {
                    "authorizationUrl": "/auth/oauth/authorize",
                    "tokenUrl": "/auth/oauth/token",
                    "scopes": {
                        "read": "Read access to user data",
                        "write": "Write access to user data",
                        "admin": "Administrative access"
                    }
                }
            },
            "description": "OAuth2 authentication with PKCE"
        }
    }

    # Add common response schemas
    openapi_schema["components"]["schemas"].update({
        "ErrorResponse": {
            "type": "object",
            "properties": {
                "error": {"type": "string", "description": "Error type"},
                "message": {"type": "string", "description": "Error message"},
                "details": {"type": "object", "description": "Additional error details"}
            },
            "required": ["error", "message"]
        },
        "HealthStatus": {
            "type": "object",
            "properties": {
                "status": {"type": "string", "enum": ["healthy", "degraded", "unhealthy"]},
                "timestamp": {"type": "string", "format": "date-time"},
                "services": {"type": "object", "description": "Service health statuses"},
                "version": {"type": "string", "description": "API version"}
            }
        },
        "PaginatedResponse": {
            "type": "object",
            "properties": {
                "items": {"type": "array", "description": "List of items"},
                "total": {"type": "integer", "description": "Total number of items"},
                "page": {"type": "integer", "description": "Current page number"},
                "per_page": {"type": "integer", "description": "Items per page"},
                "pages": {"type": "integer", "description": "Total number of pages"}
            }
        }
    })

    # Add tags with descriptions
    openapi_schema["tags"] = [
        {
            "name": "Authentication",
            "description": "User authentication and session management endpoints"
        },
        {
            "name": "Cards",
            "description": "Game card management and information endpoints"
        },
        {
            "name": "Decks",
            "description": "Deck building and management endpoints"
        },
        {
            "name": "Blockchain",
            "description": "Blockchain integration and NFT operations"
        },
        {
            "name": "Health",
            "description": "System health and monitoring endpoints"
        },
        {
            "name": "Realtime",
            "description": "WebSocket and real-time functionality"
        },
        {
            "name": "Admin",
            "description": "Administrative endpoints (requires admin privileges)"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


def setup_enhanced_docs(app: FastAPI, config: Optional[APIDocumentationConfig] = None):
    """
    Setup enhanced documentation for FastAPI application.

    Args:
        app: FastAPI application
        config: Documentation configuration
    """
    if config is None:
        config = APIDocumentationConfig()

    # Custom OpenAPI schema
    app.openapi = lambda: create_custom_openapi_schema(app, config)

    # Custom Swagger UI
    @app.get("/docs", response_class=HTMLResponse, include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url="/openapi.json",
            title=f"{config.title} - Interactive API Documentation",
            swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
            swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
            swagger_ui_parameters={
                "deepLinking": True,
                "displayRequestDuration": True,
                "docExpansion": "list",
                "operationsSorter": "method",
                "filter": True,
                "tryItOutEnabled": True
            }
        )

    # Custom ReDoc
    @app.get("/redoc", response_class=HTMLResponse, include_in_schema=False)
    async def redoc_html():
        return get_redoc_html(
            openapi_url="/openapi.json",
            title=f"{config.title} - API Reference",
            redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@2.1.3/bundles/redoc.standalone.js"
        )

    # API Information endpoint
    @app.get("/api/info", tags=["Health"])
    async def api_info():
        """Get API information and capabilities."""
        return {
            "name": config.title,
            "version": config.version,
            "description": config.description,
            "documentation": {
                "interactive": "/docs",
                "reference": "/redoc",
                "openapi_schema": "/openapi.json"
            },
            "contact": config.contact,
            "license": config.license_info,
            "servers": config.servers,
            "features": [
                "JWT Authentication",
                "OAuth2 Social Login",
                "Real-time WebSocket",
                "Multi-chain Blockchain Integration",
                "Advanced Rate Limiting",
                "Comprehensive Monitoring"
            ]
        }


def add_response_examples(app: FastAPI):
    """
    Add comprehensive response examples to API endpoints.

    Args:
        app: FastAPI application
    """
    # This function can be used to programmatically add examples
    # to existing endpoints. For now, examples should be added
    # directly to the endpoint definitions using FastAPI's
    # response_model and examples parameters.
    pass


def create_api_changelog() -> Dict[str, Any]:
    """
    Create API changelog for version tracking.

    Returns:
        API changelog information
    """
    return {
        "versions": {
            "1.0.0": {
                "release_date": "2024-01-01",
                "changes": [
                    "Initial API release",
                    "Core authentication system",
                    "Basic card and deck management",
                    "Blockchain integration foundation"
                ],
                "breaking_changes": [],
                "deprecated": []
            }
        },
        "upcoming": {
            "features": [
                "Enhanced multiplayer functionality",
                "Advanced analytics endpoints",
                "Mobile app specific endpoints"
            ],
            "improvements": [
                "Performance optimizations",
                "Enhanced error messages",
                "Better rate limiting"
            ]
        }
    }


# OpenAPI response examples for common patterns
COMMON_RESPONSE_EXAMPLES = {
    "success": {
        "summary": "Successful operation",
        "value": {
            "success": True,
            "message": "Operation completed successfully",
            "data": {"id": "example_123"}
        }
    },
    "error_validation": {
        "summary": "Validation error",
        "value": {
            "error": "ValidationError",
            "message": "Invalid input data",
            "details": {
                "field": "email",
                "issue": "Invalid email format"
            }
        }
    },
    "error_auth": {
        "summary": "Authentication error",
        "value": {
            "error": "AuthenticationError",
            "message": "Invalid or expired token"
        }
    },
    "error_rate_limit": {
        "summary": "Rate limit exceeded",
        "value": {
            "error": "Rate limit exceeded",
            "limit": 100,
            "window_seconds": 60,
            "retry_after_seconds": 45
        }
    },
    "paginated_response": {
        "summary": "Paginated response",
        "value": {
            "items": [{"id": 1, "name": "Example"}],
            "total": 100,
            "page": 1,
            "per_page": 10,
            "pages": 10
        }
    }
}