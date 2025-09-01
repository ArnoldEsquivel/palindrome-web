import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Simple chevron icons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

/**
 * Props for Pagination component
 */
export interface PaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Custom CSS classes */
  className?: string;
  /** Show page info text */
  showInfo?: boolean;
  /** Maximum number of page buttons to show */
  maxPages?: number;
}

/**
 * Pagination component for navigating through pages of results
 * 
 * Features:
 * - Responsive design with mobile-friendly controls
 * - Accessible navigation with ARIA labels
 * - Smart page button display with ellipsis
 * - Page info display showing current range
 * - Keyboard navigation support
 * 
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={2}
 *   totalPages={10}
 *   itemsPerPage={20}
 *   totalItems={200}
 *   onPageChange={(page) => setCurrentPage(page)}
 * />
 * ```
 */
export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  className,
  showInfo = true,
  maxPages = 7
}: PaginationProps) {
  
  // Calculate page range for display
  const getPageRange = () => {
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Calculate current range info
  const startItem = Math.max(1, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(totalItems, currentPage * itemsPerPage);

  const pageRange = getPageRange();
  const showLeftEllipsis = pageRange[0] > 1;
  const showRightEllipsis = pageRange[pageRange.length - 1] < totalPages;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, page: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav 
      className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}
      aria-label="Navegación por páginas"
    >
      {/* Page Info */}
      {showInfo && (
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> productos
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3"
          aria-label="Página anterior"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </Button>

        {/* First Page */}
        {showLeftEllipsis && (
          <>
            <Button
              variant={1 === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              className="min-w-[40px]"
              aria-label="Página 1"
              aria-current={1 === currentPage ? "page" : undefined}
            >
              1
            </Button>
            <span className="px-2 text-muted-foreground">…</span>
          </>
        )}

        {/* Page Numbers */}
        {pageRange.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            onKeyDown={(e) => handleKeyDown(e, page)}
            className="min-w-[40px]"
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}

        {/* Last Page */}
        {showRightEllipsis && (
          <>
            <span className="px-2 text-muted-foreground">…</span>
            <Button
              variant={totalPages === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              onKeyDown={(e) => handleKeyDown(e, totalPages)}
              className="min-w-[40px]"
              aria-label={`Página ${totalPages}`}
              aria-current={totalPages === currentPage ? "page" : undefined}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3"
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}

/**
 * Simple Pagination variant with just prev/next buttons
 */
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: Pick<PaginationProps, 'currentPage' | 'totalPages' | 'onPageChange' | 'className'>) {
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-2"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-2"
      >
        Siguiente
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
