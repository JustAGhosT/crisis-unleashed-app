"""
Comprehensive API Documentation Configuration

Provides enhanced OpenAPI/Swagger documentation with detailed schemas,
examples, and interactive API exploration for Crisis Unleashed.
"""

from typing import Dict, Any, List, Optional
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import json

# Enhanced API Models for Documentation
class ErrorResponse(BaseModel):
    """Standard error response model."""
    error: Dict[str, Any] = Field(
        ...,
        description="Error details",
        example={
            "id": "err_123456789",
            "timestamp": "2023-12-07T10:00:00Z",
            "category": "validation",
            "severity": "low",
            "message": "Validation failed for 1 field(s)",
            "suggestions": ["Check your input data format and try again"]
        }
    )
    success: bool = Field(False, description="Always false for error responses")

class SuccessResponse(BaseModel):
    """Standard success response model."""
    data: Any = Field(..., description="Response data")
    success: bool = Field(True, description="Always true for success responses")
    message: Optional[str] = Field(None, description="Optional success message")
    timestamp: str = Field(..., description="ISO timestamp of the response")

class PaginatedResponse(BaseModel):
    """Paginated response model."""
    data: List[Any] = Field(..., description="Array of items")
    pagination: Dict[str, Any] = Field(
        ...,
        description="Pagination information",
        example={
            "page": 1,
            "limit": 20,
            "total": 100,
            "total_pages": 5,
            "has_next": True,
            "has_previous": False
        }
    )
    success: bool = Field(True, description="Always true for success responses")
    timestamp: str = Field(..., description="ISO timestamp of the response")

# Game-specific models for documentation
class CardModel(BaseModel):
    """Card model for API documentation."""
    id: str = Field(..., description="Unique card identifier", example="123e4567-e89b-12d3-a456-426614174000")
    name: str = Field(..., description="Card name", example="Solar Guardian", min_length=1, max_length=100)
    description: str = Field(..., description="Card description", example="A powerful guardian that channels solar energy", max_length=500)
    cost: int = Field(..., description="Energy cost to play the card", ge=0, le=20, example=3)
    power: Optional[int] = Field(None, description="Attack power (for units/heroes)", ge=0, le=20, example=4)
    health: Optional[int] = Field(None, description="Health points (for units/heroes)", ge=0, le=20, example=6)
    type: str = Field(..., description="Card type", example="unit", regex="^(hero|unit|action|structure)$")
    rarity: str = Field(..., description="Card rarity", example="rare", regex="^(common|uncommon|rare|epic|legendary)$")
    faction: str = Field(..., description="Card faction", example="Solaris Nexus")
    abilities: List[str] = Field(default=[], description="List of card abilities", example=["Solar Charge: Gain 2 energy when played"])
    image_url: Optional[str] = Field(None, description="Card image URL", example="https://cdn.crisisunleashed.com/cards/solar-guardian.jpg")
    is_owned: bool = Field(default=False, description="Whether the current user owns this card")

class UserModel(BaseModel):
    """User model for API documentation."""
    id: str = Field(..., description="Unique user identifier", example="user_123456789")
    username: str = Field(..., description="Username", example="player123", min_length=3, max_length=30)
    email: str = Field(..., description="User email", example="player@example.com")
    role: str = Field(..., description="User role", example="user", regex="^(user|admin|moderator)$")
    created_at: str = Field(..., description="Account creation timestamp", example="2023-01-15T10:00:00Z")
    updated_at: str = Field(..., description="Last update timestamp", example="2023-12-07T10:00:00Z")
    is_active: bool = Field(..., description="Whether the account is active", example=True)

class DeckModel(BaseModel):
    """Deck model for API documentation."""
    id: str = Field(..., description="Unique deck identifier", example="deck_123456789")
    name: str = Field(..., description="Deck name", example="Solar Control", min_length=1, max_length=50)
    description: Optional[str] = Field(None, description="Deck description", example="A control deck focusing on energy manipulation", max_length=200)
    cards: List[Dict[str, Any]] = Field(
        ...,
        description="Cards in the deck",
        example=[
            {"card_id": "card_123", "quantity": 3},
            {"card_id": "card_456", "quantity": 2}
        ]
    )
    factions: List[str] = Field(..., description="Factions used in the deck", min_items=1, max_items=2, example=["Solaris Nexus"])
    is_public: bool = Field(default=False, description="Whether the deck is publicly visible")
    created_at: str = Field(..., description="Deck creation timestamp", example="2023-12-01T10:00:00Z")
    updated_at: str = Field(..., description="Last update timestamp", example="2023-12-07T10:00:00Z")
    owner: Dict[str, str] = Field(..., description="Deck owner information", example={"id": "user_123", "username": "player123"})

class GameModel(BaseModel):
    """Game model for API documentation."""
    id: str = Field(..., description="Unique game identifier", example="game_123456789")
    players: List[str] = Field(..., description="Player IDs in the game", min_items=2, max_items=4)
    status: str = Field(..., description="Game status", example="in_progress", regex="^(waiting|in_progress|completed|cancelled)$")
    current_turn: int = Field(..., description="Current turn number", ge=1, example=5)
    created_at: str = Field(..., description="Game creation timestamp", example="2023-12-07T09:30:00Z")
    updated_at: str = Field(..., description="Last update timestamp", example="2023-12-07T10:15:00Z")

# Request models
class LoginRequest(BaseModel):
    """Login request model."""
    email: str = Field(..., description="User email", example="player@example.com")
    password: str = Field(..., description="User password", min_length=8, max_length=128)
    remember_me: bool = Field(default=False, description="Keep user logged in")

class CreateDeckRequest(BaseModel):
    """Create deck request model."""
    name: str = Field(..., description="Deck name", min_length=1, max_length=50, example="My New Deck")
    description: Optional[str] = Field(None, description="Deck description", max_length=200, example="An aggressive deck focusing on early game pressure")
    cards: List[Dict[str, Any]] = Field(
        ...,
        description="Cards in the deck (30-50 cards total)",
        min_items=30,
        max_items=50,
        example=[
            {"card_id": "card_123", "quantity": 3},
            {"card_id": "card_456", "quantity": 2}
        ]
    )
    factions: List[str] = Field(..., description="Factions (1-2 allowed)", min_items=1, max_items=2, example=["Solaris Nexus"])
    is_public: bool = Field(default=False, description="Make deck publicly visible")

def create_enhanced_openapi_schema(app: FastAPI) -> Dict[str, Any]:
    """
    Create enhanced OpenAPI schema with comprehensive documentation.
    """
    if app.openapi_schema:
        return app.openapi_schema

    # Generate base OpenAPI schema
    openapi_schema = get_openapi(
        title="Crisis Unleashed API",
        version="1.0.0",
        description="""
# Crisis Unleashed API Documentation

Welcome to the comprehensive API documentation for Crisis Unleashed, a strategic digital card game with blockchain integration.

## Overview

Crisis Unleashed is a faction-based card game where players build decks and engage in strategic battles. The game features:

- **Seven Unique Factions** with distinct mechanics and playstyles
- **Blockchain Integration** for card ownership and trading
- **Real-time Multiplayer** battles with WebSocket support
- **Comprehensive Deck Building** with validation and constraints

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API endpoints are rate limited to ensure fair usage:
- **Default**: 100 requests per minute
- **Authentication**: 5 login attempts per 5 minutes
- **Blockchain Operations**: 10 requests per minute

Rate limit information is included in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

## Error Handling

All errors follow a consistent structure with helpful information:

```json
{
  "error": {
    "id": "err_123456789",
    "timestamp": "2023-12-07T10:00:00Z",
    "category": "validation",
    "severity": "low",
    "message": "Validation failed",
    "suggestions": ["Check your input format"]
  },
  "success": false
}
```

## Pagination

List endpoints support pagination with consistent parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

## WebSocket Events

Real-time features use WebSocket connections at `/ws`. Events include:
- `game_update`: Game state changes
- `player_action`: Player actions in games
- `chat_message`: In-game chat messages

## SDKs and Tools

- **TypeScript SDK**: Auto-generated from this OpenAPI specification
- **Postman Collection**: Available for API testing
- **Rate Limiting**: Built-in protection with informative headers
        """,
        routes=app.routes,
        tags=[
            {
                "name": "Authentication",
                "description": "User authentication and session management"
            },
            {
                "name": "Cards",
                "description": "Card management and collection browsing"
            },
            {
                "name": "Decks",
                "description": "Deck building, sharing, and management"
            },
            {
                "name": "Games",
                "description": "Game creation, joining, and real-time gameplay"
            },
            {
                "name": "Blockchain",
                "description": "NFT minting, transfers, and blockchain operations"
            },
            {
                "name": "Users",
                "description": "User profiles and account management"
            },
            {
                "name": "Metrics",
                "description": "System metrics and health monitoring"
            },
            {
                "name": "Admin",
                "description": "Administrative endpoints (requires admin role)"
            }
        ]
    )

    # Add security schemes
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT token obtained from login endpoint"
        },
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": "API key for service-to-service authentication"
        }
    }

    # Add common response schemas
    openapi_schema["components"]["schemas"].update({
        "ErrorResponse": ErrorResponse.model_json_schema(),
        "SuccessResponse": SuccessResponse.model_json_schema(),
        "PaginatedResponse": PaginatedResponse.model_json_schema(),
        "Card": CardModel.model_json_schema(),
        "User": UserModel.model_json_schema(),
        "Deck": DeckModel.model_json_schema(),
        "Game": GameModel.model_json_schema(),
        "LoginRequest": LoginRequest.model_json_schema(),
        "CreateDeckRequest": CreateDeckRequest.model_json_schema(),
    })

    # Add common response examples
    openapi_schema["components"]["examples"] = {
        "ValidationError": {
            "summary": "Validation Error Example",
            "value": {
                "error": {
                    "id": "err_123456789",
                    "timestamp": "2023-12-07T10:00:00Z",
                    "category": "validation",
                    "severity": "low",
                    "message": "Validation failed for 2 field(s)",
                    "details": {
                        "field_errors": {
                            "email": {
                                "message": "Invalid email format",
                                "type": "value_error.email",
                                "input": "invalid-email"
                            },
                            "password": {
                                "message": "Password must be at least 8 characters",
                                "type": "value_error.any_str.min_length",
                                "input": "123"
                            }
                        }
                    },
                    "suggestions": [
                        "Check your email format",
                        "Ensure password meets minimum requirements"
                    ]
                },
                "success": False
            }
        },
        "RateLimitError": {
            "summary": "Rate Limit Exceeded Example",
            "value": {
                "error": {
                    "message": "Rate limit exceeded",
                    "type": "rate_limit_error",
                    "details": {
                        "limit": 5,
                        "remaining": 0,
                        "reset": 1701937200,
                        "window": 300
                    }
                }
            }
        },
        "ServerError": {
            "summary": "Server Error Example",
            "value": {
                "error": {
                    "id": "err_987654321",
                    "timestamp": "2023-12-07T10:00:00Z",
                    "category": "system",
                    "severity": "high",
                    "message": "An internal server error occurred",
                    "suggestions": [
                        "This is a server error. Please try again later or contact support"
                    ]
                },
                "success": False
            }
        },
        "CardExample": {
            "summary": "Card Example",
            "value": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Solar Guardian",
                "description": "A powerful guardian that channels solar energy to protect allies and devastate enemies.",
                "cost": 4,
                "power": 5,
                "health": 7,
                "type": "unit",
                "rarity": "rare",
                "faction": "Solaris Nexus",
                "abilities": [
                    "Solar Charge: Gain 2 energy when played",
                    "Guardian: Can block attacks for adjacent allies"
                ],
                "image_url": "https://cdn.crisisunleashed.com/cards/solar-guardian.jpg",
                "is_owned": True
            }
        },
        "DeckExample": {
            "summary": "Deck Example",
            "value": {
                "id": "deck_123456789",
                "name": "Solar Dominance",
                "description": "A control deck that uses solar energy manipulation to overwhelm opponents",
                "cards": [
                    {"card_id": "card_solar_guardian", "quantity": 3},
                    {"card_id": "card_energy_crystal", "quantity": 2},
                    {"card_id": "card_solar_flare", "quantity": 3}
                ],
                "factions": ["Solaris Nexus"],
                "is_public": True,
                "created_at": "2023-12-01T10:00:00Z",
                "updated_at": "2023-12-07T10:00:00Z",
                "owner": {
                    "id": "user_123456789",
                    "username": "SolarMaster"
                }
            }
        }
    }

    # Add server information
    openapi_schema["servers"] = [
        {
            "url": "http://localhost:8010",
            "description": "Development server"
        },
        {
            "url": "https://api-staging.crisisunleashed.com",
            "description": "Staging server"
        },
        {
            "url": "https://api.crisisunleashed.com",
            "description": "Production server"
        }
    ]

    # Add contact information
    openapi_schema["info"]["contact"] = {
        "name": "Crisis Unleashed API Support",
        "url": "https://crisisunleashed.com/support",
        "email": "api-support@crisisunleashed.com"
    }

    openapi_schema["info"]["license"] = {
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }

    # Add external documentation
    openapi_schema["externalDocs"] = {
        "description": "Complete Game Documentation",
        "url": "https://docs.crisisunleashed.com"
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

def setup_api_docs(app: FastAPI, docs_url: str = "/docs", redoc_url: str = "/redoc"):
    """
    Setup enhanced API documentation with custom styling and features.
    """

    # Custom Swagger UI with enhanced features
    @app.get("/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title=f"{app.title} - Interactive API Documentation",
            swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
            swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
            swagger_favicon_url="https://crisisunleashed.com/favicon.ico",
            oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
            init_oauth={
                "usePkceWithAuthorizationCodeGrant": True,
            },
            swagger_ui_parameters={
                "deepLinking": True,
                "displayRequestDuration": True,
                "defaultModelsExpandDepth": 2,
                "defaultModelExpandDepth": 2,
                "displayOperationId": True,
                "tryItOutEnabled": True,
                "filter": True,
                "showExtensions": True,
                "showCommonExtensions": True,
                "syntaxHighlight.activate": True,
                "syntaxHighlight.theme": "agate",
            }
        )

    # Custom ReDoc with enhanced styling
    @app.get("/redoc", include_in_schema=False)
    async def redoc_html():
        return get_redoc_html(
            openapi_url=app.openapi_url,
            title=f"{app.title} - API Reference",
            redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@2.1.3/bundles/redoc.standalone.js",
            redoc_favicon_url="https://crisisunleashed.com/favicon.ico",
            with_google_fonts=True
        )

    # Add OpenAPI JSON endpoint with caching headers
    @app.get("/openapi.json", include_in_schema=False)
    async def get_openapi_json():
        from fastapi.responses import JSONResponse

        return JSONResponse(
            content=create_enhanced_openapi_schema(app),
            headers={
                "Cache-Control": "max-age=300",  # Cache for 5 minutes
                "Content-Type": "application/json"
            }
        )

    # API Documentation landing page
    @app.get("/api-docs", include_in_schema=False)
    async def api_docs_landing():
        from fastapi.responses import HTMLResponse

        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Crisis Unleashed API Documentation</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; margin: -20px -20px 40px -20px; }
                .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .links a { display: inline-block; margin: 10px 20px 10px 0; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; }
                .links a:hover { background: #5a67d8; }
                .feature { margin: 20px 0; }
                .feature h3 { color: #4a5568; margin-bottom: 8px; }
                .feature p { color: #718096; margin: 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Crisis Unleashed API</h1>
                <p>Comprehensive API documentation for the strategic card game</p>
            </div>

            <div class="card">
                <h2>API Documentation</h2>
                <div class="links">
                    <a href="/docs">Interactive API Docs (Swagger UI)</a>
                    <a href="/redoc">API Reference (ReDoc)</a>
                    <a href="/openapi.json">OpenAPI Specification (JSON)</a>
                </div>
            </div>

            <div class="card">
                <h2>Key Features</h2>
                <div class="feature">
                    <h3>🎮 Game Mechanics</h3>
                    <p>Seven unique factions with distinct abilities and strategic depth</p>
                </div>
                <div class="feature">
                    <h3>⛓️ Blockchain Integration</h3>
                    <p>NFT-based card ownership with cross-chain support</p>
                </div>
                <div class="feature">
                    <h3>⚡ Real-time Gameplay</h3>
                    <p>WebSocket-based multiplayer with instant updates</p>
                </div>
                <div class="feature">
                    <h3>🛡️ Security & Rate Limiting</h3>
                    <p>Comprehensive security measures and fair usage policies</p>
                </div>
                <div class="feature">
                    <h3>📊 Monitoring & Analytics</h3>
                    <p>Built-in metrics, health checks, and performance monitoring</p>
                </div>
            </div>

            <div class="card">
                <h2>Quick Start</h2>
                <ol>
                    <li><strong>Authentication:</strong> Obtain a JWT token from <code>POST /api/auth/login</code></li>
                    <li><strong>Browse Cards:</strong> Get available cards from <code>GET /api/cards</code></li>
                    <li><strong>Build a Deck:</strong> Create a deck using <code>POST /api/decks</code></li>
                    <li><strong>Start Playing:</strong> Join or create games via <code>POST /api/games</code></li>
                </ol>
                <p><em>All endpoints require authentication unless specified otherwise.</em></p>
            </div>

            <div class="card">
                <h2>SDKs and Tools</h2>
                <p>TypeScript SDK and Postman collections are automatically generated from this API specification.</p>
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=html_content)

def add_documentation_examples(app: FastAPI):
    """Add comprehensive examples to API endpoints."""

    # This function would be called after all routes are added to inject examples
    # into the OpenAPI schema. Examples include request/response samples,
    # error scenarios, and edge cases.

    pass

# Export key models for use in other modules
__all__ = [
    "ErrorResponse",
    "SuccessResponse",
    "PaginatedResponse",
    "CardModel",
    "UserModel",
    "DeckModel",
    "GameModel",
    "LoginRequest",
    "CreateDeckRequest",
    "create_enhanced_openapi_schema",
    "setup_api_docs"
]