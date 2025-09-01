"use client";

import { useState, useCallback, useMemo } from 'react';

/**
 * Pagination state interface
 */
export interface PaginationState {
  /** Current page (1-based) */
  currentPage: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total number of items */
  totalItems: number;
}

/**
 * Pagination calculations interface
 */
export interface PaginationCalc {
  /** Total number of pages */
  totalPages: number;
  /** Start index for current page (0-based) */
  startIndex: number;
  /** End index for current page (0-based, exclusive) */
  endIndex: number;
  /** Offset for API calls */
  offset: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
}

/**
 * Return type for usePagination hook
 */
export interface UsePaginationReturn extends PaginationState, PaginationCalc {
  /** Go to specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  previousPage: () => void;
  /** Go to first page */
  firstPage: () => void;
  /** Go to last page */
  lastPage: () => void;
  /** Reset to first page with new total */
  reset: (totalItems?: number) => void;
  /** Update items per page */
  setItemsPerPage: (itemsPerPage: number) => void;
  /** Update total items */
  setTotalItems: (totalItems: number) => void;
}

/**
 * Custom hook for pagination logic and state management
 * 
 * Features:
 * - Complete pagination state management
 * - Automatic bounds checking
 * - Calculated values for rendering
 * - API-friendly offset calculation
 * - Navigation helpers
 * 
 * @param initialItemsPerPage - Initial items per page (default: 20)
 * @param initialTotalItems - Initial total items (default: 0)
 * @returns UsePaginationReturn - Pagination state and controls
 * 
 * @example
 * ```typescript
 * function ProductList() {
 *   const pagination = usePagination(20, 100);
 *   
 *   // Use offset for API calls
 *   const products = await fetchProducts({ 
 *     limit: pagination.itemsPerPage, 
 *     offset: pagination.offset 
 *   });
 *   
 *   return (
 *     <div>
 *       {products.map(product => <ProductCard key={product.id} product={product} />)}
 *       <Pagination {...pagination} onPageChange={pagination.goToPage} />
 *     </div>
 *   );
 * }
 * ```
 */
export function usePagination(
  initialItemsPerPage: number = 20,
  initialTotalItems: number = 0
): UsePaginationReturn {
  
  // Core state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);
  const [totalItems, setTotalItemsState] = useState(initialTotalItems);

  // Calculated values
  const calculations = useMemo((): PaginationCalc => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validPage = Math.min(currentPage, totalPages);
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const offset = startIndex;
    const hasPrevious = validPage > 1;
    const hasNext = validPage < totalPages;

    return {
      totalPages,
      startIndex,
      endIndex,
      offset,
      hasPrevious,
      hasNext
    };
  }, [currentPage, itemsPerPage, totalItems]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    const clampedPage = Math.max(1, Math.min(page, calculations.totalPages));
    setCurrentPage(clampedPage);
  }, [calculations.totalPages]);

  const nextPage = useCallback(() => {
    if (calculations.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [calculations.hasNext]);

  const previousPage = useCallback(() => {
    if (calculations.hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [calculations.hasPrevious]);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(calculations.totalPages);
  }, [calculations.totalPages]);

  const reset = useCallback((newTotalItems?: number) => {
    setCurrentPage(1);
    if (newTotalItems !== undefined) {
      setTotalItemsState(newTotalItems);
    }
  }, []);

  const setItemsPerPage = useCallback((newItemsPerPage: number) => {
    // Calculate what the new page should be to show the same items
    const firstItemIndex = (currentPage - 1) * itemsPerPage;
    const newPage = Math.floor(firstItemIndex / newItemsPerPage) + 1;
    
    setItemsPerPageState(newItemsPerPage);
    setCurrentPage(newPage);
  }, [currentPage, itemsPerPage]);

  const setTotalItems = useCallback((newTotalItems: number) => {
    setTotalItemsState(newTotalItems);
    
    // Adjust current page if it's beyond the new total
    const newTotalPages = Math.max(1, Math.ceil(newTotalItems / itemsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [currentPage, itemsPerPage]);

  return {
    // State
    currentPage,
    itemsPerPage,
    totalItems,
    
    // Calculations
    ...calculations,
    
    // Actions
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    reset,
    setItemsPerPage,
    setTotalItems
  };
}

/**
 * Hook for simple pagination with just page navigation
 * Useful when you don't need all the advanced features
 */
export function useSimplePagination(totalPages: number, initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = useCallback((page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  };
}
