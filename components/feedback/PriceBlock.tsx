import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

/**
 * Props for PriceBlock component
 */
export interface PriceBlockProps {
  /** Final price to display prominently */
  finalPrice: number;
  /** Original price (before discount) - optional */
  originalPrice?: number;
  /** Size variant for different layouts */
  size?: 'sm' | 'md' | 'lg';
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical';
  /** Whether to show savings amount */
  showSavings?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

/**
 * PriceBlock component for displaying product pricing
 * 
 * Features:
 * - Prominent final price display
 * - Strikethrough original price when discounted
 * - Mexican Peso (MXN) formatting
 * - Multiple size variants
 * - Horizontal and vertical layouts
 * - Savings calculation display
 * - Accessible price announcements
 * 
 * @example
 * ```tsx
 * // Basic price display
 * <PriceBlock finalPrice={1500} />
 * 
 * // With discount
 * <PriceBlock 
 *   finalPrice={750} 
 *   originalPrice={1500}
 *   showSavings={true}
 * />
 * 
 * // Large variant
 * <PriceBlock 
 *   finalPrice={2000}
 *   size="lg"
 *   align="center"
 * />
 * ```
 */
export default function PriceBlock({
  finalPrice,
  originalPrice,
  size = 'md',
  layout = 'vertical',
  showSavings = false,
  className,
  align = 'left'
}: PriceBlockProps) {

  // Calculate if there's a discount
  const hasDiscount = originalPrice && originalPrice > finalPrice;
  const savings = hasDiscount ? originalPrice - finalPrice : 0;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  // Size variants for final price
  const finalPriceSizes = {
    sm: 'text-lg font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold'
  };

  // Size variants for original price
  const originalPriceSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex items-center gap-2 flex-wrap',
    vertical: 'flex flex-col'
  };

  return (
    <div
      className={cn(
        'price-block',
        layoutClasses[layout],
        alignmentClasses[align],
        className
      )}
      data-testid="price-block"
    >
      {/* Final Price - Most Prominent */}
      <div 
        className={cn(
          finalPriceSizes[size],
          'text-foreground leading-tight',
          hasDiscount ? 'text-green-600 dark:text-green-400' : 'text-foreground'
        )}
        aria-label={`Precio final: ${formatCurrency(finalPrice)}`}
      >
        {formatCurrency(finalPrice)}
      </div>

      {/* Original Price with Strikethrough */}
      {hasDiscount && originalPrice && (
        <div 
          className={cn(
            originalPriceSizes[size],
            'text-muted-foreground line-through',
            layout === 'horizontal' ? 'order-first' : ''
          )}
          aria-label={`Precio original: ${formatCurrency(originalPrice)}`}
        >
          {formatCurrency(originalPrice)}
        </div>
      )}

      {/* Savings Display */}
      {showSavings && hasDiscount && savings > 0 && (
        <div 
          className={cn(
            'text-sm font-medium',
            'text-green-600 dark:text-green-400',
            layout === 'horizontal' ? 'ml-auto' : 'mt-1'
          )}
          aria-label={`Ahorras: ${formatCurrency(savings)}`}
        >
          Ahorras {formatCurrency(savings)}
          {discountPercentage > 0 && (
            <span className="ml-1 text-xs">
              ({discountPercentage}%)
            </span>
          )}
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only">
        {hasDiscount ? (
          `Precio con descuento: ${formatCurrency(finalPrice)}. ` +
          `Precio original: ${formatCurrency(originalPrice!)}. ` +
          `Descuento del ${discountPercentage}%.`
        ) : (
          `Precio: ${formatCurrency(finalPrice)}`
        )}
      </div>
    </div>
  );
}

/**
 * Compact PriceBlock for smaller spaces
 */
export function CompactPriceBlock({
  finalPrice,
  originalPrice,
  className
}: Pick<PriceBlockProps, 'finalPrice' | 'originalPrice' | 'className'>) {
  
  const hasDiscount = originalPrice && originalPrice > finalPrice;

  return (
    <div 
      className={cn(
        'flex items-center gap-2',
        className
      )}
      data-testid="compact-price-block"
    >
      <span className="text-lg font-bold text-foreground">
        {formatCurrency(finalPrice)}
      </span>
      
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatCurrency(originalPrice!)}
        </span>
      )}
    </div>
  );
}

/**
 * Large PriceBlock for product detail pages
 */
export function LargePriceBlock({
  finalPrice,
  originalPrice,
  showSavings = true,
  className
}: Pick<PriceBlockProps, 'finalPrice' | 'originalPrice' | 'showSavings' | 'className'>) {
  
  const hasDiscount = originalPrice && originalPrice > finalPrice;
  const savings = hasDiscount ? originalPrice - finalPrice : 0;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  return (
    <div 
      className={cn(
        'space-y-2',
        className
      )}
      data-testid="large-price-block"
    >
      {/* Original Price */}
      {hasDiscount && (
        <div className="text-lg text-muted-foreground line-through">
          {formatCurrency(originalPrice!)}
        </div>
      )}
      
      {/* Final Price */}
      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
        {formatCurrency(finalPrice)}
      </div>
      
      {/* Savings Banner */}
      {showSavings && hasDiscount && (
        <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm font-medium rounded-full">
          ¡Ahorras {formatCurrency(savings)} ({discountPercentage}%)!
        </div>
      )}
    </div>
  );
}

/**
 * Price comparison component for multiple variants
 */
export function PriceComparison({
  prices,
  selectedIndex = 0,
  className
}: {
  prices: Array<{ label: string; finalPrice: number; originalPrice?: number }>;
  selectedIndex?: number;
  className?: string;
}) {
  
  return (
    <div 
      className={cn(
        'space-y-2',
        className
      )}
      data-testid="price-comparison"
    >
      {prices.map((price, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center justify-between p-2 rounded',
            index === selectedIndex 
              ? 'bg-primary/10 border-2 border-primary' 
              : 'bg-muted/50 border border-border'
          )}
        >
          <span className="font-medium">{price.label}</span>
          <CompactPriceBlock
            finalPrice={price.finalPrice}
            originalPrice={price.originalPrice}
          />
        </div>
      ))}
    </div>
  );
}
