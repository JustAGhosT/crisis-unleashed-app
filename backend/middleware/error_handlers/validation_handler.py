"""
Specialized handler for validation errors.
"""

import logging
from typing import Dict, Any, Union
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError

from .base_handler import BaseErrorHandler, BaseErrorDetail

logger = logging.getLogger(__name__)


class ValidationErrorHandler(BaseErrorHandler):
    """Specialized handler for Pydantic and FastAPI validation errors."""

    ERROR_TYPE = "validation_error"

    def can_handle(self, error: Exception) -> bool:
        """Check if this is a validation error."""
        return isinstance(error, (RequestValidationError, ValidationError))

    def handle(self, error: Exception, request: Request, context: Dict[str, Any]) -> JSONResponse:
        """Handle validation errors with detailed field-level reporting."""
        validation_error = error if isinstance(error, (RequestValidationError, ValidationError)) else None

        if not validation_error:
            raise ValueError("Handler received non-validation error")

        # Log the error
        self.log_error(
            error,
            context,
            level=logging.WARNING,
            extra_info={"field_errors": len(validation_error.errors())}
        )

        # Extract detailed validation errors
        validation_details = self._extract_validation_details(validation_error)

        # Determine user-friendly message
        user_message = self._generate_user_message(validation_details)

        error_detail = BaseErrorDetail(
            error_type=self.ERROR_TYPE,
            message="Request validation failed",
            user_message=user_message,
            details={
                "validation_errors": validation_details,
                "total_errors": len(validation_details)
            },
            correlation_id=context.get("correlation_id"),
            context=context,
            severity=self.SEVERITY_WARNING
        )

        return self.create_error_response(error_detail, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def _extract_validation_details(self, error: Union[RequestValidationError, ValidationError]) -> list[Dict[str, Any]]:
        """Extract structured validation error details."""
        validation_details = []

        for validation_error in error.errors():
            error_info = {
                "field": self._format_field_path(validation_error.get("loc", [])),
                "message": validation_error.get("msg", "Validation failed"),
                "type": validation_error.get("type", "validation_error"),
                "input_value": validation_error.get("input"),
            }

            # Add context-specific information
            if "ctx" in validation_error and validation_error["ctx"]:
                error_info["context"] = validation_error["ctx"]

            validation_details.append(error_info)

        return validation_details

    def _format_field_path(self, location_path: tuple) -> str:
        """Format field location path for user display."""
        if not location_path:
            return "root"

        # Handle nested field paths
        path_parts = []
        for part in location_path:
            if isinstance(part, str):
                path_parts.append(part)
            elif isinstance(part, int):
                # Array index
                path_parts.append(f"[{part}]")
            else:
                path_parts.append(str(part))

        return ".".join(path_parts).replace(".[", "[")

    def _generate_user_message(self, validation_details: list[Dict[str, Any]]) -> str:
        """Generate user-friendly validation error message."""
        if len(validation_details) == 1:
            error = validation_details[0]
            field = error["field"]
            message = error["message"]

            # Simplify common validation messages
            simplified_messages = {
                "field required": f"The {field} field is required",
                "string type expected": f"The {field} field must be text",
                "integer type expected": f"The {field} field must be a number",
                "boolean type expected": f"The {field} field must be true or false",
                "list type expected": f"The {field} field must be a list",
                "dict type expected": f"The {field} field must be an object",
            }

            for pattern, user_msg in simplified_messages.items():
                if pattern in message.lower():
                    return user_msg

            return f"Invalid value for {field}: {message}"

        # Multiple validation errors
        field_names = [error["field"] for error in validation_details[:3]]

        if len(validation_details) <= 3:
            return f"Please check the following fields: {', '.join(field_names)}"
        else:
            return f"Please check the following fields: {', '.join(field_names)} and {len(validation_details) - 3} others"

    def _categorize_validation_error(self, error_type: str) -> str:
        """Categorize validation error for better user experience."""
        type_categories = {
            "missing": "required_field",
            "type_error": "wrong_type",
            "value_error": "invalid_value",
            "assertion_error": "constraint_violation",
        }

        for pattern, category in type_categories.items():
            if pattern in error_type:
                return category

        return "validation_error"