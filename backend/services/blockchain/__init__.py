"""
Blockchain services package for different network implementations.
"""

try:
    # Absolute imports rooted at 'backend'
    from backend.services.blockchain.base_provider import BaseBlockchainProvider
    from backend.services.blockchain.etherlink_provider import EtherlinkProvider
    from backend.services.blockchain.ethereum_provider import EthereumProvider
    from backend.services.blockchain.provider_factory import BlockchainProviderFactory
except ModuleNotFoundError as e:
    # Only fallback when the absolute package path isn't importable.
    if getattr(e, "name", "").startswith("backend"):
        from .base_provider import BaseBlockchainProvider
        from .etherlink_provider import EtherlinkProvider
        from .ethereum_provider import EthereumProvider
        from .provider_factory import BlockchainProviderFactory
    else:
        raise


__all__ = [
    "BaseBlockchainProvider",
    "EtherlinkProvider",
    "EthereumProvider",
    "BlockchainProviderFactory",
]

__version__ = "1.0.0"