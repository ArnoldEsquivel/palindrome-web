"use client";
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ProductItem, SearchResponse } from '@/lib/types';
import ProductCard, { CompactProductCard, FeaturedProductCard } from './ProductCard';
import LoadingSkeleton from '@/components/feedback/LoadingSkeleton';
import EmptyState from '@/components/feedback/EmptyState';
import ErrorState from '@/components/feedback/ErrorState';
import { useConfetti } from '@/lib/useConfetti';

/**
 * Props for ResultList component
 */
export interface ResultListProps {
  /** Current search results */
  data?: SearchResponse | null;
  /** Search status */
  status: "idle" | "loading" | "success" | "error";
  /** Error message */
  error?: string;
  /** Number of skeleton items to show during loading */
  loadingCount?: number;
  /** Grid layout variant */
  layout?: 'grid' | 'list' | 'compact';
  /** Number of columns for grid layout */
  columns?: 1 | 2 | 3 | 4 | 6;
  /** Custom CSS classes */
  className?: string;
  /** Callback when user wants to retry failed request */
  onRetry?: () => void;
  /** Callback when user clears search */
  onClearSearch?: () => void;
  /** Callback when user clicks on a product */
  onProductClick?: (product: ProductItem) => void;
  /** Callback when user clicks on a suggestion */
  onSuggestionClick?: (suggestion: string) => void;
}

/**
 * ResultList component for displaying search results
 * 
 * Features:
 * - Manages loading, error, and empty states
 * - Responsive grid layout with multiple variants
 * - Accessibility compliance with proper landmarks
 * - Keyboard navigation support
 * - Integration with all feedback components
 * 
 * @example
 * ```tsx
 * <ResultList
 *   data={searchResults}
 *   status={searchStatus}
 *   error={searchError}
 *   onRetry={handleRetry}
 *   onProductClick={handleProductSelect}
 * />
 * ```
 */
export default function ResultList({
  data,
  status,
  error,
  loadingCount = 12,
  layout = 'grid',
  columns = 3,
  className,
  onRetry,
  onClearSearch,
  onProductClick,
  onSuggestionClick
}: ResultListProps) {

  // Initialize confetti hook
  const { triggerPalindromeConfetti, prefersReducedMotion } = useConfetti();

  // Trigger confetti when palindrome is detected with results
  useEffect(() => {
    if (data?.isPalindrome && 
        status === 'success' && 
        data.items && 
        data.items.length > 0 && 
        !prefersReducedMotion) {
      
      console.log('🎊 [ResultList] Palindrome detected with results, triggering confetti!');
      
      // Add a small delay to ensure the UI has rendered
      const timeoutId = setTimeout(() => {
        triggerPalindromeConfetti();
      }, 300);

      // Cleanup timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [data?.isPalindrome, status, data?.items, triggerPalindromeConfetti, prefersReducedMotion]);

  // Grid layout classes
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
  };

  // Layout variants
  const layoutClasses = {
    grid: cn(
      'grid gap-4',
      gridClasses[columns]
    ),
    list: 'flex flex-col gap-4',
    compact: cn(
      'grid gap-3',
      'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
    )
  };

  // Idle State
  if (status === "idle") {
    return (
      <div className={cn('text-center py-8', className)} data-testid="result-list-idle">
        <p className="text-sm text-muted-foreground">
          Empieza a escribir para buscar productos de tenis.
        </p>
      </div>
    );
  }

  // Loading State
  if (status === "loading") {
    return (
      <section 
        className={cn('space-y-4', className)}
        aria-label="Cargando resultados de búsqueda"
        data-testid="result-list-loading"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-muted-foreground">
            Buscando productos...
          </h2>
        </div>
        <LoadingSkeleton 
          count={loadingCount}
        />
      </section>
    );
  }

  // Error State
  if (status === "error") {
    return (
      <section 
        className={cn('space-y-4', className)}
        aria-label="Error en la búsqueda"
        data-testid="result-list-error"
      >
        <ErrorState
          error={error || "Error inesperado"}
          onRetry={onRetry}
          onClear={onClearSearch}
          errorType="network"
        />
      </section>
    );
  }

  // No data
  if (!data) {
    return null;
  }

  // No Results / Empty State
  if (!data.items || data.items.length === 0) {
    return (
      <section 
        className={cn('space-y-4', className)}
        aria-label="Sin resultados de búsqueda"
        data-testid="result-list-empty"
      >
        <EmptyState onSuggestedSearch={onSuggestionClick} />
      </section>
    );
  }

  // Success State with Results
  const { items, totalItems, isPalindrome, query } = data;

  return (
    <section 
      className={cn('space-y-6', className)}
      aria-label={`Resultados de búsqueda para "${query}"`}
      data-testid="result-list-success"
    >
      {/* Results Header */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Resultados para &quot;{query}&quot;
          </h2>
          <span className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </span>
        </div>
        
        {/* Palindrome Banner */}
        {isPalindrome && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-green-600 dark:text-green-400">
                🎉
              </div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  ¡Búsqueda palíndromo detectada!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Todos los productos tienen 50% de descuento.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Results Grid */}
      <div 
        className={layoutClasses[layout]}
        role="grid"
        aria-label={`${totalItems} productos encontrados`}
      >
        {items.map((item, index) => {
          // Render different card variants based on layout
          if (layout === 'compact') {
            return (
              <CompactProductCard
                key={item.id}
                item={item}
                isPalindrome={isPalindrome}
                onClick={onProductClick}
              />
            );
          }

          // Featured card for first item in grid layout
          if (layout === 'grid' && index === 0 && items.length > 1) {
            return (
              <div key={item.id} className="sm:col-span-2 lg:col-span-1">
                <FeaturedProductCard
                  item={item}
                  isPalindrome={isPalindrome}
                  onClick={onProductClick}
                />
              </div>
            );
          }

          return (
            <ProductCard
              key={item.id}
              item={item}
              isPalindrome={isPalindrome}
              onClick={onProductClick}
            />
          );
        })}
      </div>

      {/* Results Footer */}
      <footer className="text-center">
        <p className="text-sm text-muted-foreground">
          Mostrando {items.length} de {totalItems} productos
        </p>
        
        {/* Load More Button - for future implementation */}
        {items.length < totalItems && (
          <div className="mt-4">
            <button 
              className="text-sm text-primary hover:text-primary/80 font-medium"
              onClick={() => {
                // Future: implement load more functionality
                console.log('Load more products');
              }}
            >
              Cargar más productos
            </button>
          </div>
        )}
      </footer>
    </section>
  );
}

/**
 * Compact ResultList variant for smaller spaces
 */
export function CompactResultList({
  data,
  status,
  error,
  onRetry,
  className
}: Pick<ResultListProps, 'data' | 'status' | 'error' | 'onRetry' | 'className'>) {
  
  return (
    <ResultList
      data={data}
      status={status}
      error={error}
      layout="compact"
      columns={6}
      loadingCount={6}
      onRetry={onRetry}
      className={className}
    />
  );
}

/**
 * List-style ResultList variant
 */
export function ListResultList({
  data,
  status,
  error,
  onRetry,
  onProductClick,
  className
}: Pick<ResultListProps, 'data' | 'status' | 'error' | 'onRetry' | 'onProductClick' | 'className'>) {
  
  return (
    <ResultList
      data={data}
      status={status}
      error={error}
      layout="list"
      columns={1}
      loadingCount={8}
      onRetry={onRetry}
      onProductClick={onProductClick}
      className={className}
    />
  );
}
