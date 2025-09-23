"""
Blockchain Provider Manager

Handles lifecycle management, health monitoring, and coordination
of multiple blockchain providers. Extracted from BlockchainService
for better separation of concerns.
"""

import asyncio
import concurrent.futures
import logging
import os
from typing import Dict, Any, Optional, List, Set
from dataclasses import dataclass
from enum import Enum

try:
    from backend.services.blockchain import BlockchainProviderFactory, BaseBlockchainProvider
except ImportError:
    from .blockchain import BlockchainProviderFactory, BaseBlockchainProvider

logger = logging.getLogger(__name__)


class ProviderStatus(Enum):
    """Provider connection status enumeration."""
    UNINITIALIZED = "uninitialized"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"


@dataclass
class ProviderHealth:
    """Provider health information."""
    status: ProviderStatus
    last_check: float
    error_count: int
    last_error: Optional[str] = None
    response_time_ms: Optional[float] = None


class BlockchainProviderManager:
    """
    Manages multiple blockchain providers with health monitoring,
    connection pooling, and failover capabilities.
    """

    def __init__(self, network_configs: Dict[str, Dict[str, Any]]):
        """Initialize provider manager with network configurations."""
        self.network_configs = network_configs
        self._providers: Dict[str, BaseBlockchainProvider] = {}
        self._provider_health: Dict[str, ProviderHealth] = {}
        self._preferred_providers: Dict[str, List[str]] = {}
        self._initialized = False

        # Configuration
        self._health_check_timeout = float(
            os.environ.get("BLOCKCHAIN_HEALTHCHECK_TIMEOUT", "2.0")
        )
        self._max_error_count = int(
            os.environ.get("BLOCKCHAIN_MAX_ERROR_COUNT", "5")
        )
        self._health_check_interval = int(
            os.environ.get("BLOCKCHAIN_HEALTH_INTERVAL", "60")
        )

    def _infer_provider_key(self, network_key: str) -> str:
        """Infer the provider type from network key."""
        network_key_lower = network_key.lower()

        if "ethereum" in network_key_lower:
            return "ethereum"
        elif "etherlink" in network_key_lower:
            return "etherlink"
        elif "solana" in network_key_lower:
            return "solana"

        return network_key

    def _group_networks_by_provider(self) -> Dict[str, List[str]]:
        """Group network keys by their provider type."""
        provider_groups: Dict[str, List[str]] = {}

        for network_key in self.network_configs.keys():
            provider_key = self._infer_provider_key(network_key)
            if provider_key not in provider_groups:
                provider_groups[provider_key] = []
            provider_groups[provider_key].append(network_key)

        return provider_groups

    async def initialize_providers(self) -> Dict[str, bool]:
        """
        Initialize all providers concurrently with proper error handling.

        Returns:
            Dictionary mapping network names to initialization success status
        """
        if self._initialized:
            logger.warning("Providers already initialized")
            return {key: True for key in self._providers.keys()}

        results: Dict[str, bool] = {}
        provider_groups = self._group_networks_by_provider()

        # Initialize each provider type concurrently
        async def init_provider_group(provider_key: str, network_keys: List[str]):
            group_results = {}

            for network_key in network_keys:
                config = self.network_configs[network_key]
                try:
                    provider = BlockchainProviderFactory.get_provider(provider_key, config)

                    # Initialize provider health tracking
                    self._provider_health[network_key] = ProviderHealth(
                        status=ProviderStatus.CONNECTING,
                        last_check=asyncio.get_event_loop().time(),
                        error_count=0
                    )

                    # Try to connect
                    success = await self._safe_provider_connect(provider)

                    if success:
                        self._providers[network_key] = provider
                        self._provider_health[network_key].status = ProviderStatus.CONNECTED
                        logger.info(f"✅ Successfully initialized {network_key}")
                    else:
                        self._provider_health[network_key].status = ProviderStatus.ERROR
                        logger.warning(f"❌ Failed to initialize {network_key}")

                    group_results[network_key] = success

                except Exception as e:
                    logger.error(f"❌ Error initializing {network_key}: {e}")
                    self._provider_health[network_key] = ProviderHealth(
                        status=ProviderStatus.ERROR,
                        last_check=asyncio.get_event_loop().time(),
                        error_count=1,
                        last_error=str(e)
                    )
                    group_results[network_key] = False

            return group_results

        # Execute all provider group initializations concurrently
        tasks = [
            init_provider_group(provider_key, network_keys)
            for provider_key, network_keys in provider_groups.items()
        ]

        group_results_list = await asyncio.gather(*tasks, return_exceptions=True)

        # Combine results
        for group_result in group_results_list:
            if isinstance(group_result, dict):
                results.update(group_result)
            else:
                logger.error(f"Provider group initialization failed: {group_result}")

        # Set up preferred providers (healthiest first)
        self._setup_preferred_providers()

        self._initialized = True

        # Log summary
        successful = sum(1 for success in results.values() if success)
        total = len(results)
        logger.info(f"🎯 Provider initialization complete: {successful}/{total} successful")

        return results

    async def _safe_provider_connect(self, provider: BaseBlockchainProvider) -> bool:
        """Safely attempt to connect a provider with timeout."""
        try:
            # Use asyncio.wait_for for proper timeout handling
            result = await asyncio.wait_for(
                self._ensure_coroutine(provider.connect()),
                timeout=self._health_check_timeout
            )
            return bool(result)
        except asyncio.TimeoutError:
            logger.warning(f"Provider connection timed out: {type(provider).__name__}")
            return False
        except Exception as e:
            logger.error(f"Provider connection failed: {e}")
            return False

    async def _ensure_coroutine(self, obj):
        """Ensure object is awaitable, wrap if necessary."""
        if asyncio.iscoroutine(obj):
            return await obj
        elif callable(obj):
            result = obj()
            if asyncio.iscoroutine(result):
                return await result
            return result
        return obj

    def _setup_preferred_providers(self):
        """Set up preferred provider order based on health and performance."""
        provider_types: Dict[str, List[str]] = {}

        for network_key in self._providers.keys():
            provider_type = self._infer_provider_key(network_key)
            if provider_type not in provider_types:
                provider_types[provider_type] = []
            provider_types[provider_type].append(network_key)

        # Sort by health and performance
        for provider_type, networks in provider_types.items():
            networks.sort(key=lambda net: (
                self._provider_health[net].status == ProviderStatus.CONNECTED,
                -self._provider_health[net].error_count,
                self._provider_health[net].response_time_ms or float('inf')
            ), reverse=True)

            self._preferred_providers[provider_type] = networks

    def get_provider(self, network_key: str) -> BaseBlockchainProvider:
        """
        Get a provider for the specified network.

        Args:
            network_key: The network identifier

        Returns:
            The blockchain provider

        Raises:
            ValueError: If network is not available
        """
        if not self._initialized:
            raise ValueError("Provider manager not initialized")

        if network_key not in self._providers:
            raise ValueError(f"Network {network_key} not available")

        provider = self._providers[network_key]

        # Update last access time
        if network_key in self._provider_health:
            self._provider_health[network_key].last_check = asyncio.get_event_loop().time()

        return provider

    def get_healthy_providers(self) -> List[str]:
        """Get list of currently healthy provider network keys."""
        healthy = []
        for network_key, health in self._provider_health.items():
            if (health.status == ProviderStatus.CONNECTED and
                health.error_count < self._max_error_count):
                healthy.append(network_key)
        return healthy

    def get_preferred_provider(self, provider_type: str) -> Optional[BaseBlockchainProvider]:
        """
        Get the preferred (healthiest) provider for a given type.

        Args:
            provider_type: Provider type (ethereum, etherlink, solana)

        Returns:
            The preferred provider or None if none available
        """
        if provider_type not in self._preferred_providers:
            return None

        for network_key in self._preferred_providers[provider_type]:
            if (network_key in self._providers and
                self._provider_health[network_key].status == ProviderStatus.CONNECTED):
                return self._providers[network_key]

        return None

    async def health_check_all(self) -> Dict[str, bool]:
        """
        Perform health check on all providers concurrently.

        Returns:
            Dictionary mapping network keys to health status
        """
        if not self._providers:
            return {}

        async def check_provider_health(network_key: str, provider: BaseBlockchainProvider) -> tuple[str, bool]:
            """Check individual provider health."""
            start_time = asyncio.get_event_loop().time()

            try:
                # Perform health check with timeout
                is_healthy = await asyncio.wait_for(
                    self._ensure_coroutine(provider.is_connected()),
                    timeout=self._health_check_timeout
                )

                response_time = (asyncio.get_event_loop().time() - start_time) * 1000

                # Update health status
                health = self._provider_health[network_key]
                health.status = ProviderStatus.CONNECTED if is_healthy else ProviderStatus.DISCONNECTED
                health.last_check = start_time
                health.response_time_ms = response_time

                if is_healthy:
                    health.error_count = max(0, health.error_count - 1)  # Gradual recovery
                else:
                    health.error_count += 1
                    health.last_error = "Health check failed"

                return network_key, is_healthy

            except Exception as e:
                # Update error status
                health = self._provider_health[network_key]
                health.status = ProviderStatus.ERROR
                health.last_check = start_time
                health.error_count += 1
                health.last_error = str(e)

                logger.warning(f"Health check failed for {network_key}: {e}")
                return network_key, False

        # Run all health checks concurrently
        tasks = [
            check_provider_health(network_key, provider)
            for network_key, provider in self._providers.items()
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        health_status = {}
        for result in results:
            if isinstance(result, tuple):
                network_key, is_healthy = result
                health_status[network_key] = is_healthy
            else:
                logger.error(f"Health check task failed: {result}")

        # Update preferred providers based on new health data
        self._setup_preferred_providers()

        return health_status

    def get_provider_health_summary(self) -> Dict[str, Dict[str, Any]]:
        """Get comprehensive health summary for all providers."""
        summary = {}

        for network_key, health in self._provider_health.items():
            summary[network_key] = {
                "status": health.status.value,
                "last_check": health.last_check,
                "error_count": health.error_count,
                "last_error": health.last_error,
                "response_time_ms": health.response_time_ms,
                "is_healthy": (
                    health.status == ProviderStatus.CONNECTED and
                    health.error_count < self._max_error_count
                )
            }

        return summary

    def is_any_provider_healthy(self) -> bool:
        """Check if at least one provider is healthy."""
        return len(self.get_healthy_providers()) > 0

    async def shutdown(self):
        """Gracefully shutdown all providers."""
        logger.info("🔄 Shutting down blockchain provider manager...")

        shutdown_tasks = []
        for network_key, provider in self._providers.items():
            if hasattr(provider, 'disconnect'):
                task = asyncio.create_task(
                    self._ensure_coroutine(provider.disconnect())
                )
                shutdown_tasks.append(task)

        if shutdown_tasks:
            await asyncio.gather(*shutdown_tasks, return_exceptions=True)

        self._providers.clear()
        self._provider_health.clear()
        self._preferred_providers.clear()
        self._initialized = False

        logger.info("✅ Provider manager shutdown complete")