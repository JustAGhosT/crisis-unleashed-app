# This is a stub file for opentelemetry.instrumentation.asgi
from typing import Any, Callable, Dict, Optional

def get_traced_application(
    wrapped: Callable[..., Any], 
    *args: Any, 
    **kwargs: Any
) -> Callable[..., Any]:
    return wrapped
