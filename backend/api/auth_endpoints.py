"""
Authentication API endpoints for Crisis Unleashed.

Provides endpoints for user authentication and session management.
"""

import logging
import secrets
import re
import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

# Import authentication services
from .auth import AuthenticationService, SocialAuthService

logger = logging.getLogger(__name__)

# Create router
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# Import constants from service
from .auth.auth_service import ERROR_MESSAGES, SUPPORTED_PROVIDERS


# Models
class UserCredentials(BaseModel):
    """User login credentials."""
    username: Optional[str] = None
    email: Optional[str] = None
    password: str


from pydantic import Field

class SocialLoginRequest(BaseModel):
    """Social login request data."""
    provider: str
    provider_id: str = Field(alias="providerId")
    email: Optional[str] = None
    name: Optional[str] = None
    image: Optional[str] = None

    class Config:
        allow_population_by_field_name = True

class UserSession(BaseModel):
    """User session information."""
    id: str
    user_id: str
    username: str
    created_at: datetime
    expires_at: datetime


class AuthResponse(BaseModel):
    """Authentication response."""
    success: bool
    message: str
    user: Optional[Dict[str, Any]] = None
    token: Optional[str] = None




# Routes
@auth_router.post("/login", response_model=AuthResponse)
async def login(credentials: UserCredentials) -> AuthResponse:
    """
    Authenticate a user and create a session.
    
    Args:
        credentials: User login credentials
        
    Returns:
        Authentication response with user info and token
    """
    try:
        # Get email/username from credentials and sanitize
        username = AuthenticationService.sanitize_user_input(credentials.username or credentials.email or "")

        if not username:
            logger.warning("Login attempt without username or email")
            return AuthResponse(
                success=False,
                message=ERROR_MESSAGES["USERNAME_OR_EMAIL_REQUIRED"]
            )

        # Validate credentials using the service
        user = await AuthenticationService.validate_credentials(username, credentials.password)

        if user:
            # Create a secure token
            token = AuthenticationService.generate_secure_token()

            return AuthResponse(
                success=True,
                message="Authentication successful",
                user=user,
                token=token
            )
        else:
            logger.warning("Failed login attempt for supplied identifier")  # avoid PII
            return AuthResponse(
                success=False,
                message="Invalid username or password"
            )
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Authentication service error")


@auth_router.post("/social-login", response_model=AuthResponse)
async def social_login(request: SocialLoginRequest) -> AuthResponse:
    """
    Handle social login (OAuth) from providers like Google, Discord, etc.
    
    Args:
        request: Social login data from the provider
        
    Returns:
        Authentication response with user info
    """
    try:
        # Define allowlist of supported providers
        allowed_providers = list(SUPPORTED_PROVIDERS.keys())
        
        # Check if the provider is in the allowlist
        if request.provider.lower() not in allowed_providers:
            logger.warning(f"Unsupported social login provider: {request.provider}")
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported provider: {request.provider}. Supported providers: {', '.join(allowed_providers)}"
            )
        
        # Normalize and validate email if provided
        normalized_email = None
        if request.email:
            # Trim whitespace and convert to lowercase
            normalized_email = request.email.strip().lower()
            
            # Basic email validation using constant
            if not re.match(AUTH_CONSTANTS["EMAIL_REGEX"], normalized_email):
                logger.warning(f"Invalid email format provided during social login")
                normalized_email = None
                
        # Generate secure user identifiers (not derived from user input)
        user_id = f"user_{secrets.token_hex(8)}"
        username = request.name or f"user_{secrets.token_hex(6)}"
        
        # Create a secure token using secrets module
        token = secrets.token_urlsafe(32)

        user = {
            "id": user_id,
            "username": username,
            "email": normalized_email,  # Will be None if email was invalid or not provided
            "avatar": request.image,
            "role": "user"
        }

        return AuthResponse(
            success=True,
            message=f"Successfully authenticated with {request.provider}",
            user=user,
            token=token
        )

    except HTTPException:
        # Re-raise HTTP exceptions with their status codes intact
        raise
    except Exception as e:
        logger.error(f"Error during social login: {e}")
        raise HTTPException(status_code=500, detail="Social authentication service error")


from datetime import datetime, timedelta, timezone

@auth_router.get("/session", response_model=Dict[str, Any])
async def get_session(request: Request) -> Dict[str, Any]:
    """
    Get current session information in NextAuth compatible format.

    Args:
        request: HTTP request with auth header

    Returns:
        Session information
    """
    # Extract authorization header
    auth_header = request.headers.get("Authorization", "")

    # Look for session token in cookies
    session_token = (
        request.cookies.get("next-auth.session-token")
        or request.cookies.get("__Secure-next-auth.session-token")
    )

    # In a real implementation, validate the token
    if auth_header.startswith("Bearer ") and len(auth_header) > 7:
        # Extract and validate the actual token
        token = auth_header[7:]  # Remove "Bearer " prefix
        # TODO: Implement proper JWT validation or database lookup
        # For development only - validate against known tokens
        if token == "valid_development_token":
            # Mock user data for any valid-looking token
            return {
                "user": {
                    "id": "user_123",
                    "name": "Test User",
                    "email": "test@example.com",
                    "image": None,
                    "role": "user"
                },
                "expires": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
            }
    elif session_token:
        # TODO: Validate session token against database
        # For now, reject session token authentication in development
        pass
        
    # Return empty object for no session (NextAuth expects this format)
    return {}

@auth_router.post("/logout", response_model=AuthResponse)
async def logout() -> AuthResponse:
    """
    Log out the current user.
    
    Returns:
        Logout confirmation
    """
    return AuthResponse(
        success=True,
        message="Logged out successfully"
    )


@auth_router.post("/csrf", response_model=Dict[str, str])
async def get_csrf_token(request: Request) -> Dict[str, str]:
    """
    Get a CSRF token for form submissions.
    
    Args:
        request: HTTP request to extract session info
        
    Returns:
        CSRF token
    """
    # Generate a cryptographically secure random token
    # In production, this should also be:
    # - Stored in the user's session
    # - Time-bound with expiration
    # - Potentially signed with HMAC and timestamp
    
    # For development - generate a basic token
    # TODO: Implement proper CSRF token with session binding
    csrf_token = secrets.token_urlsafe(32)
    
    # In production, store this token in the user's session
    # and validate it on form submissions
    
    return {"csrfToken": csrf_token}


# NextAuth compatible endpoints
@auth_router.get("/providers")
async def get_auth_providers() -> Dict[str, Any]:
    """
    Get available authentication providers in NextAuth compatible format.
    
    Returns:
        Available auth providers
    """
    return {
        "credentials": {
            "id": "credentials",
            "name": "Credentials",
            "type": "credentials"
        },
        **SUPPORTED_PROVIDERS  # Include all supported providers from the shared constant
    }


@auth_router.post("/callback/credentials")
async def credentials_callback(credentials: UserCredentials) -> JSONResponse:
    """
    Handle NextAuth credentials callback.
    
    Args:
        credentials: User login credentials
        
    Returns:
        Authentication result in NextAuth compatible format
    """
    # Get email/username from credentials
    username = credentials.username or credentials.email

    if not username:
        return JSONResponse(
            status_code=401,
            content={"error": "Username or email is required"}
        )

    # Validate credentials using the shared function
    user = await validate_credentials(username, credentials.password)
    if user:
        return JSONResponse(user)
    else:
        # Return 401 for invalid credentials
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid username or password"}
        )