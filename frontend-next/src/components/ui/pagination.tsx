import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  className,
}) => {
  // Generate page numbers to display
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pageNumbers: (number | "ellipsis")[] = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range of visible pages
    const halfVisible = Math.floor(maxVisible / 2);
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust for edge cases
    if (currentPage - halfVisible < 2) {
      endPage = Math.min(totalPages - 1, maxVisible);
    }
    if (currentPage + halfVisible > totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisible + 1);
    }

    // Add ellipsis or page numbers
    if (startPage > 2) {
      pageNumbers.push("ellipsis");
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 p-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) =>
        page === "ellipsis" ? (
          <div
            key={`ellipsis-${index}`}
            className="flex items-center justify-center w-9 h-9"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-9 h-9 font-medium"
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 p-0"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

Pagination.displayName = "Pagination";
