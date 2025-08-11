#!/usr/bin/env python
"""
Test runner script for the backend blockchain services.
This script helps run the tests with proper configuration.
"""

import os
import sys
import pytest

def main():
    """Run the tests with the proper configuration."""
    # Add the project root to the Python path
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    # Run the tests
    args = [
        '--verbose',
        '--cov=backend',
        '--cov-report=term',
        '--cov-report=html:coverage_html',
        'tests/'
    ]
    
    return pytest.main(args)

if __name__ == '__main__':
    sys.exit(main())