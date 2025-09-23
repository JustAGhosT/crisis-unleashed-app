"""
Environment Configuration Utilities

Provides safe and consistent environment variable parsing with fallbacks.
"""

import logging
import os
from typing import Union, Optional, TypeVar, Type, cast, Dict, Any, Tuple, overload

logger = logging.getLogger(__name__)

T = TypeVar('T', int, float, str, bool)


class EnvConfigHelper:
    """Helper class for safely parsing environment variables with fallbacks."""

    @staticmethod
    def safe_get_int(env_var: str, default: int) -> int:
        """
        Safely parse an integer environment variable.

        Args:
            env_var: Environment variable name
            default: Default value if parsing fails

        Returns:
            Integer value from environment or default
        """
        try:
            value = os.environ.get(env_var, str(default))
            return int(value)
        except (ValueError, TypeError) as e:
            logger.warning(
                f"Invalid value for environment variable {env_var}: {value}. "
                f"Using default: {default}. Error: {e}"
            )
            return default

    @staticmethod
    def safe_get_float(env_var: str, default: float) -> float:
        """
        Safely parse a float environment variable.

        Args:
            env_var: Environment variable name
            default: Default value if parsing fails

        Returns:
            Float value from environment or default
        """
        try:
            value = os.environ.get(env_var, str(default))
            return float(value)
        except (ValueError, TypeError) as e:
            logger.warning(
                f"Invalid value for environment variable {env_var}: {value}. "
                f"Using default: {default}. Error: {e}"
            )
            return default

    @staticmethod
    def safe_get_bool(env_var: str, default: bool) -> bool:
        """
        Safely parse a boolean environment variable.

        Args:
            env_var: Environment variable name
            default: Default value if parsing fails

        Returns:
            Boolean value from environment or default
        """
        try:
            value = os.environ.get(env_var, str(default)).lower()
            if value in ('true', '1', 'yes', 'on'):
                return True
            elif value in ('false', '0', 'no', 'off'):
                return False
            else:
                logger.warning(
                    f"Invalid boolean value for {env_var}: {value}. "
                    f"Using default: {default}"
                )
                return default
        except (ValueError, TypeError) as e:
            logger.warning(
                f"Invalid value for environment variable {env_var}. "
                f"Using default: {default}. Error: {e}"
            )
            return default

    @staticmethod
    def safe_get_str(env_var: str, default: str) -> str:
        """
        Safely get a string environment variable.

        Args:
            env_var: Environment variable name
            default: Default value if not found

        Returns:
            String value from environment or default
        """
        return os.environ.get(env_var, default)

    @overload
    @classmethod
    def get_config_section(
        cls,
        prefix: str,
        config_mapping: Dict[str, Tuple[str, int]]
    ) -> Dict[str, int]:
        ...

    @overload
    @classmethod
    def get_config_section(
        cls,
        prefix: str,
        config_mapping: Dict[str, Tuple[str, float]]
    ) -> Dict[str, float]:
        ...

    @overload
    @classmethod
    def get_config_section(
        cls,
        prefix: str,
        config_mapping: Dict[str, Tuple[str, bool]]
    ) -> Dict[str, bool]:
        ...

    @overload
    @classmethod
    def get_config_section(
        cls,
        prefix: str,
        config_mapping: Dict[str, Tuple[str, str]]
    ) -> Dict[str, str]:
        ...

    @classmethod
    def get_config_section(
        cls,
        prefix: str,
        config_mapping: Dict[str, Tuple[str, Union[int, float, str, bool]]]
    ) -> Dict[str, Union[int, float, str, bool]]:
        """
        Get a complete configuration section with type-safe parsing.

        Args:
            prefix: Common prefix for environment variables
            config_mapping: Dict of {config_key: (env_suffix, default_value)}

        Returns:
            Dict with parsed configuration values
        """
        result = {}
        for key, (env_suffix, default) in config_mapping.items():
            env_var = f"{prefix}{env_suffix}"

            if isinstance(default, int):
                result[key] = cls.safe_get_int(env_var, default)
            elif isinstance(default, float):
                result[key] = cls.safe_get_float(env_var, default)
            elif isinstance(default, bool):
                result[key] = cls.safe_get_bool(env_var, default)
            else:
                result[key] = cls.safe_get_str(env_var, str(default))

        return result

    @classmethod
    def get_typed_config(
        cls,
        config_specs: Dict[str, Tuple[str, Union[int, float, str, bool], str]]
    ) -> Dict[str, Union[int, float, str, bool]]:
        """
        Get configuration values with type checking and documentation.

        Args:
            config_specs: Dict of {key: (env_var, default_value, description)}

        Returns:
            Dict with parsed and validated configuration values
        """
        result = {}
        for key, (env_var, default, description) in config_specs.items():
            logger.debug(f"Loading config {key} from {env_var}: {description}")

            if isinstance(default, int):
                result[key] = cls.safe_get_int(env_var, default)
            elif isinstance(default, float):
                result[key] = cls.safe_get_float(env_var, default)
            elif isinstance(default, bool):
                result[key] = cls.safe_get_bool(env_var, default)
            else:
                result[key] = cls.safe_get_str(env_var, str(default))

        return result