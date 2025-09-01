import React from 'react';
import { Search, Package, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** The search query that returned no results */
  query?: string;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Show suggestions */
  showSuggestions?: boolean;
  /** Callback to clear search */
  onClear?: () => void;
  /** Callback to try a suggested search */
  onSuggestedSearch?: (query: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyState component shown when no search results are found
 * 
 * Features:
 * - User-friendly messaging
 * - Search suggestions (palindromes)
 * - Clear action buttons
 * - Accessible and semantic
 * - Responsive design
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <EmptyState query="xyz" />
 * 
 * // With callbacks
 * <EmptyState 
 *   query="test" 
 *   onClear={reset}
 *   onSuggestedSearch={search}
 * />
 * ```
 */
export default function EmptyState({
  query,
  title,
  description,
  showSuggestions = true,
  onClear,
  onSuggestedSearch,
  className
}: EmptyStateProps) {
  
  // Suggested palindromes for discounts
  const palindromeSuggestions = [
    { query: 'abba', description: 'Marca de productos deportivos' },
    { query: 'level', description: 'Herramientas de medición' },
    { query: 'radar', description: 'Equipamiento tecnológico' },
    { query: 'civic', description: 'Productos urbanos' },
  ];

  // Default content based on whether there's a query
  const defaultTitle = query 
    ? 'No encontramos productos'
    : 'Comienza tu búsqueda';
    
  const defaultDescription = query
    ? `No hay productos que coincidan con "${query}". Intenta con otros términos de búsqueda.`
    : 'Busca productos de tennis y descubre ofertas especiales con palíndromos.';

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center",
        "py-12 px-6 text-center",
        "min-h-[400px]",
        className
      )}
      data-testid="empty-state"
    >
      {/* Icon */}
      <div className="mb-6">
        {query ? (
          <Search className="h-16 w-16 text-muted-foreground/60" />
        ) : (
          <Package className="h-16 w-16 text-muted-foreground/60" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {title || defaultTitle}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
        {description || defaultDescription}
      </p>

      {/* Action Buttons */}
      {query && onClear && (
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onClear}
            className="min-w-[120px]"
          >
            Limpiar búsqueda
          </Button>
        </div>
      )}

      {/* Suggestions Section */}
      {showSuggestions && (
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>Prueba estas búsquedas con descuento del 50%:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {palindromeSuggestions.map((suggestion) => (
              <button
                key={suggestion.query}
                onClick={() => onSuggestedSearch?.(suggestion.query)}
                className={cn(
                  "p-4 text-left rounded-lg border border-border",
                  "hover:border-primary hover:bg-accent/50",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  !onSuggestedSearch && "cursor-default"
                )}
                disabled={!onSuggestedSearch}
              >
                <div className="font-medium text-foreground mb-1">
                  &quot;{suggestion.query}&quot;
                </div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.description}
                </div>
              </button>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            💡 Los palíndromos (palabras que se leen igual al revés) tienen descuentos especiales
          </p>
        </div>
      )}

      {/* Alternative suggestions for non-query empty states */}
      {!query && !showSuggestions && (
        <div className="text-sm text-muted-foreground mt-4">
          <p>Puedes buscar por:</p>
          <ul className="mt-2 space-y-1">
            <li>• Nombre del producto</li>
            <li>• Marca</li>
            <li>• Descripción</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Simplified EmptyState for smaller areas
 */
export function EmptyStateCompact({ 
  query, 
  onClear,
  className 
}: Pick<EmptyStateProps, 'query' | 'onClear' | 'className'>) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center",
        className
      )}
      data-testid="empty-state-compact"
    >
      <Search className="h-8 w-8 text-muted-foreground/60 mb-3" />
      <p className="text-sm text-muted-foreground mb-3">
        {query ? `No hay resultados para "${query}"` : 'No hay resultados'}
      </p>
      {query && onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar
        </Button>
      )}
    </div>
  );
}
