import { useState, useCallback, useMemo } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  pageSize?: number;
  total?: number;
  siblingCount?: number;
}

/**
 * Custom hook for handling pagination
 * Manages current page, page size, and pagination navigation
 */
export function usePagination({
  initialPage = 1,
  pageSize = 20,
  total = 0,
  siblingCount = 1,
}: UsePaginationProps = {}) {
  const [page, setPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(total);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);
  
  // Ensure page is within bounds when total changes
  const setTotal = useCallback((newTotal: number) => {
    setTotalItems(newTotal);
    const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [page, pageSize]);
  
  // Change page with bounds check
  const setPageSafe = useCallback((newPage: number) => {
    const boundedPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(boundedPage);
  }, [totalPages]);
  
  // Go to next page if available
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);
  
  // Go to previous page if available
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);
  
  // Go to first page
  const firstPage = useCallback(() => {
    setPage(1);
  }, []);
  
  // Go to last page
  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);
  
  // Calculate range of pages to display
  const pageRange = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // Case 1: Number of pages is less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate left and right sibling index
    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);
    
    // Do not show dots when there is just one page number to be inserted
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Case 2: No left dots to show, but right dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'dots', totalPages];
    }
    
    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, 'dots', ...rightRange];
    }
    
    // Case 4: Both left and right dots to be shown
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, 'dots', ...middleRange, 'dots', totalPages];
  }, [page, totalPages, siblingCount]);
  
  // Calculate offset for data fetching (0-based)
  const offset = useMemo(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);
  
  return {
    page,
    setPage: setPageSafe,
    pageSize,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setTotal,
    offset,
    pageRange,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}