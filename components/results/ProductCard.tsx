import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import type { ProductItem } from "@/lib/types";
import PriceBlock from '@/components/feedback/PriceBlock';
import DiscountBadge from '@/components/feedback/DiscountBadge';

/**
 * Props for ProductCard component
 */
export interface ProductCardProps {
  /** Product data */
  item: ProductItem;
  /** Whether this product has palindrome discount */
  isPalindrome: boolean;
  /** Card size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom CSS classes */
  className?: string;
  /** Click handler for product selection */
  onClick?: (item: ProductItem) => void;
}

/**
 * ProductCard component for displaying tennis products
 * 
 * Features:
 * - Semantic article structure for accessibility
 * - Responsive design with hover states
 * - Integrated discount badges and price display
 * - Support for palindrome-based discounts
 * - Keyboard navigation support
 * 
 * @example
 * ```tsx
 * <ProductCard 
 *   item={product} 
 *   isPalindrome={true}
 *   onClick={handleProductClick}
 * />
 * ```
 */
export default function ProductCard({ 
  item, 
  isPalindrome, 
  size = 'md',
  className,
  onClick 
}: ProductCardProps) {

  // Size variants
  const sizeVariants = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  // Typography variants
  const titleSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-semibold'
  };

  const handleClick = () => {
    onClick?.(item);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden',
        'transition-all duration-200 ease-in-out',
        'hover:shadow-lg hover:scale-[1.02]',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Ver detalles de ${item.title}` : undefined}
      data-testid="product-card"
    >
      {/* Discount Badge */}
      {isPalindrome && (
        <DiscountBadge 
          discountPercentage={item.discountPercentage || 50}
          position="top-right"
          size={size}
        />
      )}

      <CardContent className={cn('space-y-4', sizeVariants[size])}>
        {/* Product Image */}
        {item.imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
            />
          </div>
        )}

        {/* Product Header */}
        <header className="space-y-1">
          <h3 
            className={cn(
              titleSizes[size],
              'text-foreground leading-tight',
              'group-hover:text-primary transition-colors'
            )}
            title={item.title}
          >
            {item.title}
          </h3>
          
          {item.brand && (
            <p className="text-sm text-muted-foreground font-medium">
              {item.brand}
            </p>
          )}
        </header>

        {/* Product Description */}
        {item.description && (
          <p 
            className={cn(
              'text-sm text-muted-foreground',
              'line-clamp-3 leading-relaxed',
              size === 'sm' ? 'line-clamp-2' : 'line-clamp-3'
            )}
            title={item.description}
          >
            {item.description}
          </p>
        )}

        {/* Price Block */}
        <div className="pt-2">
          <PriceBlock
            finalPrice={item.finalPrice}
            originalPrice={item.originalPrice}
            showSavings={isPalindrome}
            size={size}
            align="left"
          />
        </div>
      </CardContent>

      {/* Hover Overlay Effect */}
      {onClick && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      )}
    </Card>
  );
}

/**
 * Compact ProductCard variant for dense layouts
 */
export function CompactProductCard({
  item,
  isPalindrome,
  className,
  onClick
}: Pick<ProductCardProps, 'item' | 'isPalindrome' | 'className' | 'onClick'>) {
  
  return (
    <ProductCard
      item={item}
      isPalindrome={isPalindrome}
      size="sm"
      className={cn('min-h-[200px]', className)}
      onClick={onClick}
    />
  );
}

/**
 * Featured ProductCard variant for hero sections
 */
export function FeaturedProductCard({
  item,
  isPalindrome,
  className,
  onClick
}: Pick<ProductCardProps, 'item' | 'isPalindrome' | 'className' | 'onClick'>) {
  
  return (
    <ProductCard
      item={item}
      isPalindrome={isPalindrome}
      size="lg"
      className={cn('min-h-[320px]', className)}
      onClick={onClick}
    />
  );
}
