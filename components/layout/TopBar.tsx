import React from 'react';
import { Truck, Phone, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for TopBar component
 */
export interface TopBarProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * TopBar component for e-commerce header information
 * 
 * Features:
 * - Promotional messaging (free shipping)
 * - Contact information
 * - Help/support links
 * - Responsive design with mobile simplification
 * - Visual only - no functional interactions
 * 
 * @example
 * ```tsx
 * <TopBar />
 * ```
 */
export default function TopBar({ className }: TopBarProps) {
  return (
    <div className={cn(
      "bg-muted/30 border-b border-border/30 text-xs text-muted-foreground",
      className
    )}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Promotional message */}
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3" />
            <span className="hidden sm:inline">
              Envío gratis en compras mayores a $1,000 MXN
            </span>
            <span className="sm:hidden">
              Envío gratis +$1,000
            </span>
          </div>

          {/* Right side - Contact and help */}
          <div className="flex items-center gap-4">
            {/* Contact */}
            <div className="hidden md:flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>800-TENNIS</span>
            </div>

            {/* Help */}
            <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              <HelpCircle className="h-3 w-3" />
              <span>Ayuda</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
