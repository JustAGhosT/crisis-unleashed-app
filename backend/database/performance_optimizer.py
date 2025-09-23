"""
Database Performance Optimization Module

Provides comprehensive database performance optimization including
index management, query analysis, performance monitoring, and
automated optimization recommendations for MongoDB.
"""

import asyncio
import logging
import time
from typing import Dict, List, Any, Optional, Tuple, Set
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum

from motor.motor_asyncio import AsyncIOMotorDatabase, AsyncIOMotorCollection
import pymongo

logger = logging.getLogger(__name__)

class IndexType(str, Enum):
    """MongoDB index types."""
    SINGLE = "single"
    COMPOUND = "compound"
    TEXT = "text"
    GEO_2D = "2d"
    GEO_SPHERE = "2dsphere"
    HASHED = "hashed"
    TTL = "ttl"

class QueryPattern(str, Enum):
    """Common query patterns for optimization."""
    POINT_QUERY = "point_query"  # Single document by ID
    RANGE_QUERY = "range_query"  # Range of values
    SORT_QUERY = "sort_query"    # Sorted results
    TEXT_SEARCH = "text_search"  # Text search
    AGGREGATION = "aggregation"  # Aggregation pipeline
    COUNT_QUERY = "count_query"  # Count documents

@dataclass
class IndexRecommendation:
    """Index recommendation with performance impact analysis."""
    collection: str
    index_spec: Dict[str, Any]
    index_type: IndexType
    estimated_benefit: float  # 0-1 score
    query_patterns: List[QueryPattern]
    reason: str
    priority: int  # 1=high, 2=medium, 3=low
    estimated_size_mb: float
    creation_time_estimate: float  # seconds

@dataclass
class QueryStats:
    """Query performance statistics."""
    query_pattern: str
    execution_count: int = 0
    total_time_ms: float = 0
    avg_time_ms: float = 0
    max_time_ms: float = 0
    documents_examined_avg: float = 0
    documents_returned_avg: float = 0
    index_hit_ratio: float = 0
    last_execution: Optional[datetime] = None

@dataclass
class CollectionStats:
    """Collection statistics for optimization."""
    name: str
    document_count: int
    storage_size_mb: float
    index_count: int
    index_size_mb: float
    avg_document_size_kb: float
    query_stats: Dict[str, QueryStats] = field(default_factory=dict)

class QueryMonitor:
    """
    Monitors database queries and provides performance analytics.
    """

    def __init__(self, max_history: int = 10000):
        self.max_history = max_history
        self.query_history: deque = deque(maxlen=max_history)
        self.query_stats: Dict[str, QueryStats] = {}
        self.slow_queries: deque = deque(maxlen=1000)  # Queries > 100ms

    def record_query(
        self,
        collection: str,
        query: Dict[str, Any],
        execution_time_ms: float,
        documents_examined: int,
        documents_returned: int,
        index_used: Optional[str] = None
    ):
        """Record a query execution for analysis."""
        query_pattern = self._classify_query_pattern(query)
        query_key = f"{collection}:{query_pattern}"

        # Update query statistics
        if query_key not in self.query_stats:
            self.query_stats[query_key] = QueryStats(query_pattern=query_pattern)

        stats = self.query_stats[query_key]
        stats.execution_count += 1
        stats.total_time_ms += execution_time_ms
        stats.avg_time_ms = stats.total_time_ms / stats.execution_count
        stats.max_time_ms = max(stats.max_time_ms, execution_time_ms)
        stats.last_execution = datetime.utcnow()

        # Update examination ratios
        if stats.execution_count == 1:
            stats.documents_examined_avg = documents_examined
            stats.documents_returned_avg = documents_returned
        else:
            # Exponential moving average
            alpha = 0.1
            stats.documents_examined_avg = (
                alpha * documents_examined + (1 - alpha) * stats.documents_examined_avg
            )
            stats.documents_returned_avg = (
                alpha * documents_returned + (1 - alpha) * stats.documents_returned_avg
            )

        # Calculate index hit ratio
        if documents_examined > 0:
            ratio = documents_returned / documents_examined
            stats.index_hit_ratio = (
                alpha * ratio + (1 - alpha) * stats.index_hit_ratio
                if stats.execution_count > 1 else ratio
            )

        # Record query details
        query_record = {
            "timestamp": datetime.utcnow(),
            "collection": collection,
            "query": query,
            "execution_time_ms": execution_time_ms,
            "documents_examined": documents_examined,
            "documents_returned": documents_returned,
            "index_used": index_used,
            "pattern": query_pattern
        }

        self.query_history.append(query_record)

        # Track slow queries
        if execution_time_ms > 100:  # Queries slower than 100ms
            self.slow_queries.append(query_record)
            logger.warning(f"Slow query detected: {execution_time_ms}ms in {collection}")

    def _classify_query_pattern(self, query: Dict[str, Any]) -> str:
        """Classify query into pattern for optimization analysis."""
        if not query:
            return "find_all"

        if "_id" in query:
            return "by_id"

        # Check for range queries
        for value in query.values():
            if isinstance(value, dict):
                operators = set(value.keys()) if isinstance(value, dict) else set()
                range_ops = {"$gt", "$gte", "$lt", "$lte", "$in", "$nin"}
                if operators & range_ops:
                    return "range_query"

        # Check for text search
        if "$text" in query:
            return "text_search"

        # Check for regex
        for value in query.values():
            if isinstance(value, dict) and "$regex" in value:
                return "regex_search"

        # Multiple field query
        if len(query) > 1:
            return "compound_query"

        return "single_field_query"

    def get_slow_queries(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent slow queries for analysis."""
        return list(self.slow_queries)[-limit:]

    def get_query_stats_summary(self) -> Dict[str, Any]:
        """Get summary of query performance."""
        total_queries = len(self.query_history)
        slow_query_count = len(self.slow_queries)

        # Get most frequent query patterns
        pattern_counts = defaultdict(int)
        for record in self.query_history:
            pattern_counts[record["pattern"]] += 1

        return {
            "total_queries": total_queries,
            "slow_queries": slow_query_count,
            "slow_query_percentage": (slow_query_count / max(total_queries, 1)) * 100,
            "most_common_patterns": dict(sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True)[:10]),
            "avg_query_time": sum(r["execution_time_ms"] for r in self.query_history) / max(total_queries, 1),
            "query_stats": {k: v.__dict__ for k, v in self.query_stats.items()}
        }

class PerformanceOptimizer:
    """
    Database performance optimizer with index recommendations and monitoring.
    """

    def __init__(self, database: AsyncIOMotorDatabase):
        self.database = database
        self.query_monitor = QueryMonitor()
        self._collection_stats: Dict[str, CollectionStats] = {}
        self._existing_indexes: Dict[str, List[Dict[str, Any]]] = {}

        # Common index patterns for Crisis Unleashed collections
        self.RECOMMENDED_INDEXES = {
            "users": [
                {"email": 1},  # Login queries
                {"username": 1},  # User lookup
                {"created_at": -1},  # Recent users
                {"role": 1, "is_active": 1},  # Admin queries
            ],
            "cards": [
                {"faction": 1, "rarity": 1},  # Faction + rarity filtering
                {"type": 1, "cost": 1},  # Type + cost filtering
                {"name": "text"},  # Text search
                {"faction": 1, "type": 1, "cost": 1},  # Compound filter
                {"created_at": -1},  # Recent cards
            ],
            "decks": [
                {"owner_id": 1},  # User's decks
                {"factions": 1, "is_public": 1},  # Public deck browsing
                {"created_at": -1},  # Recent decks
                {"is_public": 1, "created_at": -1},  # Public recent decks
                {"name": "text", "description": "text"},  # Text search
            ],
            "games": [
                {"players": 1, "status": 1},  # Player games by status
                {"status": 1, "created_at": -1},  # Games by status and recency
                {"created_at": -1},  # Recent games
                {"players": 1},  # All player games
            ],
            "blockchain_transactions": [
                {"user_id": 1, "status": 1},  # User transactions by status
                {"transaction_hash": 1},  # Transaction lookup
                {"created_at": -1},  # Recent transactions
                {"type": 1, "status": 1},  # Transaction type filtering
                {"created_at": 1},  # TTL index for cleanup
            ]
        }

    async def analyze_collection_performance(self, collection_name: str) -> CollectionStats:
        """Analyze performance characteristics of a collection."""
        collection = self.database[collection_name]

        try:
            # Get basic collection stats
            stats = await self.database.command("collStats", collection_name)

            # Get index information
            indexes = await collection.list_indexes().to_list(None)

            collection_stats = CollectionStats(
                name=collection_name,
                document_count=stats.get("count", 0),
                storage_size_mb=stats.get("storageSize", 0) / (1024 * 1024),
                index_count=len(indexes),
                index_size_mb=stats.get("totalIndexSize", 0) / (1024 * 1024),
                avg_document_size_kb=stats.get("avgObjSize", 0) / 1024,
            )

            # Store index information
            self._existing_indexes[collection_name] = indexes

            # Add query stats if available
            if collection_name in self.query_monitor.query_stats:
                collection_stats.query_stats = {
                    k: v for k, v in self.query_monitor.query_stats.items()
                    if k.startswith(f"{collection_name}:")
                }

            self._collection_stats[collection_name] = collection_stats
            return collection_stats

        except Exception as e:
            logger.error(f"Error analyzing collection {collection_name}: {e}")
            return CollectionStats(
                name=collection_name,
                document_count=0,
                storage_size_mb=0,
                index_count=0,
                index_size_mb=0,
                avg_document_size_kb=0
            )

    async def generate_index_recommendations(self, collection_name: str) -> List[IndexRecommendation]:
        """Generate index recommendations based on query patterns and collection stats."""
        recommendations = []

        # Get collection stats
        stats = await self.analyze_collection_performance(collection_name)

        # Get existing indexes
        existing_indexes = self._existing_indexes.get(collection_name, [])
        existing_index_keys = {
            tuple(sorted(idx["key"].items())) for idx in existing_indexes
            if idx["name"] != "_id_"  # Exclude default _id index
        }

        # Get recommended indexes for this collection
        recommended = self.RECOMMENDED_INDEXES.get(collection_name, [])

        for idx_spec in recommended:
            # Convert index spec to tuple for comparison
            if isinstance(idx_spec, dict):
                idx_key = tuple(sorted(idx_spec.items()))
            else:
                continue

            # Skip if index already exists
            if idx_key in existing_index_keys:
                continue

            # Determine index type
            index_type = self._determine_index_type(idx_spec)

            # Calculate benefit based on query patterns and collection size
            benefit_score = self._calculate_index_benefit(collection_name, idx_spec, stats)

            # Estimate index size
            estimated_size = self._estimate_index_size(stats, idx_spec)

            # Determine priority
            priority = 1 if benefit_score > 0.7 else 2 if benefit_score > 0.4 else 3

            # Generate reason
            reason = self._generate_recommendation_reason(idx_spec, stats)

            recommendation = IndexRecommendation(
                collection=collection_name,
                index_spec=idx_spec,
                index_type=index_type,
                estimated_benefit=benefit_score,
                query_patterns=self._get_supported_patterns(idx_spec),
                reason=reason,
                priority=priority,
                estimated_size_mb=estimated_size,
                creation_time_estimate=max(1.0, stats.document_count / 10000)  # Rough estimate
            )

            recommendations.append(recommendation)

        # Sort by priority and benefit
        recommendations.sort(key=lambda x: (x.priority, -x.estimated_benefit))

        return recommendations

    async def create_recommended_indexes(
        self,
        collection_name: str,
        max_indexes: int = 5,
        max_creation_time: float = 300.0  # 5 minutes max
    ) -> List[Dict[str, Any]]:
        """Create recommended indexes with safeguards."""
        recommendations = await self.generate_index_recommendations(collection_name)

        if not recommendations:
            logger.info(f"No index recommendations for collection {collection_name}")
            return []

        collection = self.database[collection_name]
        created_indexes = []
        total_time_estimate = 0

        for rec in recommendations[:max_indexes]:
            # Check time constraint
            if total_time_estimate + rec.creation_time_estimate > max_creation_time:
                logger.warning(f"Skipping index creation due to time constraint: {rec.index_spec}")
                continue

            try:
                logger.info(f"Creating index for {collection_name}: {rec.index_spec}")

                start_time = time.time()

                # Create index with background option for production
                index_options = {"background": True, "name": self._generate_index_name(rec.index_spec)}

                # Add TTL for time-based collections
                if "created_at" in rec.index_spec and collection_name in ["blockchain_transactions", "audit_logs"]:
                    index_options["expireAfterSeconds"] = 30 * 24 * 3600  # 30 days

                await collection.create_index(
                    list(rec.index_spec.items()),
                    **index_options
                )

                creation_time = time.time() - start_time
                total_time_estimate += creation_time

                created_indexes.append({
                    "collection": collection_name,
                    "index_spec": rec.index_spec,
                    "creation_time": creation_time,
                    "estimated_benefit": rec.estimated_benefit
                })

                logger.info(f"Successfully created index in {creation_time:.2f}s")

            except Exception as e:
                logger.error(f"Failed to create index {rec.index_spec}: {e}")

        return created_indexes

    async def optimize_all_collections(self) -> Dict[str, Any]:
        """Run optimization on all known collections."""
        collections = ["users", "cards", "decks", "games", "blockchain_transactions"]

        results = {
            "collection_stats": {},
            "index_recommendations": {},
            "created_indexes": {},
            "performance_summary": {}
        }

        for collection_name in collections:
            try:
                # Analyze collection
                stats = await self.analyze_collection_performance(collection_name)
                results["collection_stats"][collection_name] = stats.__dict__

                # Generate recommendations
                recommendations = await self.generate_index_recommendations(collection_name)
                results["index_recommendations"][collection_name] = [
                    rec.__dict__ for rec in recommendations
                ]

                # Create high-priority indexes only
                high_priority_recs = [rec for rec in recommendations if rec.priority == 1]
                if high_priority_recs:
                    created = await self.create_recommended_indexes(collection_name, max_indexes=3)
                    results["created_indexes"][collection_name] = created

            except Exception as e:
                logger.error(f"Error optimizing collection {collection_name}: {e}")
                results["collection_stats"][collection_name] = {"error": str(e)}

        # Generate performance summary
        results["performance_summary"] = self.query_monitor.get_query_stats_summary()

        return results

    def _determine_index_type(self, index_spec: Dict[str, Any]) -> IndexType:
        """Determine the type of index from specification."""
        if len(index_spec) > 1:
            return IndexType.COMPOUND

        value = list(index_spec.values())[0]
        if value == "text":
            return IndexType.TEXT
        elif value == "2d":
            return IndexType.GEO_2D
        elif value == "2dsphere":
            return IndexType.GEO_SPHERE
        elif value == "hashed":
            return IndexType.HASHED
        else:
            return IndexType.SINGLE

    def _calculate_index_benefit(self, collection_name: str, index_spec: Dict[str, Any], stats: CollectionStats) -> float:
        """Calculate estimated benefit score for an index (0-1)."""
        benefit = 0.0

        # Base benefit from collection size
        if stats.document_count > 1000:
            benefit += 0.3
        if stats.document_count > 10000:
            benefit += 0.2
        if stats.document_count > 100000:
            benefit += 0.2

        # Benefit from query patterns
        query_patterns = self.query_monitor.query_stats

        for pattern_key, pattern_stats in query_patterns.items():
            if not pattern_key.startswith(f"{collection_name}:"):
                continue

            # High execution count increases benefit
            if pattern_stats.execution_count > 100:
                benefit += 0.1
            if pattern_stats.execution_count > 1000:
                benefit += 0.1

            # Slow queries increase benefit
            if pattern_stats.avg_time_ms > 100:
                benefit += 0.2
            if pattern_stats.avg_time_ms > 500:
                benefit += 0.2

            # Poor index hit ratio increases benefit
            if pattern_stats.index_hit_ratio < 0.1:
                benefit += 0.3

        return min(benefit, 1.0)

    def _estimate_index_size(self, stats: CollectionStats, index_spec: Dict[str, Any]) -> float:
        """Estimate index size in MB."""
        # Very rough estimation based on document count and index fields
        base_size_per_doc_kb = 0.1  # Base overhead
        field_size_kb = len(index_spec) * 0.05  # Per field overhead

        estimated_kb = stats.document_count * (base_size_per_doc_kb + field_size_kb)
        return estimated_kb / 1024  # Convert to MB

    def _generate_recommendation_reason(self, index_spec: Dict[str, Any], stats: CollectionStats) -> str:
        """Generate human-readable reason for index recommendation."""
        fields = list(index_spec.keys())

        if len(fields) == 1:
            field = fields[0]
            if field in ["created_at", "updated_at"]:
                return f"Optimize time-based queries and sorting on {field}"
            elif field == "email":
                return "Optimize user login and authentication queries"
            elif field == "owner_id":
                return "Optimize queries for user-owned resources"
            else:
                return f"Optimize queries filtering by {field}"
        else:
            return f"Optimize compound queries on {', '.join(fields)}"

    def _get_supported_patterns(self, index_spec: Dict[str, Any]) -> List[QueryPattern]:
        """Determine query patterns supported by an index."""
        patterns = []

        if "_id" in index_spec:
            patterns.append(QueryPattern.POINT_QUERY)

        if any(isinstance(v, str) and v == "text" for v in index_spec.values()):
            patterns.append(QueryPattern.TEXT_SEARCH)

        if len(index_spec) > 1:
            patterns.append(QueryPattern.AGGREGATION)

        patterns.extend([QueryPattern.RANGE_QUERY, QueryPattern.SORT_QUERY, QueryPattern.COUNT_QUERY])

        return patterns

    def _generate_index_name(self, index_spec: Dict[str, Any]) -> str:
        """Generate a descriptive name for an index."""
        parts = []
        for field, direction in index_spec.items():
            if direction == 1:
                parts.append(f"{field}_asc")
            elif direction == -1:
                parts.append(f"{field}_desc")
            elif direction == "text":
                parts.append(f"{field}_text")
            else:
                parts.append(f"{field}_{direction}")

        return "_".join(parts)[:64]  # MongoDB name limit

    async def get_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive performance report."""
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "collections": {},
            "query_performance": self.query_monitor.get_query_stats_summary(),
            "recommendations_summary": {
                "high_priority": 0,
                "medium_priority": 0,
                "low_priority": 0,
                "total_estimated_benefit": 0
            }
        }

        # Analyze all known collections
        for collection_name in self.RECOMMENDED_INDEXES.keys():
            try:
                stats = await self.analyze_collection_performance(collection_name)
                recommendations = await self.generate_index_recommendations(collection_name)

                report["collections"][collection_name] = {
                    "stats": stats.__dict__,
                    "recommendations": [rec.__dict__ for rec in recommendations]
                }

                # Update summary
                for rec in recommendations:
                    if rec.priority == 1:
                        report["recommendations_summary"]["high_priority"] += 1
                    elif rec.priority == 2:
                        report["recommendations_summary"]["medium_priority"] += 1
                    else:
                        report["recommendations_summary"]["low_priority"] += 1

                    report["recommendations_summary"]["total_estimated_benefit"] += rec.estimated_benefit

            except Exception as e:
                logger.error(f"Error generating report for {collection_name}: {e}")
                report["collections"][collection_name] = {"error": str(e)}

        return report

# Convenience function for quick optimization
async def optimize_database_performance(database: AsyncIOMotorDatabase) -> Dict[str, Any]:
    """Run comprehensive database performance optimization."""
    optimizer = PerformanceOptimizer(database)
    return await optimizer.optimize_all_collections()