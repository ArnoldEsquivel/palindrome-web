import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Props for DiscountBadge component
 */
export interface DiscountBadgeProps {
  /** Discount percentage (0-100) */
  discountPercentage: number;
  /** Badge size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Badge position variant */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Custom CSS classes */
  className?: string;
  /** Whether to show the percentage symbol */
  showPercent?: boolean;
  /** Custom text override (e.g., "OFERTA" instead of percentage) */
  customText?: string;
}

/**
 * DiscountBadge component for displaying promotional discounts
 * 
 * Features:
 * - Prominent visual design with attention-grabbing colors
 * - Absolute positioning for product cards
 * - Responsive sizing
 * - Accessible contrast ratios
 * - Animated entrance effect
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <DiscountBadge discountPercentage={50} />
 * 
 * // With custom positioning
 * <DiscountBadge 
 *   discountPercentage={30}
 *   position="top-right"
 *   size="lg"
 * />
 * 
 * // Custom text
 * <DiscountBadge 
 *   discountPercentage={0}
 *   customText="NUEVO"
 * />
 * ```
 */
export default function DiscountBadge({
  discountPercentage,
  size = 'md',
  position = 'top-right',
  className,
  showPercent = true,
  customText
}: DiscountBadgeProps) {

  // Don't render if no discount and no custom text
  if (discountPercentage <= 0 && !customText) {
    return null;
  }

  // Size variants
  const sizeVariants = {
    sm: 'text-xs px-2 py-1 min-w-[2.5rem]',
    md: 'text-sm px-3 py-1.5 min-w-[3rem]',
    lg: 'text-base px-4 py-2 min-w-[3.5rem]'
  };

  // Position variants
  const positionVariants = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };

  // Generate display text
  const displayText = customText || 
    (showPercent ? `${discountPercentage}% OFF` : `${discountPercentage} OFF`);

  // Determine badge variant based on discount percentage
  const getBadgeVariant = () => {
    if (customText) return 'secondary';
    if (discountPercentage >= 50) return 'destructive'; // High discount
    if (discountPercentage >= 30) return 'default';     // Medium discount
    return 'secondary';                                  // Low discount
  };

  return (
    <Badge
      variant={getBadgeVariant()}
      className={cn(
        // Base styles with corporate colors
        'absolute z-10',
        'font-bold uppercase tracking-wider',
        'shadow-lg shadow-primary/20',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        'transform-gpu', // Hardware acceleration
        
        // Enhanced hover effect
        'transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/30',
        
        // Corporate styling - Acueducto Blue
        'bg-gradient-to-r from-primary to-accent',
        'text-primary-foreground',
        'border-2 border-primary/20',
        
        // Subtle glow effect
        'ring-1 ring-primary/30',
        
        // Size variant
        sizeVariants[size],
        
        // Position variant
        positionVariants[position],
        
        // High discount special styling with enhanced corporate colors
        discountPercentage >= 50 && [
          'bg-gradient-to-r from-primary via-accent to-primary',
          'text-primary-foreground',
          'shadow-primary/40',
          'ring-2 ring-primary/50',
          'animate-pulse'
        ],
        
        // Medium discount styling with corporate accent
        discountPercentage >= 30 && discountPercentage < 50 && [
          'bg-gradient-to-r from-accent to-primary',
          'text-primary-foreground',
          'shadow-accent/25'
        ],
        
        // Custom styles
        className
      )}
      data-testid="discount-badge"
      aria-label={customText ? customText : `${discountPercentage}% de descuento`}
    >
      {displayText}
    </Badge>
  );
}

/**
 * Inline DiscountBadge for use in text or smaller spaces
 */
export function InlineDiscountBadge({
  discountPercentage,
  showPercent = true,
  customText,
  className
}: Pick<DiscountBadgeProps, 'discountPercentage' | 'showPercent' | 'customText' | 'className'>) {
  
  if (discountPercentage <= 0 && !customText) {
    return null;
  }

  const displayText = customText || 
    (showPercent ? `${discountPercentage}% OFF` : `${discountPercentage} OFF`);

  return (
    <Badge
      variant={discountPercentage >= 50 ? 'destructive' : 'secondary'}
      className={cn(
        'text-xs font-bold uppercase tracking-wide',
        'px-2 py-0.5',
        discountPercentage >= 50 && 'bg-red-500 text-white',
        className
      )}
      data-testid="inline-discount-badge"
    >
      {displayText}
    </Badge>
  );
}

/**
 * Corner ribbon style discount badge
 */
export function RibbonDiscountBadge({
  discountPercentage,
  showPercent = true,
  customText,
  className
}: Pick<DiscountBadgeProps, 'discountPercentage' | 'showPercent' | 'customText' | 'className'>) {
  
  if (discountPercentage <= 0 && !customText) {
    return null;
  }

  const displayText = customText || 
    (showPercent ? `${discountPercentage}%` : discountPercentage.toString());

  return (
    <div
      className={cn(
        // Ribbon container
        'absolute top-0 right-0 z-10',
        'w-16 h-16 overflow-hidden',
        className
      )}
      data-testid="ribbon-discount-badge"
    >
      <div
        className={cn(
          // Ribbon diagonal
          'absolute top-3 right-[-32px] w-24 h-6',
          'transform rotate-45',
          'flex items-center justify-center',
          'text-white text-xs font-bold uppercase tracking-wider',
          'shadow-lg',
          
          // Color based on discount
          discountPercentage >= 50 ? 'bg-red-500' : 'bg-orange-500'
        )}
        aria-label={customText ? customText : `${discountPercentage}% de descuento`}
      >
        {displayText}
      </div>
    </div>
  );
}
