"""
Base Repository Pattern Implementation

This module provides a generic base repository that encapsulates common database
operations with proper error handling, validation, and caching support.
"""

import logging
from abc import ABC, abstractmethod
from typing import (
    TypeVar, Generic, Optional, List, Dict, Any,
    Protocol, runtime_checkable, Callable, AsyncContextManager
)
from datetime import datetime, timezone
from dataclasses import dataclass
from enum import Enum

from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection

logger = logging.getLogger(__name__)

# Type variables for generic repository
TModel = TypeVar('TModel', bound=BaseModel)
TId = TypeVar('TId')

class SortDirection(str, Enum):
    """Sort direction enumeration."""
    ASC = "asc"
    DESC = "desc"

@dataclass
class QueryFilter:
    """Represents a database query filter."""
    field: str
    operator: str  # eq, ne, gt, gte, lt, lte, in, nin, regex
    value: Any

@dataclass
class SortSpec:
    """Represents a sort specification."""
    field: str
    direction: SortDirection = SortDirection.ASC

@dataclass
class PaginationSpec:
    """Represents pagination parameters."""
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)

    @property
    def skip(self) -> int:
        """Calculate documents to skip."""
        return (self.page - 1) * self.limit

@dataclass
class QueryResult(Generic[TModel]):
    """Represents a paginated query result."""
    data: List[TModel]
    total_count: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_previous: bool

    @classmethod
    def create(
        cls,
        data: List[TModel],
        total_count: int,
        pagination: PaginationSpec
    ) -> 'QueryResult[TModel]':
        """Create a query result with calculated pagination info."""
        total_pages = (total_count + pagination.limit - 1) // pagination.limit

        return cls(
            data=data,
            total_count=total_count,
            page=pagination.page,
            limit=pagination.limit,
            total_pages=total_pages,
            has_next=pagination.page < total_pages,
            has_previous=pagination.page > 1
        )

@runtime_checkable
class DatabaseEntity(Protocol):
    """Protocol for database entities."""
    id: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class RepositoryError(Exception):
    """Base repository error."""
    pass

class EntityNotFoundError(RepositoryError):
    """Raised when an entity is not found."""
    def __init__(self, entity_type: str, entity_id: Any):
        self.entity_type = entity_type
        self.entity_id = entity_id
        super().__init__(f"{entity_type} with id {entity_id} not found")

class DuplicateEntityError(RepositoryError):
    """Raised when attempting to create a duplicate entity."""
    pass

class ValidationError(RepositoryError):
    """Raised when entity validation fails."""
    def __init__(self, message: str, errors: Optional[Dict[str, str]] = None):
        self.errors = errors or {}
        super().__init__(message)

class BaseRepository(ABC, Generic[TModel, TId]):
    """
    Abstract base repository providing common database operations.

    This class encapsulates standard CRUD operations with proper error handling,
    validation, caching, and audit logging.
    """

    def __init__(
        self,
        database: AsyncIOMotorDatabase,
        collection_name: str,
        model_class: type[TModel],
        enable_caching: bool = True,
        cache_ttl: int = 300
    ):
        self.database = database
        self.collection_name = collection_name
        self.model_class = model_class
        self.enable_caching = enable_caching
        self.cache_ttl = cache_ttl
        self._collection: AsyncIOMotorCollection = database[collection_name]
        self._cache: Dict[str, tuple[Any, datetime]] = {}

    @abstractmethod
    def _get_entity_id(self, entity: TModel) -> TId:
        """Extract entity ID from model."""
        pass

    @abstractmethod
    def _create_model_from_dict(self, data: Dict[str, Any]) -> TModel:
        """Create model instance from dictionary."""
        pass

    @abstractmethod
    def _model_to_dict(self, model: TModel) -> Dict[str, Any]:
        """Convert model to dictionary for database storage."""
        pass

    def _build_query_filter(self, filters: List[QueryFilter]) -> Dict[str, Any]:
        """Build MongoDB query from filters."""
        query = {}

        for filter_spec in filters:
            field = filter_spec.field
            operator = filter_spec.operator
            value = filter_spec.value

            if operator == "eq":
                query[field] = value
            elif operator == "ne":
                query[field] = {"$ne": value}
            elif operator == "gt":
                query[field] = {"$gt": value}
            elif operator == "gte":
                query[field] = {"$gte": value}
            elif operator == "lt":
                query[field] = {"$lt": value}
            elif operator == "lte":
                query[field] = {"$lte": value}
            elif operator == "in":
                query[field] = {"$in": value}
            elif operator == "nin":
                query[field] = {"$nin": value}
            elif operator == "regex":
                query[field] = {"$regex": value, "$options": "i"}
            else:
                raise ValueError(f"Unsupported query operator: {operator}")

        return query

    def _build_sort_spec(self, sorts: List[SortSpec]) -> List[tuple[str, int]]:
        """Build MongoDB sort specification."""
        return [
            (sort.field, 1 if sort.direction == SortDirection.ASC else -1)
            for sort in sorts
        ]

    def _get_cache_key(self, operation: str, *args) -> str:
        """Generate cache key for operation."""
        return f"{self.collection_name}:{operation}:{':'.join(str(arg) for arg in args)}"

    def _get_from_cache(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired."""
        if not self.enable_caching or key not in self._cache:
            return None

        value, timestamp = self._cache[key]
        if (datetime.now(timezone.utc) - timestamp).seconds > self.cache_ttl:
            del self._cache[key]
            return None

        return value

    def _set_cache(self, key: str, value: Any) -> None:
        """Set value in cache."""
        if self.enable_caching:
            self._cache[key] = (value, datetime.now(timezone.utc))

            # Simple cache size management
            if len(self._cache) > 1000:
                # Remove oldest 100 entries
                sorted_items = sorted(self._cache.items(), key=lambda x: x[1][1])
                for old_key, _ in sorted_items[:100]:
                    del self._cache[old_key]

    def _invalidate_cache_pattern(self, pattern: str) -> None:
        """Invalidate cache entries matching pattern."""
        if not self.enable_caching:
            return

        keys_to_remove = [key for key in self._cache if pattern in key]
        for key in keys_to_remove:
            del self._cache[key]

    async def create(self, entity: TModel) -> TModel:
        """
        Create a new entity.

        Args:
            entity: The entity to create

        Returns:
            The created entity with generated fields

        Raises:
            DuplicateEntityError: If entity already exists
            ValidationError: If entity validation fails
        """
        try:
            # Convert to dict and add timestamps
            data = self._model_to_dict(entity)
            now = datetime.now(timezone.utc)

            if 'created_at' not in data:
                data['created_at'] = now
            data['updated_at'] = now

            # Insert into database
            result = await self._collection.insert_one(data)
            data['_id'] = result.inserted_id

            # Invalidate relevant cache entries
            self._invalidate_cache_pattern(f"{self.collection_name}:find")

            created_entity = self._create_model_from_dict(data)
            logger.info(f"Created {self.model_class.__name__} with id: {self._get_entity_id(created_entity)}")

            return created_entity

        except Exception as e:
            logger.error(f"Failed to create {self.model_class.__name__}: {e}")
            if "duplicate" in str(e).lower():
                raise DuplicateEntityError(f"Duplicate {self.model_class.__name__}")
            raise RepositoryError(f"Failed to create entity: {e}")

    async def get_by_id(self, entity_id: TId) -> Optional[TModel]:
        """
        Get entity by ID.

        Args:
            entity_id: The entity ID

        Returns:
            The entity if found, None otherwise
        """
        cache_key = self._get_cache_key("get_by_id", entity_id)
        cached = self._get_from_cache(cache_key)
        if cached is not None:
            return cached

        try:
            data = await self._collection.find_one({"_id": entity_id})
            if data is None:
                return None

            entity = self._create_model_from_dict(data)
            self._set_cache(cache_key, entity)
            return entity

        except Exception as e:
            logger.error(f"Failed to get {self.model_class.__name__} by id {entity_id}: {e}")
            raise RepositoryError(f"Failed to retrieve entity: {e}")

    async def get_by_id_or_raise(self, entity_id: TId) -> TModel:
        """
        Get entity by ID or raise EntityNotFoundError.

        Args:
            entity_id: The entity ID

        Returns:
            The entity

        Raises:
            EntityNotFoundError: If entity is not found
        """
        entity = await self.get_by_id(entity_id)
        if entity is None:
            raise EntityNotFoundError(self.model_class.__name__, entity_id)
        return entity

    async def update(self, entity: TModel) -> TModel:
        """
        Update an existing entity.

        Args:
            entity: The entity to update

        Returns:
            The updated entity

        Raises:
            EntityNotFoundError: If entity is not found
            ValidationError: If entity validation fails
        """
        try:
            entity_id = self._get_entity_id(entity)
            data = self._model_to_dict(entity)
            data['updated_at'] = datetime.now(timezone.utc)

            result = await self._collection.update_one(
                {"_id": entity_id},
                {"$set": data}
            )

            if result.matched_count == 0:
                raise EntityNotFoundError(self.model_class.__name__, entity_id)

            # Invalidate cache
            self._invalidate_cache_pattern(str(entity_id))
            self._invalidate_cache_pattern(f"{self.collection_name}:find")

            updated_entity = await self.get_by_id(entity_id)
            logger.info(f"Updated {self.model_class.__name__} with id: {entity_id}")

            return updated_entity

        except EntityNotFoundError:
            raise
        except Exception as e:
            logger.error(f"Failed to update {self.model_class.__name__}: {e}")
            raise RepositoryError(f"Failed to update entity: {e}")

    async def delete(self, entity_id: TId) -> bool:
        """
        Delete entity by ID.

        Args:
            entity_id: The entity ID

        Returns:
            True if entity was deleted, False if not found
        """
        try:
            result = await self._collection.delete_one({"_id": entity_id})

            if result.deleted_count > 0:
                # Invalidate cache
                self._invalidate_cache_pattern(str(entity_id))
                self._invalidate_cache_pattern(f"{self.collection_name}:find")

                logger.info(f"Deleted {self.model_class.__name__} with id: {entity_id}")
                return True

            return False

        except Exception as e:
            logger.error(f"Failed to delete {self.model_class.__name__}: {e}")
            raise RepositoryError(f"Failed to delete entity: {e}")

    async def find_many(
        self,
        filters: Optional[List[QueryFilter]] = None,
        sorts: Optional[List[SortSpec]] = None,
        pagination: Optional[PaginationSpec] = None
    ) -> QueryResult[TModel]:
        """
        Find multiple entities with filtering, sorting, and pagination.

        Args:
            filters: Query filters to apply
            sorts: Sort specifications
            pagination: Pagination parameters

        Returns:
            Query result with entities and pagination info
        """
        try:
            # Build query
            query = {}
            if filters:
                query = self._build_query_filter(filters)

            # Check cache for simple queries
            cache_key = self._get_cache_key("find_many", str(query), str(sorts), str(pagination))
            cached = self._get_from_cache(cache_key)
            if cached is not None:
                return cached

            # Get total count
            total_count = await self._collection.count_documents(query)

            # Build aggregation pipeline
            pipeline = [{"$match": query}]

            if sorts:
                sort_spec = self._build_sort_spec(sorts)
                pipeline.append({"$sort": dict(sort_spec)})

            if pagination:
                pipeline.extend([
                    {"$skip": pagination.skip},
                    {"$limit": pagination.limit}
                ])

            # Execute query
            cursor = self._collection.aggregate(pipeline)
            documents = await cursor.to_list(length=pagination.limit if pagination else None)

            # Convert to models
            entities = [self._create_model_from_dict(doc) for doc in documents]

            # Create result
            result = QueryResult.create(
                data=entities,
                total_count=total_count,
                pagination=pagination or PaginationSpec()
            )

            # Cache result for simple queries
            if len(str(query)) < 100:  # Only cache simple queries
                self._set_cache(cache_key, result)

            return result

        except Exception as e:
            logger.error(f"Failed to find {self.model_class.__name__} entities: {e}")
            raise RepositoryError(f"Failed to find entities: {e}")

    async def count(self, filters: Optional[List[QueryFilter]] = None) -> int:
        """
        Count entities matching filters.

        Args:
            filters: Query filters to apply

        Returns:
            Number of matching entities
        """
        try:
            query = {}
            if filters:
                query = self._build_query_filter(filters)

            return await self._collection.count_documents(query)

        except Exception as e:
            logger.error(f"Failed to count {self.model_class.__name__} entities: {e}")
            raise RepositoryError(f"Failed to count entities: {e}")

    async def exists(self, entity_id: TId) -> bool:
        """
        Check if entity exists.

        Args:
            entity_id: The entity ID

        Returns:
            True if entity exists
        """
        try:
            result = await self._collection.find_one({"_id": entity_id}, {"_id": 1})
            return result is not None

        except Exception as e:
            logger.error(f"Failed to check existence of {self.model_class.__name__}: {e}")
            return False

    async def clear_cache(self) -> None:
        """Clear all cached data for this repository."""
        pattern = f"{self.collection_name}:"
        keys_to_remove = [key for key in self._cache if key.startswith(pattern)]
        for key in keys_to_remove:
            del self._cache[key]

        logger.debug(f"Cleared cache for {self.collection_name}")

    async def get_stats(self) -> Dict[str, Any]:
        """Get repository statistics."""
        try:
            collection_stats = await self.database.command("collStats", self.collection_name)

            return {
                "collection_name": self.collection_name,
                "document_count": collection_stats.get("count", 0),
                "storage_size": collection_stats.get("storageSize", 0),
                "index_count": collection_stats.get("nindexes", 0),
                "cache_entries": len(self._cache),
                "cache_enabled": self.enable_caching
            }

        except Exception as e:
            logger.error(f"Failed to get stats for {self.collection_name}: {e}")
            return {"error": str(e)}