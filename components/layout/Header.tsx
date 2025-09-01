import React from 'react';
import { cn } from '@/lib/utils';
import TopBar from './TopBar';
import MainNav, { CompactMainNav } from './MainNav';
import type { NavCategory } from './NavMenu';

/**
 * Props for Header component
 */
export interface HeaderProps {
  /** Navigation categories (optional, uses defaults if not provided) */
  categories?: NavCategory[];
  /** Number of items in cart */
  cartItemCount?: number;
  /** Number of items in wishlist */
  wishlistItemCount?: number;
  /** Whether to show the top bar with promotional info */
  showTopBar?: boolean;
  /** Whether to use compact version */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Header component for e-commerce site
 * 
 * Features:
 * - Complete e-commerce header with top bar and main navigation
 * - Responsive design that adapts to different screen sizes
 * - Visual tennis store branding and navigation
 * - Shopping cart and user action icons
 * - Professional appearance without functional interactions
 * 
 * @example
 * ```tsx
 * <Header cartItemCount={2} wishlistItemCount={5} />
 * <Header compact showTopBar={false} />
 * ```
 */
export default function Header({ 
  categories,
  cartItemCount = 2,
  wishlistItemCount,
  showTopBar = true,
  compact = false,
  className 
}: HeaderProps) {
  if (compact) {
    return (
      <header className={cn("w-full", className)}>
        <CompactMainNav cartItemCount={cartItemCount} />
      </header>
    );
  }

  return (
    <header className={cn("w-full", className)}>
      {/* Top promotional bar */}
      {showTopBar && <TopBar />}
      
      {/* Main navigation */}
      <MainNav 
        categories={categories}
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
      />
    </header>
  );
}

/**
 * Header with custom branding
 */
export function CustomHeader({ 
  title = "Za-🦆🦆🦆 Tennis Store",
  subtitle = "Tu tienda de tennis favorita",
  cartItemCount = 2,
  className 
}: {
  title?: string;
  subtitle?: string;
  cartItemCount?: number;
  className?: string;
}) {
  return (
    <header className={cn("w-full", className)}>
      <nav className="bg-card shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Custom Logo/Brand */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold text-foreground">
                  {title}
                </h1>
                <p className="hidden sm:block text-xs text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Simple actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  className="p-2 rounded-md hover:bg-muted/50 transition-colors duration-200 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                >
                  🛒
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="relative">
                <button
                  className="p-2 rounded-md hover:bg-muted/50 transition-colors duration-200 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={(e) => e.preventDefault()}
                >
                  👤
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
