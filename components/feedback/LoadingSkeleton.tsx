import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Props for LoadingSkeleton component
 */
export interface LoadingSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Single skeleton card that mimics ProductCard layout
 */
function SkeletonCard() {
  return (
    <div className="p-6 bg-card border border-border rounded-lg space-y-4">
      {/* Title skeleton */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Brand skeleton */}
      <Skeleton className="h-4 w-1/2" />
      
      {/* Description skeleton - 2 lines */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      
      {/* Price section skeleton */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-1">
          {/* Final price */}
          <Skeleton className="h-6 w-20" />
          {/* Original price (sometimes) */}
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Discount badge area */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

/**
 * LoadingSkeleton component that displays loading state for product results
 * 
 * Features:
 * - Mimics ProductCard layout exactly
 * - Responsive grid (1/2/3 columns)
 * - Consistent height to prevent layout shifts
 * - Subtle pulse animation
 * - Configurable number of skeletons
 * 
 * @example
 * ```tsx
 * // Show 6 loading cards
 * <LoadingSkeleton count={6} />
 * 
 * // Default 3 cards
 * <LoadingSkeleton />
 * ```
 */
export default function LoadingSkeleton({ 
  count = 3, 
  className 
}: LoadingSkeletonProps) {
  return (
    <div 
      className={cn(
        "grid gap-6",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        "animate-pulse",
        className
      )}
      data-testid="loading-skeleton"
      aria-label="Cargando productos..."
    >
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

/**
 * Compact version for smaller areas
 */
export function LoadingSkeletonCompact({ 
  count = 1, 
  className 
}: LoadingSkeletonProps) {
  return (
    <div 
      className={cn("space-y-3", className)}
      data-testid="loading-skeleton-compact"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={`skeleton-compact-${index}`} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}
