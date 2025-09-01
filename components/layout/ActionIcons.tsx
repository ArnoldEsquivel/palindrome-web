import React from 'react';
import { Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for ActionIcons component
 */
export interface ActionIconsProps {
  /** Number of items in cart (for badge display) */
  cartItemCount?: number;
  /** Number of items in wishlist */
  wishlistItemCount?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ActionIcons component for e-commerce header actions
 * 
 * Features:
 * - Wishlist/favorites icon with optional count
 * - Shopping cart icon with item count badge
 * - User profile icon
 * - Responsive design (mobile shows fewer icons)
 * - Visual only - no functional interactions
 * 
 * @example
 * ```tsx
 * <ActionIcons cartItemCount={2} wishlistItemCount={5} />
 * ```
 */
export default function ActionIcons({ 
  cartItemCount = 2, 
  wishlistItemCount,
  className 
}: ActionIconsProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Wishlist - hidden on mobile */}
      <div className="hidden sm:block relative">
        <button
          className={cn(
            "p-2 rounded-md hover:bg-muted/50 transition-colors duration-200",
            "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
          onClick={(e) => e.preventDefault()}
          aria-label="Lista de deseos"
        >
          <Heart className="h-5 w-5" />
          {wishlistItemCount && wishlistItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Shopping Cart */}
      <div className="relative">
        <button
          className={cn(
            "p-2 rounded-md hover:bg-muted/50 transition-colors duration-200",
            "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
          onClick={(e) => e.preventDefault()}
          aria-label={`Carrito de compras - ${cartItemCount} artículos`}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          className={cn(
            "p-2 rounded-md hover:bg-muted/50 transition-colors duration-200",
            "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
          onClick={(e) => e.preventDefault()}
          aria-label="Perfil de usuario"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Compact version for mobile
 */
export function CompactActionIcons({ 
  cartItemCount = 2,
  className 
}: Pick<ActionIconsProps, 'cartItemCount' | 'className'>) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Only cart and user on mobile */}
      <div className="relative">
        <button
          className={cn(
            "p-1.5 rounded-md hover:bg-muted/50 transition-colors duration-200",
            "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
          onClick={(e) => e.preventDefault()}
          aria-label={`Carrito - ${cartItemCount}`}
        >
          <ShoppingCart className="h-4 w-4" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-medium">
              {cartItemCount > 9 ? '9+' : cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative">
        <button
          className={cn(
            "p-1.5 rounded-md hover:bg-muted/50 transition-colors duration-200",
            "text-muted-foreground hover:text-foreground cursor-pointer"
          )}
          onClick={(e) => e.preventDefault()}
          aria-label="Perfil"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
