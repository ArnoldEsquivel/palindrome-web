import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Navigation category item
 */
export interface NavCategory {
  /** Category name */
  name: string;
  /** Visual href (non-functional) */
  href?: string;
}

/**
 * Props for NavMenu component
 */
export interface NavMenuProps {
  /** Navigation categories */
  categories?: NavCategory[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default tennis store categories
 */
const defaultCategories: NavCategory[] = [
  { name: 'Raquetas', href: '#' },
  { name: 'Pelotas', href: '#' },
  { name: 'Calzado', href: '#' },
  { name: 'Accesorios', href: '#' },
  { name: 'Ofertas', href: '#' },
];

/**
 * NavMenu component for e-commerce navigation
 * 
 * Features:
 * - Tennis product categories
 * - Responsive navigation (collapses on mobile)
 * - Hover states for better UX
 * - Visual only - no functional navigation
 * 
 * @example
 * ```tsx
 * <NavMenu />
 * <NavMenu categories={customCategories} />
 * ```
 */
export default function NavMenu({ 
  categories = defaultCategories, 
  className 
}: NavMenuProps) {
  return (
    <nav className={cn("hidden md:flex items-center gap-6", className)}>
      {categories.map((category, index) => (
        <a
          key={index}
          href={category.href}
          className={cn(
            "text-sm font-medium text-foreground hover:text-primary",
            "transition-colors duration-200 cursor-pointer",
            "px-2 py-1 rounded-md hover:bg-muted/50"
          )}
          // Prevent actual navigation since this is visual only
          onClick={(e) => e.preventDefault()}
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}

/**
 * Mobile version of NavMenu (simplified)
 */
export function MobileNavMenu({ 
  categories = defaultCategories, 
  className 
}: NavMenuProps) {
  return (
    <nav className={cn("md:hidden flex items-center gap-2", className)}>
      {/* Show only first 3 categories on mobile */}
      {categories.slice(0, 3).map((category, index) => (
        <a
          key={index}
          href={category.href}
          className={cn(
            "text-xs font-medium text-foreground hover:text-primary",
            "transition-colors duration-200 cursor-pointer",
            "px-2 py-1 rounded-md hover:bg-muted/50"
          )}
          onClick={(e) => e.preventDefault()}
        >
          {category.name}
        </a>
      ))}
      {categories.length > 3 && (
        <span className="text-xs text-muted-foreground">+{categories.length - 3}</span>
      )}
    </nav>
  );
}
