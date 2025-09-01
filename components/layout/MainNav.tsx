import React from 'react';
import { cn } from '@/lib/utils';
import NavMenu, { MobileNavMenu, type NavCategory } from './NavMenu';
import ActionIcons, { CompactActionIcons } from './ActionIcons';

/**
 * Props for MainNav component
 */
export interface MainNavProps {
  /** Navigation categories (optional, uses defaults if not provided) */
  categories?: NavCategory[];
  /** Number of items in cart */
  cartItemCount?: number;
  /** Number of items in wishlist */
  wishlistItemCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MainNav component for e-commerce main navigation bar
 * 
 * Features:
 * - Brand logo/title on the left
 * - Navigation menu in the center (desktop)
 * - Action icons on the right
 * - Responsive design with mobile adaptations
 * - Visual only - no functional interactions
 * 
 * @example
 * ```tsx
 * <MainNav cartItemCount={2} wishlistItemCount={5} />
 * ```
 */
export default function MainNav({ 
  categories,
  cartItemCount = 2,
  wishlistItemCount,
  className 
}: MainNavProps) {
  return (
    <nav className={cn(
      "bg-card shadow-sm border-b border-border/50",
      className
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-foreground">
                Za-🦆🦆🦆 Tennis Store
              </h1>
              <p className="hidden sm:block text-xs text-muted-foreground">
                Tu tienda de tennis favorita
              </p>
            </div>
          </div>

          {/* Center Navigation - Desktop only */}
          <NavMenu 
            categories={categories}
            className="flex-1 justify-center mx-8"
          />

          {/* Action Icons Section */}
          <div className="flex items-center gap-2">
            {/* Desktop version */}
            <ActionIcons 
              cartItemCount={cartItemCount}
              wishlistItemCount={wishlistItemCount}
              className="hidden sm:flex"
            />
            
            {/* Mobile version */}
            <CompactActionIcons 
              cartItemCount={cartItemCount}
              className="sm:hidden"
            />
          </div>
        </div>

        {/* Mobile Navigation - Below main bar */}
        <MobileNavMenu 
          categories={categories}
          className="mt-3 pt-3 border-t border-border/30"
        />
      </div>
    </nav>
  );
}

/**
 * Compact version of MainNav for smaller headers
 */
export function CompactMainNav({ 
  cartItemCount = 2,
  className 
}: Pick<MainNavProps, 'cartItemCount' | 'className'>) {
  return (
    <nav className={cn(
      "bg-card shadow-sm border-b border-border/50",
      className
    )}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Simplified Logo */}
          <div className="flex items-center">
            <h1 className="text-base md:text-lg font-bold text-foreground">
              Za-🦆🦆🦆 Tennis
            </h1>
          </div>

          {/* Compact Actions */}
          <CompactActionIcons cartItemCount={cartItemCount} />
        </div>
      </div>
    </nav>
  );
}
