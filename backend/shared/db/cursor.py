"""
In-Memory Cursor Implementation

This module provides a cursor implementation for the in-memory database.
"""

import logging
from typing import Any, List, Optional, Union, Tuple, Iterable

logger = logging.getLogger(__name__)


class InMemoryCursor:
    """In-memory cursor implementation for testing."""

    def __init__(self, data):
        self.data = data.copy() if data else []
        self.skip_count = 0
        self.limit_count = None
        # Keep old attributes for backward compatibility
        self.sort_field = None
        self.sort_direction = 1
        # New attribute for multi-field sorting
        self.sort_specs = []

    def skip(self, n):
        """Skip n documents."""
        self.skip_count = n
        return self

    def limit(self, n):
        """Limit to n documents."""
        self.limit_count = n
        return self

    def sort(self, *args):
        """
        Sort documents by field(s).
        
        Supports multiple formats:
        - sort("field", direction): Sort by a single field
        - sort([("field1", direction1), ("field2", direction2), ...]): Sort by multiple fields
        - sort(("field1", direction1), ("field2", direction2), ...): Sort by multiple fields
        
        Direction must be 1 (ascending) or -1 (descending).
        """
        self.sort_specs = []  # Reset sort specifications
        
        if not args:
            return self
            
        # Case 1: sort("field", direction) - Traditional two arguments
        if len(args) == 2 and isinstance(args[0], str) and args[1] in (1, -1):
            self.sort_specs.append((args[0], args[1]))
            # Set legacy attributes
            self.sort_field = args[0]
            self.sort_direction = args[1]
            
        # Case 2: sort([("field1", 1), ("field2", -1)]) - List of tuples
        elif len(args) == 1 and isinstance(args[0], (list, tuple)):
            for spec in args[0]:
                if (isinstance(spec, (list, tuple)) and 
                    len(spec) == 2 and 
                    isinstance(spec[0], str) and 
                    spec[1] in (1, -1)):
                    self.sort_specs.append((spec[0], spec[1]))
                else:
                    logger.warning(f"Invalid sort specification: {spec}. Must be (field, direction) tuple.")
            
            # Set legacy attributes based on first specification
            if self.sort_specs:
                self.sort_field = self.sort_specs[0][0]
                self.sort_direction = self.sort_specs[0][1]
                    
        # Case 3: sort(("field1", 1), ("field2", -1)) - Multiple tuple arguments
        else:
            for spec in args:
                if (isinstance(spec, (list, tuple)) and 
                    len(spec) == 2 and 
                    isinstance(spec[0], str) and 
                    spec[1] in (1, -1)):
                    self.sort_specs.append((spec[0], spec[1]))
                else:
                    logger.warning(f"Invalid sort specification: {spec}. Must be (field, direction) tuple.")
            
            # Set legacy attributes based on first specification
            if self.sort_specs:
                self.sort_field = self.sort_specs[0][0]
                self.sort_direction = self.sort_specs[0][1]
                
        return self

    def with_options(self, options):
        """Set cursor options."""
        # Not implemented for in-memory cursor
        return self

    async def to_list(self, length):
        """Convert cursor to list."""
        result = self.data.copy()  # Always work on a copy to avoid mutations

        # Apply sorting if specified
        if self.sort_specs:
            # Sort by each field in reverse order to get proper multi-field sorting
            for field, direction in reversed(self.sort_specs):
                reverse = direction == -1
                result = sorted(
                    result,
                    key=lambda x: x.get(field, ''),
                    reverse=reverse
                )
        # For backward compatibility with old code
        elif self.sort_field:
            reverse = self.sort_direction == -1
            result = sorted(
                result,
                key=lambda x: x.get(self.sort_field, ''),
                reverse=reverse
            )

        # Apply skip and limit
        if self.skip_count:
            result = result[self.skip_count:]

        if self.limit_count is not None:
            result = result[:self.limit_count]

        return result[:length] if length else result